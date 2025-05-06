import React from 'react'
import { FaBook } from "react-icons/fa";
import { getImgUrl } from '../../utils/getImgUrl';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleBorrowBook = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication token is missing. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/transactions/borrow', 
        { bookIds: [book._id] }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Borrow book response:', response.data);
      
      if (response.data.success) {
        alert('Book borrowed successfully!');
        navigate('/borrowed-books');
      } else {
        alert(response.data.message || 'Failed to borrow book');
      }
    } catch (error) {
      console.error('Borrow book error:', error.response?.data || error.message);
      
      // Handle specific unauthorized error
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      
      alert(error.response?.data?.message || 'Failed to borrow book. Please try again.');
    }
  }

  return (
    <div className=" rounded-lg transition-shadow duration-300">
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:h-72  sm:justify-center gap-4"
      >
        <div className="sm:h-72 sm:flex-shrink-0 border rounded-md">
          <Link to={`/books/${book._id}`}>

            <img
              src={getImgUrl(book.coverImage)}
              alt="Book Cover"
              className="w-full bg-cover p-2 rounded-md cursor-pointer hover:scale-105 transition-all duration-200"
            />
          </Link>
        </div>

        <div>
          <Link to={`/books/${book._id}`}>

            <h3 className="text-xl font-semibold hover:text-blue-600 mb-3">
              {book?.title}
            </h3>
          </Link>

          <p className="text-gray-600 mb-5">
            {book?.description.length > 70 ? book.description.slice(0, 80) + '...' : book?.description}
          </p>
          <p className="font-medium mb-5">
            {book?.newPrice} <span className="line-through font-normal ml-2">{book?.oldPrice}</span>
          </p>
          <button
            onClick={handleBorrowBook}
            className="bg-yellow-400 px-12 py-2 rounded-md text-base font-bold 
          hover:bg-[#0D0842] hover:text-white transition-all duration-200 cursor-pointer
            space-x-1 flex items-center gap-1 ">
            <FaBook className="" />
            <span>Borrow Book</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookCard;