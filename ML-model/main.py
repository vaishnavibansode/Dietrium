from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import random
import os
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import NearestNeighbors
import re

# MongoDB collections
from Database import recommendations_collection
from Database import users_collection
# Image utility
from recipe_images import get_image_for_recipe, DEFAULT_MEAL_IMAGES

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, methods=["GET", "POST", "OPTIONS"])

# Load dataset and prepare model
df_recipes = None
scaler = None
nn_model = None

def parse_instructions(inst_str):
    if not isinstance(inst_str, str):
        return []
    # If R-style vector c("...")
    if inst_str.startswith('c(') and inst_str.endswith(')'):
        steps = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', inst_str)
        if steps:
            return [step.replace('\\"', '"').strip() for step in steps]
    return [step.strip() for step in inst_str.split('\n') if step.strip()]

def init_model():
    global df_recipes, scaler, nn_model
    try:
        csv_path = os.path.join(os.path.dirname(__file__), "recipes_small.csv")
        print(f"Loading recipes from {csv_path}...")
        df_recipes = pd.read_csv(csv_path)
        
        features = [
            'Calories', 'FatContent', 'SaturatedFatContent', 'CholesterolContent', 
            'SodiumContent', 'CarbohydrateContent', 'FiberContent', 'SugarContent', 
            'ProteinContent'
        ]
        X = df_recipes[features].to_numpy()
        
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        nn_model = NearestNeighbors(n_neighbors=5, metric='cosine', algorithm='brute')
        nn_model.fit(X_scaled)
        print("Model initialized and fit successfully!")
    except Exception as e:
        print("Error initializing recommendation model:", str(e))

init_model()

# Activity multipliers
activity_multipliers = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "active": 1.725,
    "very_active": 1.9
}

# BMR calculation
def calculate_bmr(weight, height, age, gender):
    if gender.lower() == 'male':
        return 10 * weight + 6.25 * height - 5 * age + 5
    else:
        return 10 * weight + 6.25 * height - 5 * age - 161


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route("/recommend", methods=["POST"])
def recommend():
    try:
        data = request.get_json()

        weight = float(data['weight'])
        height = float(data['height'])
        age = int(data['age'])
        gender = data['gender']
        activity_level = data.get('activity_level') or data.get('activity')
        if not activity_level:
            return jsonify({"error": "Activity level is required"}), 400
            
        email = data.get('email', 'anonymous')

        bmr = calculate_bmr(weight, height, age, gender)
        tdee = bmr * activity_multipliers.get(activity_level, 1.2)

        # Generate targets for breakfast (25%), lunch (40%), dinner (35%)
        targets = {
            "breakfast": 0.25 * tdee,
            "lunch": 0.40 * tdee,
            "dinner": 0.35 * tdee
        }
        
        recommendations = {}
        for meal_type, target_cal in targets.items():
            # Build healthy target query vector: 50% Carbs, 20% Protein, 30% Fat
            target_fat = (0.30 * target_cal) / 9.0
            target_carbs = (0.50 * target_cal) / 4.0
            target_protein = (0.20 * target_cal) / 4.0
            
            target_sat_fat = target_fat / 3.0
            target_cholesterol = (300.0 * target_cal) / 2000.0
            target_sodium = (2300.0 * target_cal) / 2000.0
            target_fiber = (25.0 * target_cal) / 2000.0
            target_sugar = (50.0 * target_cal) / 2000.0
            
            query = np.array([[
                target_cal, target_fat, target_sat_fat, target_cholesterol, 
                target_sodium, target_carbs, target_fiber, target_sugar, target_protein
            ]])
            
            query_scaled = scaler.transform(query)
            distances, indices = nn_model.kneighbors(query_scaled, n_neighbors=5)
            
            meal_list = []
            # Select a random recipe among the top 5 matches to add variety
            selected_indices = random.sample(list(indices[0]), 3)
            for idx in selected_indices:
                row = df_recipes.iloc[idx]
                instructions = parse_instructions(row['RecipeInstructions'])
                img_url = row['Cleaned_Image']
                if isinstance(img_url, str):
                    img_url = img_url.strip('"').strip("'")
                else:
                    img_url = ""
                    
                meal_list.append({
                    "RecipeId": str(row['RecipeId']),
                    "Name": str(row['Name']),
                    "Calories": float(row['Calories']),
                    "RecipeInstructions": instructions,
                    "Images": img_url
                })
            recommendations[meal_type] = meal_list

        # Store in DB
        recommendations_collection.insert_one({
            "email": email,
            "weight": weight,
            "height": height,
            "age": age,
            "gender": gender,
            "activity_level": activity_level,
            "recommendations": recommendations,
            "bmr": bmr,
            "tdee": tdee
        })

        return jsonify({
            "bmr": round(bmr, 2),
            "tdee": round(tdee, 2),
            "recommendations": recommendations
        })

    except Exception as e:
        print("🔥 Error in /recommend:", str(e))
        return jsonify({"error": str(e)}), 500


