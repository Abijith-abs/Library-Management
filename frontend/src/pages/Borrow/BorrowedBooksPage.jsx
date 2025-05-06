import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBorrowedBooks, returnBooks } from '../../redux/features/borrow/borrowSlice';

const BorrowedBooksPage = () => {
  const dispatch = useDispatch();
  const { borrowedBooks, loading, error } = useSelector(state => state.borrow);
  const [selectedBooks, setSelectedBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        console.log('Dispatching fetchBorrowedBooks...');
        const result = await dispatch(fetchBorrowedBooks());
        
        // Log detailed information about the fetch result
        console.log('Fetch Result:', result);
        console.log('Payload:', result.payload);
        console.log('Current Borrowed Books State:', borrowedBooks);
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      }
    };
    fetchBooks();
  }, [dispatch]);

  const handleReturnBooks = (booksToReturn) => {
    // If no argument passed, use selected books
    const bookIds = booksToReturn || selectedBooks;

    if (bookIds.length === 0) {
      console.error('No books selected to return');
      return;
    }

    dispatch(returnBooks(bookIds))
      .then((result) => {
        // Handle successful return
        if (result.payload && result.payload.returnedTransactions) {
          console.log('Successfully returned books:', result.payload.returnedTransactions);
          setSelectedBooks([]);
          // Optional: Show a success toast or notification
        }
      })
      .catch((error) => {
        // Handle error
        console.error('Error returning books:', error);
        // Optional: Show an error toast or notification
        const errorMessage = error.payload?.message || 'Failed to return books';
        alert(errorMessage);
      });
  };

  const toggleBookSelection = (bookId) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  // Handle loading state
  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <p className='text-xl text-gray-600'>Loading borrowed books...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <p className='text-xl text-red-600'> Error: {typeof error === 'string' ? error : error?.message || 'Failed to load borrowed books'}</p>
        <button 
          onClick={() => dispatch(fetchBorrowedBooks())}
          className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>My Borrowed Books</h2>
      {!borrowedBooks || borrowedBooks.length === 0 ? (
        <div className='text-center bg-blue-50 p-6 rounded-lg'>
          <p className='text-blue-600 text-xl'>No books currently borrowed.</p>
          <p className='text-gray-500 mt-2'>Explore our library and borrow some books!</p>
        </div>
      ) : (
        <div className='grid gap-4'>
          {borrowedBooks
            .filter(transaction => transaction && transaction.book)
            .map(transaction => (
              <div 
                key={transaction._id} 
                className='flex items-center bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300'
              >
              <input 
                type='checkbox' 
                className='mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                checked={selectedBooks.includes(transaction.book._id)}
                onChange={() => toggleBookSelection(transaction.book._id)}
              />
              <div className='flex-grow'>
                <h3 className='text-xl font-semibold text-gray-800'>
                  {transaction.book?.title || 'Unknown Title'}
                </h3>
                <div className='text-gray-600 mt-2'>
                  <p>
                    <span className='font-medium'>Borrowed on:</span>{' '}
                    {transaction.borrowDate 
                      ? new Date(transaction.borrowDate).toLocaleDateString() 
                      : 'Unknown Date'}
                  </p>
                  <p>
                    <span className='font-medium'>Due Date:</span>{' '}
                    {transaction.dueDate 
                      ? new Date(transaction.dueDate).toLocaleDateString() 
                      : 'Unknown Due Date'}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className='mt-6 flex justify-center space-x-4'>
            <button 
              onClick={handleReturnBooks}
              disabled={selectedBooks.length === 0}
              className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                         disabled:bg-blue-300 disabled:cursor-not-allowed 
                         transition-colors duration-300'
            >
              Return Selected Books
            </button>
            <button 
              onClick={() => {
                const bookIds = borrowedBooks
                  .filter(t => t && t.book)
                  .map(t => t.book._id);
                handleReturnBooks(bookIds);
              }}
              className='px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 
                         transition-colors duration-300'
            >
              Return All Books
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowedBooksPage;