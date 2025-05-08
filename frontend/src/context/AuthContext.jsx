import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

// Utility function for validation
const validateInput = (username, email, password, role) => {
  const errors = [];

  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters');
  }

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push('Invalid email address');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (!role || !['user', 'admin'].includes(role)) {
    errors.push('Invalid role. Must be either user or admin');
  }

  return errors;
};

// Custom hook for authentication
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication Provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register user
  const registerUser = async (username, email, password, role) => {
    const validationErrors = validateInput(username, email, password, role);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username: username.trim(),
        email: email.trim(),
        password,
        role
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Registration failed';
      throw new Error(errorMessage);
    }
  };

  // Login user
  const loginUser = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/user', {
        email: email.trim(),
        password
      });

      const { token, user } = response.data;

      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setCurrentUser(user);

        return user;
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Login failed';
      throw new Error(errorMessage);
    }
  };

  // Logout user
  const logoutUser = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setCurrentUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      window.location.href = '/login';
    }
  }, []);

  // Check initial authentication state
  useEffect(() => {
    const token = localStorage.getItem('token');
    let user = null;

    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        user = JSON.parse(storedUser);
      }
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }

    if (token && user) {
      setCurrentUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    setLoading(false);
  }, []);

  const value = {
    currentUser,
    loading,
    registerUser,
    loginUser,
    logoutUser,
    setCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

// Renamed from AuthProvide to AuthProvider to follow convention
export default AuthProvider;
