import React from 'react'
import { useForm } from "react-hook-form";
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import getBaseUrl from '../utils/baseUrl';
import { Navigate, useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [message, setMessage] = React.useState('')
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
      } = useForm();
    
    
  
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${getBaseUrl()}/api/auth/admin`, data, {
        headers:{
            'Content-Type': 'application/json'
        }
      });
      const auth = response.data;
      console.log(auth);
      if (auth.token){
        localStorage.setItem('admin-token', auth.token);
        setTimeout(() => {
            localStorage.removeItem('admin-token');
            alert('Token expired please login again');
            navigate("/")
        }, 3600*1000)
      }
      alert("Admin Login Succesful");
      navigate("/Dashboard")
    } catch (error) {
      setMessage("Invalid email ID or Password");
      console.log(error);
    }
  }


  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white shadow-2xl rounded-xl p-10 border border-gray-100'>
        <div>
          <h2 className='mt-6 text-center text-4xl font-extrabold text-indigo-900'>
            Admin Portal
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Sign in to access administrative controls
          </p>
        </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-4'>
          <label htmlFor='username' className='sr-only'>Username</label>
          <input
            {...register("username", { 
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              }
            })}
            type="text" 
            id="username" 
            placeholder='Username'
            className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
        </div>

        <div className='relative mb-4'>
          <label htmlFor='password' className='sr-only'>Password</label>
          <input
            {...register("password", { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            type="password" 
            id="password" 
            placeholder='Password'
            className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {message && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        <div className='flex justify-center'>
          <button
            type="submit"
            className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300'
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default AdminLogin