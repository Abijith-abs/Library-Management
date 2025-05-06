
import React from 'react'
import { useParams, useNavigate } from "react-router-dom"

import { getImgUrl } from '../../utils/getImgUrl';
import { useDispatch } from 'react-redux';
import { useFetchBookByIdQuery } from '../../redux/features/books/booksApi';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const SingleBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { data, isLoading, isError } = useFetchBookByIdQuery(id);
    const book = data?.book;

    const handleBorrowBook = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post('/api/transactions/borrow', { bookIds: [id] });
            if (response.data.success) {
                navigate('/borrowed-books');
            } else {
                alert(response.data.message || 'Failed to borrow book');
            }
        } catch (error) {
            console.error('Borrow book error:', error);
            alert('An error occurred while borrowing the book');
        }
    }

if (isLoading) return <div>Loading...</div>;
if (isError || !book) return <div>Error loading book info</div>;

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
                        <strong>Published:</strong> {new Date(book?.createdAt).toLocaleDateString()}
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
                    <span>Add to Cart</span>

                </button>
            </div>
        </div>
  )
}

export default SingleBook
