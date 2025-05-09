import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import { SplineViewer } from '../components';
import { GiAvocado } from 'react-icons/gi'; // Import the Avocado icon
import { ActivityLevel } from '../types';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    weight: '',
    height: '',
    age: '',
    gender: '',
    activity: '',
  });
  
  const { register, state } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await register(
        {
          name: formData.name,
          email: formData.email,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          height: formData.height ? parseFloat(formData.height) : undefined,
          age: formData.age ? parseInt(formData.age, 10) : undefined,
          gender: formData.gender as 'male' | 'female' | undefined,
          activity: formData.activity as ActivityLevel | undefined,
        },
        formData.password
      );
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'light', label: 'Light (exercise 1-3 times/week)' },
    { value: 'moderate', label: 'Moderate (exercise 4-5 times/week)' },
    { value: 'active', label: 'Active (daily exercise or intense 3-4 times/week)' },
    { value: 'very_active', label: 'Very Active (intense exercise 6-7 times/week)' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <div className="flex justify-center">
            <GiAvocado className="h-12 w-12 text-emerald-600" /> {/* Use the Avocado icon */}
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Register to get personalized diet recommendations
            </p>
          </div>
          
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <Input
                label="Full Name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Full name"
              />
              
              <Input
                label="Email Address"
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email address"
              />
              
              <Input
                label="Password"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Weight (kg)"
                  type="number"
                  id="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Weight in kg"
                  min={30}
                  max={300}
                />
                
                <Input
                  label="Height (cm)"
                  type="number"
                  id="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Height in cm"
                  min={100}
                  max={250}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Age"
                  type="number"
                  id="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Your age"
                  min={18}
                  max={100}
                />
                
                <Select
                  label="Gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                  ]}
                />
              </div>
              
              <Select
                label="Activity Level"
                id="activity"
                value={formData.activity}
                onChange={handleChange}
                options={activityOptions}
              />
            </div>

            {state.error && (
              <div className="text-red-600 text-sm">{state.error}</div>
            )}

            <Button
              type="submit"
              fullWidth
              isLoading={state.loading}
            >
              Create Account
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - 3D Model */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen bg-gray-100 relative">
        <SplineViewer url="https://prod.spline.design/p7HurWUNvHGr7F2h/scene.splinecode" />
      </div>
    </div>
  );
};

export default Register;