from pymongo import MongoClient

# Replace with your MongoDB connection string
client = MongoClient("mongodb://localhost:27017/")  # For local MongoDB
# For MongoDB Atlas, use: MongoClient("mongodb+srv://<username>:<password>@cluster.mongodb.net/diet_recommendation")

# Create or connect to the database
db = client["diet_recommendation"]

# Create or connect to the collection
recommendations_collection = db["recommendations"]
users_collection = db["users"]  # New collection for user data