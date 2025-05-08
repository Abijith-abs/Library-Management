import React, { useState, useMemo } from 'react'
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { Link, useNavigate } from 'react-router-dom'
import { useDeleteBookMutation, useFetchAllBooksQuery } from '../../../redux/features/books/booksApi'

const ManageBooks = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const { data, refetch } = useFetchAllBooksQuery();
    const [deleteBook] = useDeleteBookMutation();

    // Memoized filtered books
    const filteredBooks = useMemo(() => {
        if (!data?.books) return [];
        return data.books.filter(book => 
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data?.books, searchTerm]);

    // Handle deleting a book with SweetAlert confirmation
    const handleDeleteBook = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteBook(id).unwrap();
                    Swal.fire(
                        'Deleted!',
                        'The book has been deleted.',
                        'success'
                    );
                    refetch();
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        'Could not delete the book.',
                        'error'
                    );
                }
            }
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage Books</h2>
                <Link 
                    to="/dashboard/add-new-book" 
                    className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                    <FaPlus className="mr-2" /> Add New Book
                </Link>
            </div>

            <div className="mb-4 relative">
                <input 
                    type="text" 
                    placeholder="Search books by title or category..." 
                    className="w-full p-2 pl-8 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-2 top-3 text-gray-400" />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Category</th>
                            <th className="p-3 text-left">Price</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBooks.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center p-4 text-gray-500">
                                    No books found
                                </td>
                            </tr>
                        ) : (
                            filteredBooks.map((book) => (
                                <tr key={book._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-3">{book.title}</td>
                                    <td className="p-3">{book.category}</td>
                                    <td className="p-3">${book.newPrice}</td>
                                    <td className="p-3 flex space-x-2">
                                        <Link 
                                            to={`/dashboard/edit-book/${book._id}`} 
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button 
                                            onClick={() => handleDeleteBook(book._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageBooks;