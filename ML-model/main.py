from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import random
import os

# MongoDB collections
from Database import recommendations_collection
from Database import users_collection
# Image utility
from recipe_images import get_image_for_recipe, DEFAULT_MEAL_IMAGES

app = Flask(__name__)
# CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}}, methods=["GET", "POST", "OPTIONS"])


# Load trained model
model = joblib.load("diet_recommender_model.pkl")

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

@app.route("/recommend", methods=["POST"])
def recommend():
    try:
        data = request.get_json()

        weight = float(data['weight'])
        height = float(data['height'])
        age = int(data['age'])
        gender = data['gender']
        activity_level = data['activity_level']
        email = data.get('email', 'anonymous')

        bmr = calculate_bmr(weight, height, age, gender)
        tdee = bmr * activity_multipliers.get(activity_level, 1.2)

        # Make prediction using model
        features = np.array([[weight, height, age, tdee]])  # Adjust if your model expects more inputs
        prediction = model.predict(features)[0]

        # Assign meals (you can customize this logic)
        meals = {
            "breakfast": prediction + " (Breakfast)",
            "lunch": prediction + " (Lunch)",
            "dinner": prediction + " (Dinner)"
        }

        # Add image URLs
        meals_with_images = {
            meal: {
                "name": name,
                "image": get_image_for_recipe(name) or DEFAULT_MEAL_IMAGES.get(meal, "")
            }
            for meal, name in meals.items()
        }

        # Store in DB
        recommendations_collection.insert_one({
            "email": email,
            "weight": weight,
            "height": height,
            "age": age,
            "gender": gender,
            "activity_level": activity_level,
            "recommendation": meals_with_images
        })

        return jsonify({
            "tdee": round(tdee, 2),
            "meals": meals_with_images
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
