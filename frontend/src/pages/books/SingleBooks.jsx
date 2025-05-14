import React from 'react';
import { formatDate } from '../../utils/dateFormatter';
import { useParams, useNavigate } from "react-router-dom"

import { getImgUrl } from '../../utils/getImgUrl';
import { useDispatch } from 'react-redux';
import { useFetchBookByIdQuery } from '../../redux/features/books/booksApi';
import { useAuth } from '../../context/AuthContext';
import AuthProvider from '../../context/AuthContext';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { FiShoppingCart } from 'react-icons/fi';

const SingleBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { data, isLoading, isError, error } = useFetchBookByIdQuery(id);
    console.log('Single Book Query Data:', { data, isLoading, isError, error });
    const book = data;

    const { addToast } = useToast();

    const handleBorrowBook = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const token = localStorage.getItem('token');
        console.log('Attempting to borrow book with token:', token);

        try {
            const response = await axios.post('http://localhost:3000/api/transactions/borrow', 
                { bookIds: [id] }, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            console.log('Borrow book response:', response.data);
            
            if (response.data.success) {
                addToast('Book borrowed successfully!', 'success');
                navigate('/borrowed-books');
            } else {
                addToast(response.data.message || 'Failed to borrow book', 'error');
            }
        } catch (error) {
            console.error('Borrow book error:', error);
            addToast(error.response?.data?.message || 'An error occurred while borrowing the book', 'error');
        }
    }

    if (isLoading) return <div>Loading...</div>;
    if (isError) {
        console.error('Book fetch error:', error);
        return <div className="text-red-500 text-center py-10">
            Error loading book: {error?.message || 'Unknown error'}
        </div>;
    }
    if (!book) {
        return <div className="text-yellow-500 text-center py-10">
            No book data found
        </div>;
    }

    return (
        <div className="max-w-lg shadow-md p-5">
            <h1 className="text-2xl font-bold mb-6">{book.title}</h1>

            <div className=''>
                <div>
                    <img
                        src={`${getImgUrl(book.coverImage)}`}
                        alt={book.title}
                        className="mb-8"
                    />
                </div>

                <div className='mb-5'>
                    <p className="text-gray-700 mb-2"><strong>Author:</strong> {book.author || 'admin'}</p>
                    <p className="text-gray-700 mb-4">
                        <strong>Published:</strong> {formatDate(book?.createdAt)}
                    </p>
                    <p className="text-gray-700 mb-4 capitalize">
                        <strong>Category:</strong> {book?.category}
                    </p>
                    <p className="text-gray-700"><strong>Description:</strong> {book.description}</p>
                </div>

                <button onClick={handleBorrowBook}
                 className="bg-yellow-400 px-12 py-2 rounded-md text-base font-bold 
                    hover:bg-[#0D0842] hover:text-white transition-all duration-200 cursor-pointer
                         space-x-1 flex items-center gap-1">
                    <FiShoppingCart className="" />
                    <span>Borrow Book</span>
                </button>
            </div>
        </div>
    )
}

export default SingleBook
