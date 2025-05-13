import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import getBaseUrl from '../utils/baseUrl';
import { useAuth } from '../context/AuthContext';
import {
  Switch,
  FormControlLabel,
  FormGroup,
} from '@mui/material';

const LoginPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginTypeChange = (event) => {
    setIsAdmin(event.target.checked);
    setMessage(''); // Clear any error messages when switching
    reset(); // Reset form when switching between admin and user
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (isAdmin) {
        // Admin login
        const response = await axios.post(`${getBaseUrl()}/api/auth/admin`, {
          username: data.username,
          password: data.password
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const auth = response.data;
        if (auth.token) {
          localStorage.setItem('admin-token', auth.token);
          setTimeout(() => {
            localStorage.removeItem('admin-token');
            toast.warning('Session expired, please login again');
            navigate("/");
          }, 3600 * 1000);
          toast.success('Admin Login Successful!');
          navigate("/Dashboard");
        }
      } else {
        // User login
        const result = await loginUser(data.email, data.password);
        if (result) {
          toast.success('Login Successful!');
          navigate('/');
        } else {
          setMessage('Invalid email or password');
          toast.error('Login failed. Please check your credentials.');
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white shadow-2xl rounded-xl p-10 border border-gray-100'>
        <div>
          <h2 className='mt-6 text-center text-4xl font-extrabold text-indigo-900'>
            {isAdmin ? 'Admin Portal' : 'Welcome Back'}
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            {isAdmin 
              ? 'Sign in to access administrative controls'
              : 'Sign in to continue to your library'
            }
          </p>
          
          <div className="mt-4 flex justify-center">
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={isAdmin}
                    onChange={handleLoginTypeChange}
                    color="primary"
                  />
                }
                label={isAdmin ? "Admin Login" : "User Login"}
              />
            </FormGroup>
          </div>
        </div>
        
        <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='rounded-md shadow-sm -space-y-px'>
            <div className='mb-4'>
              <label htmlFor={isAdmin ? 'username' : 'email'} className='sr-only'>
                {isAdmin ? 'Username' : 'Email address'}
              </label>
              {isAdmin ? (
                <input
                  {...register('username', { 
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters'
                    }
                  })}
                  type='text'
                  placeholder='Username'
                  className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                />
              ) : (
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type='email'
                  placeholder='Email address'
                  className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                />
              )}
              {errors.username && isAdmin && (
                <p className='text-red-500 text-xs mt-1'>{errors.username.message}</p>
              )}
              {errors.email && !isAdmin && (
                <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>
              )}
            </div>

            <div className='relative'>
              <label htmlFor='password' className='sr-only'>Password</label>
              <input
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
              />
              <button
                type='button'
                onClick={togglePasswordVisibility}
                className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5'
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>
              )}
            </div>
          </div>

          {message && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
          )}

          <div>
            <button
              type='submit'
              disabled={isSubmitting}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400'
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {!isAdmin && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Register now
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
