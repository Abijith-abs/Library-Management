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
    <div className='h-screen flex justify-center items-center'>
    <div className='w-full max-w-sm mx-auto bg-white p-6 shadow-md rounded px-8 pt-6 pb-8 mb-4'>
      <h2 className='text-2xl font-bold mb-4 text-center'>Admin Login </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-4'>
          <label htmlFor='username' className="block text-gray-500 text-sm font-bold mb-2">Username</label>
          <input
            {...register("username", { required: true })}
            type="text" id="username" placeholder='Username'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">Email is required</p>}
        </div>

        <div className='mb-4'>
          <label htmlFor='password' className="block text-gray-500 text-sm font-bold mb-2">Password</label>
          <input
            {...register("password", { required: true })}
            type="password" id="password" placeholder='Password'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">Password is required</p>}
        </div>

        {message && <p className="text-red-600 text-center mt-4">{message}</p>}

        <div className='flex justify-center'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6 w-full'>
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default AdminLogin