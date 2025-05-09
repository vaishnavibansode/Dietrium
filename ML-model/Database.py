from pymongo import MongoClient

# Replace with your MongoDB connection string
client = MongoClient("mongodb+srv://202301040131:<db_password>@cluster0.jeryt.mongodb.net/Dieterium?retryWrites=true&w=majority&appName=Cluster0")  # For local MongoDB
# For MongoDB Atlas, use: MongoClient("mongodb+srv://<username>:<password>@cluster.mongodb.net/diet_recommendation")

# Create or connect to the database
db = client["diet_recommendation"]

# Create or connect to the collection
recommendations_collection = db["recommendations"]
users_collection = db["users"]  # New collection for user data
