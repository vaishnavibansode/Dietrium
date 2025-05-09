from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
# Get MongoDB connection string from environment variables
mongodb_uri = os.getenv("MONGODB_URI")

client = MongoClient(mongodb_uri)

# Create or connect to the database
db = client["diet_recommendation"]

# Create or connect to the collection
recommendations_collection = db["recommendations"]
users_collection = db["users"]  # New collection for user data