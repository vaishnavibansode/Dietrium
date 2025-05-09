export interface User {
  id?: string;
  name: string;
  email: string;
  weight?: number;
  height?: number;
  age?: number;
  gender?: 'male' | 'female';
  activity?: ActivityLevel;
  foodPreferences?: string[];
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface MealRecommendation {
  RecipeId: string;
  Name: string;
  Images?: string;
  Calories: number;
  RecipeInstructions: string[];
}

export interface RecommendationResponse {
  bmr: number;
  tdee: number;
  recommendations: {
    breakfast: MealRecommendation[];
    lunch: MealRecommendation[];
    dinner: MealRecommendation[];
  };
}