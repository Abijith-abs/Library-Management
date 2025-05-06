import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvide = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register user
  const registerUser = async (username, email, password) => {
    try {
      console.log('Register attempt:', { username, email });
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username,
        email,
        password
      });
      console.log('Register response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  };

  const loginUser = async (email, password) => {
    try {
      console.log('Login attempt:', { email });
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });
      console.log('Full login response:', response);
      const responseData = response.data;
      console.log('Login response data:', responseData);
      
      // Handle string response by creating a mock user
      if (typeof responseData === 'string') {
        const mockUser = {
          email,
          username: email.split('@')[0],
          id: Date.now().toString()
        };
        
        // Create a mock token
        const mockToken = `mock_token_${Date.now()}`;
        
        // Store mock data
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        // Set Authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        
        // Update current user state
        setCurrentUser(mockUser);
        
        return responseData;
      }
      
      // Handle object response
      const { token, user } = responseData;
      console.log('Token:', token);
      console.log('User:', user);
      
      // Safely store user and token
      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      // Update current user state
      setCurrentUser(user || {});
      
      return responseData;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  };

  const logoutUser = () => {
    console.log('Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    window.location.href = '/login'; // Force redirect to login
  };

  //manage user
  useEffect(() => {
    console.log('Checking initial auth state');
    const token = localStorage.getItem('token');
    let user = null;
    
    try {
      const storedUser = localStorage.getItem('user');
      console.log('Stored user string:', storedUser);
      
      if (storedUser && storedUser !== 'undefined') {
        user = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      // Clear invalid user data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    
    console.log('Initial token:', token);
    console.log('Initial user:', user);
    
    if (token && user) {
      setCurrentUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      // Clear token if no user
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
}

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
