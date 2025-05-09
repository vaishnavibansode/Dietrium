import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { SplineViewer } from '../components';
import { GiAvocado } from 'react-icons/gi'; // Import the Avocado icon

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, state } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
            <GiAvocado className="h-12 w-12 text-emerald-600" /> {/* Use the Avocado icon */}
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Dietrium</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to get personalized diet recommendations
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <Input
                label="Email Address"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
              />
              
              <Input
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
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
              Sign in
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Sign up
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

export default Login;