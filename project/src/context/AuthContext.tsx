import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User } from '../types';
import { loginUser, registerUser, updateUserProfile } from '../services/api';

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'UPDATE_PROFILE_SUCCESS'; payload: User }
  | { type: 'LOADING' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
    case 'UPDATE_PROFILE_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    case 'LOADING':
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

interface AuthContextProps {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for user in local storage on mount
    const user = localStorage.getItem('currentUser');
    if (user) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: JSON.parse(user) });
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOADING' });
    try {
      const user = await loginUser(email, password);
      localStorage.setItem('currentUser', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      let message = 'Login failed';
      if (error instanceof Error) {
        message = error.message;
      }
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    dispatch({ type: 'LOADING' });
    try {
      const user = await registerUser(userData, password);
      localStorage.setItem('currentUser', JSON.stringify(user));
      dispatch({ type: 'REGISTER_SUCCESS', payload: user });
    } catch (error) {
      let message = 'Registration failed';
      if (error instanceof Error) {
        message = error.message;
      }
      dispatch({ type: 'REGISTER_FAILURE', payload: message });
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (userData: Partial<User>) => {
    dispatch({ type: 'LOADING' });
    try {
      if (state.user) {
        const updatedUser = await updateUserProfile({ ...userData, id: state.user.id });
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        dispatch({ type: 'UPDATE_PROFILE_SUCCESS', payload: updatedUser });
      }
    } catch (error) {
      // Handle error but don't update state in this case
      console.error('Profile update failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};