# @app.route("/history", methods=["GET"])
# def history():
#     try:
#         history = list(recommendations_collection.find({}, {"_id": 0}))
#         return jsonify(history)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# @app.route("/users", methods=["GET"])
# def get_users():
#     try:
#         users = list(users_collection.find({}, {"_id": 0}))
#         return jsonify(users)
#     except Exception as e:
#         print("🔥 ERROR:", str(e))
#         return jsonify({"error": str(e)}), 500


# @app.route("/login", methods=["POST"])
# def login():
#     try:
#         data = request.get_json()
#         email = data.get('email')
#         password = data.get('password')

#         if not email or not password:
#             return jsonify({"error": "Email and password are required"}), 400

#         user = users_collection.find_one({"email": email, "password": password}, {"_id": 0})
#         if user:
#             print(f"✅ User logged in: {email}")
#             return jsonify(user)
#         else:
#             return jsonify({"error": "Invalid credentials"}), 401
#     except Exception as e:
#         print("🔥 ERROR:", str(e))
#         return jsonify({"error": str(e)}), 500

  
@app.route("/history", methods=["GET"])
def history():
    # Fetch all recommendations from MongoDB
    history = list(recommendations_collection.find({}, {"_id": 0}))  # Exclude the MongoDB `_id` field
    return jsonify(history) 

@app.route("/users", methods=["GET"])
def get_users():
    try:
        # Fetch all user data from the `users` collection
        users = list(users_collection.find({}, {"_id": 0}))  # Exclude the MongoDB `_id` field
        return jsonify(users)
    except Exception as e:
        print("🔥 ERROR:", str(e))
        return jsonify({"error": str(e)}), 500
        
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
            
        # Find user by email and password
        user = users_collection.find_one({"email": email, "password": password}, {"_id": 0})
        
        if user:
            print(f"User logged in: {email}")
            return jsonify(user)
        else:
            return jsonify({"error": "Invalid credentials"}), 401
            
    except Exception as e:
        print("🔥 ERROR:", str(e))
        return jsonify({"error": str(e)}), 500
        
@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
            
        # Check if user already exists
        existing_user = users_collection.find_one({"email": email})
        if existing_user:
            return jsonify({"error": "User with this email already exists"}), 409
            
        # Create new user
        user_data = data.copy()
        result = users_collection.insert_one(user_data)
        
        # Return user data without _id field
        user_data.pop('_id', None)
        print(f"New user registered: {email}")
        
        return jsonify(user_data)
            
    except Exception as e:
        print("🔥 ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route("/update_profile", methods=["POST"])
def update_profile():
    try:
        data = request.get_json()
        print("Received profile update data:", data)
        
        # Check if user exists (using email as unique identifier)
        email = data.get('email')
        if not email:
            print("Error: Email is missing in the request")
            return jsonify({"error": "Email is required"}), 400
            
        existing_user = users_collection.find_one({"email": email})
        print("Existing user found:", existing_user is not None)
        
        if existing_user:
            # Update existing user
            result = users_collection.update_one(
                {"email": email},
                {"$set": data}
            )
            print("Update result:", result.modified_count, "document(s) modified")
        else:
            # Create new user
            result = users_collection.insert_one(data)
            print("Insert result: Document inserted with ID:", result.inserted_id)
            
        return jsonify({"success": True, "message": "Profile updated successfully"})
        
    except Exception as e:
        print("🔥 ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

 

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
