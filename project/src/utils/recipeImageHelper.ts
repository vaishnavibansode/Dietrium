// Recipe image helper functions

// Common food keywords for each meal type
const FOOD_KEYWORDS = {
  breakfast: [
    'egg', 'oatmeal', 'pancake', 'toast', 'cereal', 'yogurt', 'smoothie', 
    'bacon', 'avocado', 'omelet', 'scrambled', 'muffin', 'waffle', 'bagel'
  ],
  lunch: [
    'salad', 'sandwich', 'soup', 'pasta', 'wrap', 'bowl', 'rice', 'chicken', 
    'burger', 'quinoa', 'taco', 'burrito', 'stir fry', 'pizza'
  ],
  dinner: [
    'steak', 'fish', 'chicken', 'pasta', 'curry', 'roast', 'vegetable', 
    'pizza', 'casserole', 'beef', 'pork', 'lamb', 'seafood', 'risotto'
  ]
};

// Fallback images for each meal type
const FALLBACK_IMAGES = {
  breakfast: [
    'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/2662875/pexels-photo-2662875.jpeg?auto=compress&cs=tinysrgb&w=600'
  ],
  lunch: [
    'https://images.pexels.com/photos/1660030/pexels-photo-1660030.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600'
  ],
  dinner: [
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=600'
  ]
};

// Specific food images
const FOOD_IMAGES = {
  // Breakfast
  egg: 'https://images.pexels.com/photos/139746/pexels-photo-139746.jpeg?auto=compress&cs=tinysrgb&w=600',
  oatmeal: 'https://images.pexels.com/photos/4916151/pexels-photo-4916151.jpeg?auto=compress&cs=tinysrgb&w=600',
  pancake: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600',
  toast: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=600',
  cereal: 'https://images.pexels.com/photos/135525/pexels-photo-135525.jpeg?auto=compress&cs=tinysrgb&w=600',
  yogurt: 'https://images.pexels.com/photos/128865/pexels-photo-128865.jpeg?auto=compress&cs=tinysrgb&w=600',
  smoothie: 'https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&w=600',
  
  // Lunch
  salad: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=600',
  sandwich: 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=600',
  soup: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=600',
  pasta: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600',
  rice: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=600',
  chicken: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=600',
  burger: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600',
  
  // Dinner
  steak: 'https://images.pexels.com/photos/323682/pexels-photo-323682.jpeg?auto=compress&cs=tinysrgb&w=600',
  fish: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=600',
  curry: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600',
  roast: 'https://images.pexels.com/photos/236887/pexels-photo-236887.jpeg?auto=compress&cs=tinysrgb&w=600',
  pizza: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=600',
  
  // Special cases
  cake: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600',
  pie: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=600',
  cookie: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=600',
  dessert: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=600',
  meatball: 'https://images.pexels.com/photos/6941004/pexels-photo-6941004.jpeg?auto=compress&cs=tinysrgb&w=600',
  marmalade: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=600',
  orange: 'https://images.pexels.com/photos/42059/citrus-diet-food-fresh-42059.jpeg?auto=compress&cs=tinysrgb&w=600',
  oyster: 'https://images.pexels.com/photos/8969237/pexels-photo-8969237.jpeg?auto=compress&cs=tinysrgb&w=600',
  chili: 'https://images.pexels.com/photos/5836771/pexels-photo-5836771.jpeg?auto=compress&cs=tinysrgb&w=600',
  bbq: 'https://images.pexels.com/photos/1105325/pexels-photo-1105325.jpeg?auto=compress&cs=tinysrgb&w=600',
  tex: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=600',
  mex: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=600',
  sauerkraut: 'https://images.pexels.com/photos/5835353/pexels-photo-5835353.jpeg?auto=compress&cs=tinysrgb&w=600',
  pork: 'https://images.pexels.com/photos/929137/pexels-photo-929137.jpeg?auto=compress&cs=tinysrgb&w=600',
};

/**
 * Check if a recipe name contains any of the food keywords
 * @param recipeName The name of the recipe
 * @param mealType The type of meal (breakfast, lunch, dinner)
 * @returns The most relevant image URL for the recipe
 */
export const getRelevantImageForRecipe = (
  recipeName: string, 
  mealType: 'breakfast' | 'lunch' | 'dinner',
  providedImage?: string
): string => {
  // If a valid image is provided, use it
  if (providedImage && providedImage.startsWith('http')) {
    // Check if it's one of our fallback images
    const isFallbackImage = FALLBACK_IMAGES[mealType].includes(providedImage);
    
    // If it's not a fallback image, it's probably specific to the recipe, so use it
    if (!isFallbackImage) {
      return providedImage;
    }
    // Otherwise, continue to try to find a more specific image
  }
  
  // Convert recipe name to lowercase for matching
  const recipeNameLower = recipeName.toLowerCase();
  
  // First check for special cases that might be in any meal type
  for (const [keyword, imageUrl] of Object.entries(FOOD_IMAGES)) {
    if (recipeNameLower.includes(keyword.toLowerCase())) {
      return imageUrl;
    }
  }
  
  // Then check for meal-specific keywords
  for (const keyword of FOOD_KEYWORDS[mealType]) {
    if (recipeNameLower.includes(keyword)) {
      // If we have a specific image for this keyword, use it
      if (FOOD_IMAGES[keyword as keyof typeof FOOD_IMAGES]) {
        return FOOD_IMAGES[keyword as keyof typeof FOOD_IMAGES];
      }
    }
  }
  
  // If no specific image is found, return a random fallback image for the meal type
  const fallbackArray = FALLBACK_IMAGES[mealType];
  const randomIndex = Math.floor(Math.random() * fallbackArray.length);
  return fallbackArray[randomIndex];
};

/**
 * Check if an image URL is one of our fallback images
 * @param imageUrl The image URL to check
 * @returns True if the image is a fallback image, false otherwise
 */
export const isFallbackImage = (imageUrl: string): boolean => {
  for (const mealType in FALLBACK_IMAGES) {
    if (FALLBACK_IMAGES[mealType as keyof typeof FALLBACK_IMAGES].includes(imageUrl)) {
      return true;
    }
  }
  return false;
};