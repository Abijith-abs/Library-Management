import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBorrowedBooks, returnBooks } from '../../redux/features/borrow/borrowSlice';

const BorrowedBooksPage = () => {
  const dispatch = useDispatch();
  const { borrowedBooks, loading, error } = useSelector(state => state.borrow);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Separate and paginate books
  const { currentlyBorrowedBooks, pastBorrowedBooks, pastBorrowedBooksPaginated } = useMemo(() => {
    const pastBooks = borrowedBooks.filter(transaction => transaction?.book && transaction.returnDate);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedBooks = pastBooks.slice(startIndex, endIndex);

    return {
      currentlyBorrowedBooks: borrowedBooks.filter(transaction => transaction?.book && !transaction.returnDate),
      pastBorrowedBooks: pastBooks,
      pastBorrowedBooksPaginated: paginatedBooks
    };
  }, [borrowedBooks, currentPage]);

  useEffect(() => {
    dispatch(fetchBorrowedBooks()).catch(err => console.error('Error fetching borrowed books:', err));
  }, [dispatch]);

  const handleReturnBooks = useCallback((event) => {
    let bookIds;
    if (Array.isArray(event)) {
      bookIds = event;
    } else if (event && typeof event === 'object' && 'preventDefault' in event) {
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
          if (payload?.returnedTransactions) {
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
        const errorMessage = error?.payload?.message || error.message || 'Failed to return books';
        alert(`Error: ${errorMessage}`);
      });
  }, [dispatch, selectedBooks]);

  const toggleBookSelection = (bookId) => {
    setSelectedBooks(prev => prev.includes(bookId)
      ? prev.filter(id => id !== bookId)
      : [...prev, bookId]);
  };

  if (loading) {
    return <div className='text-center py-10'>Loading borrowed books...</div>;
  }

  if (error) {
    return (
      <div className='text-center py-10 text-red-600'>
        Error: {typeof error === 'string' ? error : error?.message || 'Failed to load books'}
        <br />
        <button onClick={() => dispatch(fetchBorrowedBooks())} className='mt-4 bg-blue-500 text-white px-4 py-2 rounded'>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-5xl mx-auto px-6 py-10'>
      <h1 className='text-3xl font-bold text-center mb-8 text-indigo-800'>My Library Journey</h1>

      {/* CURRENTLY BORROWED */}
      <div className='mb-10'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold text-indigo-700'>Currently Borrowed Books</h2>
          {currentlyBorrowedBooks.length > 0 && (
            <div className='space-x-2'>
              <button
                onClick={() => handleReturnBooks(selectedBooks)}
                disabled={selectedBooks.length === 0}
                className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300'
              >
                Return Selected
              </button>
              <button
                onClick={() => handleReturnBooks(currentlyBorrowedBooks.map(t => t.book._id))}
                className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
              >
                Return All
              </button>
            </div>
          )}
        </div>
        {currentlyBorrowedBooks.length === 0 ? (
          <p className='text-center text-gray-600'>No books currently borrowed.</p>
        ) : (
          <div className='space-y-4'>
            {currentlyBorrowedBooks.map(transaction => (
              <div key={transaction._id} className='flex items-start bg-gray-50 p-4 rounded-md shadow'>
                <input
                  type='checkbox'
                  checked={selectedBooks.includes(transaction.book._id)}
                  onChange={() => toggleBookSelection(transaction.book._id)}
                  className='mt-1 mr-4 h-5 w-5'
                />
                <div>
                  <h3 className='text-xl font-bold text-gray-800'>{transaction.book.title}</h3>
                  <p className='text-gray-600'>Borrowed: {new Date(transaction.borrowDate).toLocaleDateString()}</p>
                  <p className='text-red-500'>Due: {new Date(transaction.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAST BORROWED */}
      <div>
        <h2 className='text-2xl font-semibold mb-4 text-gray-700'>Past Borrowed Books</h2>
        {pastBorrowedBooks.length === 0 ? (
          <p className='text-center text-gray-600'>No past borrowed books.</p>
        ) : (
          <>
            <div className='space-y-4 mb-6'>
              {pastBorrowedBooksPaginated.map(transaction => (
                <div key={transaction._id} className='bg-white p-4 rounded-lg shadow-md'>
                  <h3 className='text-lg font-bold'>{transaction.book?.title || 'Unknown Title'}</h3>
                  <p className='text-gray-600'>Borrowed on: {new Date(transaction.borrowDate).toLocaleDateString()}</p>
                  <p className='text-gray-500'>Returned on: {new Date(transaction.returnDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
            <div className='flex justify-center items-center space-x-4'>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className='px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300'
              >
                Previous
              </button>
              <span className='text-gray-700'>Page {currentPage} of {Math.ceil(pastBorrowedBooks.length / itemsPerPage)}</span>
              <button
                onClick={() => setCurrentPage(prev => prev < Math.ceil(pastBorrowedBooks.length / itemsPerPage) ? prev + 1 : prev)}
                disabled={currentPage >= Math.ceil(pastBorrowedBooks.length / itemsPerPage)}
                className='px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300'
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BorrowedBooksPage;
