import React, { useState, useEffect } from 'react';
import { MealRecommendation } from '../types';
import { getRelevantImageForRecipe } from '../utils/recipeImageHelper';
import RecipeModal from './RecipeModal';

interface MealCardProps {
  meal: MealRecommendation;
  type: 'breakfast' | 'lunch' | 'dinner';
  className?: string;
}

const MealCard: React.FC<MealCardProps> = ({ meal, type, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [optimizedImage, setOptimizedImage] = useState<string>('');
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Select the most relevant image for this recipe when component mounts
  useEffect(() => {
    setIsImageLoading(true);
    const relevantImage = getRelevantImageForRecipe(meal.Name, type, meal.Images);
    setOptimizedImage(relevantImage);
    setIsImageLoading(false);
  }, [meal.Name, meal.Images, type]);
  
  const mealTypeColors = {
    breakfast: 'bg-blue-50 border-blue-200',
    lunch: 'bg-emerald-50 border-emerald-200',
    dinner: 'bg-amber-50 border-amber-200',
  };

  const mealTypeIcons = {
    breakfast: '🍳',
    lunch: '🥗',
    dinner: '🍲',
  };

  const formatInstructions = (instructions?: string | string[]) => {
    if (!instructions) return '';
    
    // Handle both string and array cases
    const instructionText = Array.isArray(instructions) 
      ? instructions.join(' ') 
      : instructions;
    
    return instructionText.length > 150 
      ? `${instructionText.slice(0, 150)}...` 
      : instructionText;
  };

  // Determine which image to use
  const getImageUrl = () => {
    if (imageError || !optimizedImage) {
      // Get a new relevant image if the current one fails
      return getRelevantImageForRecipe(meal.Name, type);
    }
    return optimizedImage;
  };

  // Handle image loading errors
  const handleImageError = () => {
    console.log(`Image failed to load for ${meal.Name}, finding alternative`);
    setImageError(true);
    // Get a new relevant image
    const newImage = getRelevantImageForRecipe(meal.Name, type);
    setOptimizedImage(newImage);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Create a recipe object with the optimized image
  const recipeWithImage = {
    ...meal,
    Images: getImageUrl()
  };

  return (
    <>
      <div className={`rounded-lg overflow-hidden shadow-md border ${mealTypeColors[type]} hover:shadow-lg transition-shadow duration-300 ${className}`}>
        <div className="h-48 overflow-hidden relative">
          {isImageLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="animate-pulse w-8 h-8 rounded-full bg-gray-300"></div>
            </div>
          ) : (
            <>
              <img
                src={getImageUrl()}
                alt={meal.Name}
                onError={handleImageError}
                onLoad={() => setIsImageLoading(false)}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {mealTypeIcons[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
            <span className="text-sm font-medium text-gray-600">{Math.round(meal.Calories)} kcal</span>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">{meal.Name}</h3>
          {meal.RecipeInstructions && (
            <p className="text-sm text-gray-600 mb-4">{formatInstructions(meal.RecipeInstructions)}</p>
          )}
          <button 
            onClick={openModal}
            className="text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors"
          >
            View Recipe →
          </button>
        </div>
      </div>

      {/* Recipe Modal */}
      <RecipeModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        recipe={recipeWithImage} 
        mealType={type} 
      />
    </>
  );
};

export default MealCard;