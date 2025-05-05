import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [message, setMessage] = React.useState('');
  const { registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  
  // RegisterUser
  const onSubmit = async (data) => {
    console.log(data);
    try {
      await registerUser(data.email, data.password);
      alert("User Registered Successfully");
      // Optionally, reset form or redirect user.
    } catch (error) {
      console.error("Registration error: ", error);
      setMessage("Please Provide Valid Credentials");
    }
  };

  return (
    <div className='h-[calc(100vh-120px)] flex justify-center items-center'>
      <div className='w-full max-w-sm mx-auto bg-white p-6 shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <h2 className='text-2xl font-bold mb-4 text-center'>Register Here</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4'> 
            <label htmlFor='email' className="block text-gray-500 text-sm font-bold mb-2">Email</label>
            <input 
              {...register("email", { required: true })}
              type="email" 
              id="email" 
              placeholder='Email Address'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">Email is required</p>}
          </div>
          
          <div className='mb-4'> 
            <label htmlFor='password' className="block text-gray-500 text-sm font-bold mb-2">Password</label>
            <input 
              {...register("password", { required: true })}
              type="password" 
              id="password" 
              placeholder='Password'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">Password is required</p>}
          </div>

          {message && <p className="text-green-600 text-center mt-4">{message}</p>}

          <div className='flex justify-center'>
            <button 
              type="submit"
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6 w-full'>
              Register
            </button>
          </div>
        </form>

        <p className='text-center font-medium text-gray-500 mt-4'>
          Already have an account? <Link to='/login' className='text-blue-600 hover:underline'>Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
