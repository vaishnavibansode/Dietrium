"""
Module for handling recipe images in the diet recommendation system.
Provides functions to get appropriate images for recipes based on recipe name and meal type.
"""

# Default meal images for different meal types
DEFAULT_MEAL_IMAGES = {
    "breakfast": [
        "https://images.unsplash.com/photo-1533089860892-a9c9f5a37eb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
        "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
    ],
    "lunch": [
        "https://images.unsplash.com/photo-1547496502-affa22d38842?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1051&q=80",
        "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
    ],
    "dinner": [
        "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
        "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=1049&q=80",
        "https://images.unsplash.com/photo-1536489885071-87983c3e2859?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
    ]
}

# Keyword-based image mapping for specific recipe types
RECIPE_KEYWORD_IMAGES = {
    # Breakfast items
    "pancake": "https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "egg": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "oatmeal": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "toast": "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "cereal": "https://images.unsplash.com/photo-1545081575-8e0137c5b8eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "smoothie": "https://images.unsplash.com/photo-1553530666-ba11a90bb0ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    
    # Lunch items
    "salad": "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1051&q=80",
    "sandwich": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1053&q=80",
    "soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1051&q=80",
    "wrap": "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "pasta": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    
    # Dinner items
    "steak": "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=1049&q=80",
    "fish": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "chicken": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "rice": "https://images.unsplash.com/photo-1536489885071-87983c3e2859?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "vegetable": "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "curry": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=1051&q=80",
    "pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    "burger": "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
}

def get_image_for_recipe(recipe_name, meal_type):
    """
    Get an appropriate image URL for a recipe based on its name and meal type.
    
    Args:
        recipe_name (str): The name of the recipe
        meal_type (str): The type of meal (breakfast, lunch, dinner)
        
    Returns:
        str: URL of an image that matches the recipe or a default image for the meal type
    """
    # Convert recipe name to lowercase for case-insensitive matching
    recipe_name_lower = recipe_name.lower()
    
    # Check if any keywords in the recipe name match our image mapping
    for keyword, image_url in RECIPE_KEYWORD_IMAGES.items():
        if keyword in recipe_name_lower:
            return image_url
    
    # If no specific match, return a random default image for the meal type
    if meal_type in DEFAULT_MEAL_IMAGES:
        import random
        return random.choice(DEFAULT_MEAL_IMAGES[meal_type])
    
    # Fallback to a generic food image if meal type is not recognized
    return "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"