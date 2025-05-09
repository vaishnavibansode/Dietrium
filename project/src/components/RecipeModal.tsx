import React from 'react';
import { MealRecommendation } from '../types';
import { X } from 'lucide-react';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: MealRecommendation;
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

const RecipeModal: React.FC<RecipeModalProps> = ({ isOpen, onClose, recipe, mealType }) => {
  if (!isOpen) return null;

  const mealTypeColors = {
    breakfast: 'bg-blue-50 border-blue-200 text-blue-800',
    lunch: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    dinner: 'bg-amber-50 border-amber-200 text-amber-800',
  };

  const mealTypeIcons = {
    breakfast: '🍳',
    lunch: '🥗',
    dinner: '🍲',
  };

  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        <div className="relative">
          {recipe.Images && (
            <img 
              src={recipe.Images} 
              alt={recipe.Name} 
              className="w-full h-64 object-cover rounded-t-lg"
            />
          )}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${mealTypeColors[mealType]}`}>
              {mealTypeIcons[mealType]} {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </span>
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {Math.round(recipe.Calories)} kcal
            </span>
          </div>
          
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{recipe.Name}</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Instructions</h3>
            <ol className="list-decimal pl-5 space-y-2">
              {Array.isArray(recipe.RecipeInstructions) ? (
                recipe.RecipeInstructions.map((step, index) => (
                  <li key={index} className="text-gray-600">{step}</li>
                ))
              ) : (
                <li className="text-gray-600">{recipe.RecipeInstructions}</li>
              )}
            </ol>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;