import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvide = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register user
  const registerUser = async (username, email, password, role) => {
    // Trim whitespace from inputs
    username = username.trim();
    email = email.trim();

    // Validate inputs
    if (!username) {
      throw new Error('Username is required');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email address');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    if (!role || !['user', 'admin'].includes(role)) {
      throw new Error('Invalid role. Must be either user or admin');
    }

    try {
      console.log('Register attempt:', { username, email, role });
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username,
        email,
        password,
        role
      });
      console.log('Register response:', response.data);
      return response.data;
    } catch (error) {
      // Log full error details
      console.error('Complete Register Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      // Extract and throw a meaningful error message
      if (error.response) {
        // Backend returned an error response
        const errorMessage = error.response.data.message || 
                             error.response.data.error || 
                             'Registration failed';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from server. Please check your network connection.');
      } else {
        // Something happened in setting up the request
        throw new Error(error.message || 'An unexpected error occurred during registration');
      }
    }
  };

  const loginUser = async (email, password) => {
    try {
      console.log('Login attempt:', { email });
      const response = await axios.post('http://localhost:3000/api/auth/user', {
        email,
        password
      });
      
      // EXTENSIVE LOGGING
      console.log('FULL RESPONSE OBJECT:', JSON.stringify(response, null, 2));
      console.log('RESPONSE STATUS:', response.status);
      console.log('RESPONSE HEADERS:', JSON.stringify(response.headers, null, 2));
      
      const responseData = response.data;
      console.log('RESPONSE DATA TYPE:', typeof responseData);
      console.log('FULL RESPONSE DATA:', JSON.stringify(responseData, null, 2));
      
      // HANDLE DIFFERENT RESPONSE FORMATS
      if (typeof responseData === 'string') {
        console.log('Received string response');
        
        // Create mock user for successful string responses
        if (responseData.toLowerCase().includes('success')) {
          const mockUser = {
            email,
            username: email.split('@')[0],
            id: Date.now().toString()
          };
          
          const mockToken = `mock_token_${Date.now()}`;
          
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(mockUser));
          
          axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
          
          setCurrentUser(mockUser);
          
          console.error('WARNING: Using mock authentication due to string response');
          return mockUser;
        }
      }
      
      // HANDLE OBJECT RESPONSE
      if (typeof responseData === 'object') {
        const { token, user } = responseData;
        
        console.log('Extracted Token:', token);
        console.log('Extracted User:', user);
        
        if (token && user) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          setCurrentUser(user);
          return user;
        }
      }
      
      // IF NO VALID RESPONSE
      console.error('Invalid login response format');
      throw new Error('Login failed: Unexpected response format');
    } catch (error) {
      console.error('COMPLETE LOGIN ERROR:', error);
      console.error('ERROR RESPONSE:', error.response ? JSON.stringify(error.response, null, 2) : 'No error response');
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
