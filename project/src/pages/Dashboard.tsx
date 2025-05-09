import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Button from '../components/Button';
import MetricCard from '../components/MetricCard';
import MealCard from '../components/MealCard';
import { getDietRecommendations } from '../services/api';
import { RecommendationResponse } from '../types';
import { Activity, Flame, Scale, Heart } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/login');
    } else if (
      !state.user?.weight ||
      !state.user?.height ||
      !state.user?.age ||
      !state.user?.gender ||
      !state.user?.activity
    ) {
      navigate('/profile');
    }
  }, [state.isAuthenticated, state.user, navigate]);

  const getRecommendations = async () => {
    if (
      !state.user?.weight ||
      !state.user?.height ||
      !state.user?.age ||
      !state.user?.gender ||
      !state.user?.activity
    ) {
      navigate('/profile');
      return;
    }

    setLoading(true);
    try {
      const response = await getDietRecommendations({
        weight: state.user.weight,
        height: state.user.height,
        age: state.user.age,
        gender: state.user.gender,
        activity: state.user.activity,
      });
      setRecommendations(response);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      // For demo, create sample data
      setRecommendations({
        bmr: 1800,
        tdee: 2200,
        recommendations: {
          breakfast: [
            {
              RecipeId: '1',
              Name: 'Avocado Toast with Eggs',
              Calories: 450,
              RecipeInstructions: [
                'Toast bread.',
                'Mash avocado on top.',
                'Add a fried egg.',
                'Season with salt, pepper, and red pepper flakes.'
              ],
              Images: 'https://example.com/image1.jpg'// Add the Images property

            }
          ],
          lunch: [
            {
              RecipeId: '2',
              Name: 'Grilled Chicken Salad',
              Calories: 650,
              RecipeInstructions: ['Grill chicken breast',' slice','add to a bowl with mixed greens','top with sliced cherry tomatoes',' cucumbers','and croutons and your favorite dressing.']
            }
          ],
          dinner: [
            {
              RecipeId: '3',
              Name: 'Salmon with Roasted Vegetables',
              Calories: 550,
              RecipeInstructions: ['Bake salmon fillet and serve with a side of roasted broccoli',' drizzle olive oil and season with salt and pepper.','Roast carrots, zucchini, bell peppers, and sweet potatoes.']
            }
          ],
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="animate-fadeIn">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Nutrition Dashboard</h1>
        
        {state.user && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Your Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Weight"
                value={state.user.weight || '-'}
                unit="kg"
                icon={<Scale size={18} />}
              />
              <MetricCard
                title="Height"
                value={state.user.height || '-'}
                unit="cm"
                icon={<Activity size={18} />}
              />
              {recommendations && (
                <>
                  <MetricCard
                    title="Basal Metabolic Rate"
                    value={Math.round(recommendations.bmr)}
                    unit="kcal"
                    icon={<Flame size={18} />}
                  />
                  <MetricCard
                    title="Daily Calorie Needs"
                    value={Math.round(recommendations.tdee)}
                    unit="kcal"
                    icon={<Heart size={18} />}
                  />
                </>
              )}
            </div>
          </div>
        )}
        
        {!recommendations ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Ready for your personalized meal plan?</h2>
            <p className="text-gray-600 mb-6">
              Click the button below to get meal recommendations based on your profile.
            </p>
            <Button onClick={getRecommendations} isLoading={loading}>
              Get Meal Recommendations
            </Button>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-700">Your Meal Recommendations</h2>
                <Button variant="outline" onClick={getRecommendations} isLoading={loading}>
                  Refresh Recommendations
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.recommendations.breakfast.map((meal) => (
                  <MealCard key={meal.RecipeId} meal={meal} type="breakfast" />
                ))}
                
                {recommendations.recommendations.lunch.map((meal) => (
                  <MealCard key={meal.RecipeId} meal={meal} type="lunch" />
                ))}
                
                {recommendations.recommendations.dinner.map((meal) => (
                  <MealCard key={meal.RecipeId} meal={meal} type="dinner" />
                ))}
              </div>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
              <h3 className="text-emerald-800 font-medium mb-2">Daily Nutrition Summary</h3>
              <p className="text-gray-600 text-sm">
                Your recommended daily intake is approximately {Math.round(recommendations.tdee)} calories. The meal plan above is designed to meet this calorie target while providing balanced nutrition.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;