import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBorrowedBooks, returnBooks } from '../../redux/features/borrow/borrowSlice';

const BorrowedBooksPage = () => {
  const dispatch = useDispatch();
  const { borrowedBooks, loading, error } = useSelector(state => state.borrow);
  const [selectedBooks, setSelectedBooks] = useState([]);

  // Memoized separation of current and past borrowed books
  const { currentlyBorrowedBooks, pastBorrowedBooks } = useMemo(() => {
    return {
      currentlyBorrowedBooks: borrowedBooks.filter(transaction => 
        transaction && transaction.book && !transaction.returnDate
      ),
      pastBorrowedBooks: borrowedBooks.filter(transaction => 
        transaction && transaction.book && transaction.returnDate
      )
    };
  }, [borrowedBooks]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        await dispatch(fetchBorrowedBooks());
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      }
    };
    fetchBooks();
  }, [dispatch]);

  const handleReturnBooks = useCallback((event) => {
    // Determine the books to return
    let bookIds;
    if (Array.isArray(event)) {
      // If an array of book IDs is directly passed
      bookIds = event;
    } else if (event && typeof event === 'object' && 'preventDefault' in event) {
      // If it's an event (from button click), use selected books
      bookIds = selectedBooks;
    } else {
      alert('Invalid return request');
      return;
    }

    if (bookIds.length === 0) {
      alert('Please select books to return');
      return;
    }

    dispatch(returnBooks(bookIds))
      .then((action) => {
        if (action.type === 'borrow/returnBooks/fulfilled') {
          const payload = action.payload;
          if (payload && payload.returnedTransactions) {
            setSelectedBooks([]);
            alert(payload.message || 'Books returned successfully');
          } else {
            alert('No books were returned');
          }
        } else {
          alert('Unexpected response from server');
        }
      })
      .catch((error) => {
        const errorMessage = 
          error.payload?.message || 
          error.message || 
          'Failed to return books';
        
        alert(`Error: ${errorMessage}`);
      });
  }, [dispatch, selectedBooks]);

  const toggleBookSelection = (bookId) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  // Loading and error states remain the same
  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <p className='text-xl text-gray-600'>Loading borrowed books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <p className='text-xl text-red-600'> 
          Error: {typeof error === 'string' ? error : error?.message || 'Failed to load borrowed books'}
        </p>
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
      
      {/* Currently Borrowed Books Section */}
      <section className='mb-8'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-2xl font-semibold text-gray-700'>Currently Borrowed Books</h3>
          {currentlyBorrowedBooks.length > 0 && (
            <div className='space-x-4'>
              <button 
                onClick={() => {
                  const bookIds = selectedBooks;
                  handleReturnBooks(bookIds);
                }}
                disabled={selectedBooks.length === 0}
                className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                           disabled:bg-blue-300 disabled:cursor-not-allowed 
                           transition-colors duration-300'
              >
                Return Selected Books
              </button>
              <button 
                onClick={() => {
                  const bookIds = currentlyBorrowedBooks
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
          )}
        </div>
        {currentlyBorrowedBooks.length === 0 ? (
          <div className='text-center bg-blue-50 p-6 rounded-lg'>
            <p className='text-blue-600 text-xl'>No books currently borrowed.</p>
          </div>
        ) : (
          <div className='grid gap-4'>
            {currentlyBorrowedBooks.map(transaction => (
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
          </div>
        )}
      </section>

      {/* Past Borrowed Books Section */}
      <section>
        <h3 className='text-2xl font-semibold mb-4 text-gray-700'>Past Borrowed Books</h3>
        {pastBorrowedBooks.length === 0 ? (
          <div className='text-center bg-gray-50 p-6 rounded-lg'>
            <p className='text-gray-600 text-xl'>No past borrowed books.</p>
          </div>
        ) : (
          <div className='grid gap-4'>
            {pastBorrowedBooks.map(transaction => (
              <div 
                key={transaction._id} 
                className='flex items-center bg-gray-100 shadow-md rounded-lg p-4'
              >
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
                      <span className='font-medium'>Returned on:</span>{' '}
                      {transaction.returnDate 
                        ? new Date(transaction.returnDate).toLocaleDateString() 
                        : 'Unknown Return Date'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Buttons removed, now placed in the Currently Borrowed Books section */}
    </div>
  );
};

export default BorrowedBooksPage;