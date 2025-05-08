import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';
import AuthProvider from '../context/AuthContext';

const USER_ROLES = [
  { value: 'user', label: 'Regular User' },
  { value: 'admin', label: 'Administrator' }
];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      role: ''
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    try {
      const result = await registerUser(data.username, data.email, data.password, data.role);
      
      if (result) {
        toast.success('Registration Successful!');
        navigate('/login');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      toast.error(errorMessage);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white shadow-2xl rounded-xl p-10 border border-gray-100'>
        <div>
          <h2 className='mt-6 text-center text-4xl font-extrabold text-indigo-900'>
            Create Your Account
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Start your library journey
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='rounded-md shadow-sm -space-y-px'>
            <div className='mb-4'>
              <label htmlFor='username' className='sr-only'>Username</label>
              <input
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters'
                  }
                })}
                id='username'
                type='text'
                placeholder='Username'
                className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
              />
              {errors.username && (
                <p className='text-red-500 text-xs mt-1'>{errors.username.message}</p>
              )}
            </div>

            <div className='mb-4'>
              <label htmlFor='email' className='sr-only'>Email address</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                id='email'
                type='email'
                placeholder='Email address'
                className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
              />
              {errors.email && (
                <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>
              )}
            </div>

            <div className='relative mb-4'>
              <label htmlFor='password' className='sr-only'>Password</label>
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                id='password'
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

            <div className='mb-4'>
              <label htmlFor='role' className='sr-only'>User Role</label>
              <select
                {...register('role', { required: 'Role is required' })}
                id='role'
                className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
              >
                <option value=''>Select Role</option>
                {USER_ROLES.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className='text-red-500 text-xs mt-1'>{errors.role.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={isSubmitting}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50'
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600'>
            Already have an account?{' '}
            <Link to='/login' className='font-medium text-indigo-600 hover:text-indigo-500'>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
