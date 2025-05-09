import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import { User } from '../types';

const Profile: React.FC = () => {
  const { state, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    weight: undefined,
    height: undefined,
    age: undefined,
    gender: undefined,
    activity: undefined,
    foodPreferences: [],
  });
  const [saving, setSaving] = useState(false);
  const [foodPreference, setFoodPreference] = useState('');

  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/login');
      return;
    }

    if (state.user) {
      setFormData({
        name: state.user.name || '',
        email: state.user.email || '',
        weight: state.user.weight,
        height: state.user.height,
        age: state.user.age,
        gender: state.user.gender,
        activity: state.user.activity,
        foodPreferences: state.user.foodPreferences || [],
      });
    }
  }, [state.isAuthenticated, state.user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? 
      parseFloat(e.target.value) : 
      e.target.value;
    
    setFormData({
      ...formData,
      [e.target.id]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateProfile(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddFoodPreference = () => {
    if (foodPreference && !formData.foodPreferences?.includes(foodPreference)) {
      setFormData({
        ...formData,
        foodPreferences: [...(formData.foodPreferences || []), foodPreference],
      });
      setFoodPreference('');
    }
  };

  const handleRemoveFoodPreference = (pref: string) => {
    setFormData({
      ...formData,
      foodPreferences: formData.foodPreferences?.filter(p => p !== pref),
    });
  };

  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'light', label: 'Light (exercise 1-3 times/week)' },
    { value: 'moderate', label: 'Moderate (exercise 4-5 times/week)' },
    { value: 'active', label: 'Active (daily exercise or intense 3-4 times/week)' },
    { value: 'very_active', label: 'Very Active (intense exercise 6-7 times/week)' },
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    id="name"
                    value={formData.name||''}
                    onChange={handleChange}
                    required
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    id="email"
                    value={formData.email||''}
                    onChange={handleChange}
                    required
                    disabled
                  />
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">Physical Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Weight (kg)"
                    type="number"
                    id="weight"
                    value={formData.weight || ''}
                    onChange={handleChange}
                    min={30}
                    max={300}
                    required
                  />
                  
                  <Input
                    label="Height (cm)"
                    type="number"
                    id="height"
                    value={formData.height || ''}
                    onChange={handleChange}
                    min={100}
                    max={250}
                    required
                  />
                  
                  <Input
                    label="Age"
                    type="number"
                    id="age"
                    value={formData.age || ''}
                    onChange={handleChange}
                    min={18}
                    max={100}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Select
                    label="Gender"
                    id="gender"
                    value={formData.gender || ''}
                    onChange={handleChange}
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                    ]}
                    required
                  />
                  
                  <Select
                    label="Activity Level"
                    id="activity"
                    value={formData.activity || ''}
                    onChange={handleChange}
                    options={activityOptions}
                    required
                  />
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-4">Food Preferences</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.foodPreferences?.map((pref) => (
                    <div
                      key={pref}
                      className="bg-emerald-50 text-emerald-800 rounded-full px-3 py-1 flex items-center"
                    >
                      <span>{pref}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFoodPreference(pref)}
                        className="ml-2 text-emerald-700 hover:text-emerald-900"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center">
                  <Input
                    label=""
                    id="foodPreference"
                    value={foodPreference}
                    onChange={(e) => setFoodPreference(e.target.value)}
                    placeholder="Add a food preference (e.g., vegan, gluten-free)"
                    className="mb-0 flex-grow"
                  />
                  <Button
                    type="button"
                    onClick={handleAddFoodPreference}
                    variant="secondary"
                    className="ml-2 mt-1"
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  isLoading={saving}
                >
                  Save Profile
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;