import React from 'react'
import { FaBook } from "react-icons/fa";
import { getImgUrl } from '../../utils/getImgUrl';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';

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
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'Authentication token is missing. Please log in again.',
        confirmButtonColor: '#d33',
      });
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

      if (response.data.success || response.status === 201 || response.data.borrowedTransactions) {
        if (response.data.message?.includes('limit')) {
          Swal.fire({
            icon: 'warning',
            title: 'Borrowing Limit Reached',
            text: response.data.message,
            confirmButtonColor: '#f59e0b',
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Book Borrowed!',
            text: `${book.title} was borrowed successfully.`,
            confirmButtonColor: '#3085d6',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Borrow',
          text: response.data.message || 'An error occurred.',
          confirmButtonColor: '#d33',
        });
      }

    } catch (error) {
      if (error.response?.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Please log in again.',
          confirmButtonColor: '#d33',
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      if (error.response?.data?.message?.includes('Exceeds maximum book borrowing limit')) {
        Swal.fire({
          icon: 'error',
          title: 'Borrowing Limit Reached',
          text: 'You can borrow up to 3 books only.',
          confirmButtonColor: '#d33',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Something went wrong.',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  return (
    <div className='bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg group'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:h-72 sm:justify-center gap-6 p-4'>
        <div className='sm:w-1/3 sm:flex-shrink-0 border-2 border-gray-100 rounded-xl overflow-hidden'>
          <Link to={`/books/${book._id}`}>
            <img
              src={getImgUrl(book.coverImage)}
              alt={`Cover of ${book.title}`}
              className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300'
            />
          </Link>
        </div>

        <div className='sm:w-2/3 space-y-4'>
          <Link to={`/books/${book._id}`}>
            <h3 className='text-2xl font-bold text-indigo-900 group-hover:text-indigo-700 transition-colors'>
              {book?.title}
            </h3>
          </Link>

          <p className='text-gray-600 line-clamp-3'>
            {book?.description}
          </p>
          <div className='flex items-center justify-between space-x-2'>
            <p className='text-lg font-semibold text-green-700 truncate'>
              {book?.newPrice} 
              <span className='text-gray-500 text-sm line-through ml-2'>{book?.oldPrice}</span>
            </p>
            <button
              onClick={handleBorrowBook}
              className='px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 
              transition-colors duration-300 flex items-center space-x-1 group'
            >
              <FaBook className='text-sm group-hover:animate-bounce' />
              <span>Borrow</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookCard;
