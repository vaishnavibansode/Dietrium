import axios, { AxiosError } from 'axios';
import { User, RecommendationResponse } from '../types';

const API_URL = 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
});

// Login functionality using backend API
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Call the backend login API
    const response = await api.post('/login', { email, password });
    
    // Store user in localStorage for frontend state persistence
    const userData = response.data;
    
    // Remove password before storing in local state
    const { password: _, ...userWithoutPassword } = userData;
    
    // Also update the local storage for compatibility with existing code
    const users = localStorage.getItem('users');
    if (users) {
      const parsedUsers = JSON.parse(users);
      const existingUserIndex = parsedUsers.findIndex((u: any) => u.email === email);
      
      if (existingUserIndex >= 0) {
        // Update existing user
        parsedUsers[existingUserIndex] = userData;
      } else {
        // Add new user
        parsedUsers.push(userData);
      }
      
      localStorage.setItem('users', JSON.stringify(parsedUsers));
    } else {
      localStorage.setItem('users', JSON.stringify([userData]));
    }
    
    return userWithoutPassword;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.error || 'Login failed');
    }
    throw error;
  }
};

export const registerUser = async (userData: Partial<User>, password: string): Promise<User> => {
  try {
    if (!userData.email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Prepare user data for registration
    const userDataWithPassword = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name || '',
      email: userData.email,
      password: password,
      weight: userData.weight,
      height: userData.height,
      age: userData.age,
      gender: userData.gender,
      activity: userData.activity,
      foodPreferences: userData.foodPreferences,
    };
    
    // Call the backend register API
    const response = await api.post('/register', userDataWithPassword);
    
    // Store user in localStorage for frontend state persistence
    const registeredUser = response.data;
    
    // Also update the local storage for compatibility with existing code
    const users = localStorage.getItem('users');
    if (users) {
      const parsedUsers = JSON.parse(users);
      localStorage.setItem('users', JSON.stringify([...parsedUsers, registeredUser]));
    } else {
      localStorage.setItem('users', JSON.stringify([registeredUser]));
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = registeredUser;
    return userWithoutPassword as User;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.error || 'Registration failed');
    }
    throw error;
  }
};

export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    // First update in local storage for the frontend state
    const users = localStorage.getItem('users');
    let updatedUser: User;
    
    if (users) {
      const parsedUsers = JSON.parse(users);
      const updatedUsers = parsedUsers.map((user: User) => {
        if (user.id === userData.id) {
          return { ...user, ...userData };
        }
        return user;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      updatedUser = updatedUsers.find((user: User) => user.id === userData.id);
    } else {
      throw new Error('User not found in local storage');
    }
    
    // Then send to backend API
    try {
      // Make sure we're sending the email with the request
      if (!userData.email && updatedUser.email) {
        userData.email = updatedUser.email;
      }
      
      // Log the data being sent to help with debugging
      console.log('Sending profile update to server:', userData);
      
      const response = await api.post('/update_profile', userData);
      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Failed to update profile on server, but local update succeeded:', error);
      // We don't throw here to allow the frontend to continue working
    }
    
    return updatedUser;
  } catch (error) {
    throw new Error('Failed to update user profile');
  }
};

export const getDietRecommendations = async (userData: {
  weight: number;
  height: number;
  age: number;
  gender: string;
  activity: string;
}): Promise<RecommendationResponse> => {
  try {
    const response = await api.post('/recommend', userData);
    return response.data;
  } catch (error) {
    // Improved error handling with specific error messages
    if (error instanceof AxiosError) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        throw new Error(`Server error: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please check if the API server is running.');
      }
    }
    // For other types of errors, throw a generic message
    throw new Error('Failed to get recommendations. Please try again later.');
  }
};