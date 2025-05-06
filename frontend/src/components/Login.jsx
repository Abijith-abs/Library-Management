import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [message, setMessage] = React.useState('')
  const { loginUser } = useAuth();
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();


  
  const onSubmit = async (data) => {
    try {
      console.log('Submitting login:', data.email);
      const result = await loginUser(data.email, data.password);
      console.log('Login result:', result);
      
      // Always navigate on successful login
      alert(result || "Login Successful");
      navigate("/");
    } catch (error) {
      console.error('Login submission error:', error);
      setMessage(error.message || "Login failed. Please try again.");
    }
  }

  return (
    <div className='h-[calc(100vh-120px)] flex justify-center items-center'>
      <div className='w-full max-w-sm mx-auto bg-white p-6 shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <h2 className='text-2xl font-bold mb-4 text-center'>Please Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4'>
            <label htmlFor='email' className="block text-gray-500 text-sm font-bold mb-2">Email</label>
            <input
              {...register("email", { required: true })}
              type="email" id="email" placeholder='Email Address'
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

          {message && <p className="text-red-600 text-center mt-4 font-bold animate-pulse">{message}</p>}

          <div className='flex justify-center'>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6 w-full'>
              Login
            </button>
          </div>
        </form>

        <p className='text-center font-medium text-gray-500 mt-4'>
          Don’t have an account? <Link to='/register' className='text-blue-600 hover:underline'>Register Here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
