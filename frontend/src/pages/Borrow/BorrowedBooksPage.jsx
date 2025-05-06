import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBorrowedBooks, returnBooks } from '../../redux/features/borrow/borrowSlice';

const BorrowedBooksPage = () => {
  const dispatch = useDispatch();
  const borrowedBooks = useSelector(state => state.borrow.borrowedBooks);
  const [selectedBooks, setSelectedBooks] = useState([]);

  useEffect(() => {
    dispatch(fetchBorrowedBooks());
  }, [dispatch]);

  const handleReturnBooks = () => {
    dispatch(returnBooks(selectedBooks));
    setSelectedBooks([]);
  };

  const toggleBookSelection = (bookId) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  return (
    <div className="borrowed-books-page">
      <h2>Borrowed Books</h2>
      {borrowedBooks.length === 0 ? (
        <p>No books currently borrowed.</p>
      ) : (
        <div className="borrowed-books-list">
          {borrowedBooks.map(transaction => (
            <div key={transaction._id} className="borrowed-book-item">
              <input 
                type="checkbox" 
                checked={selectedBooks.includes(transaction.book._id)}
                onChange={() => toggleBookSelection(transaction.book._id)}
              />
              <div className="book-details">
                <h3>{transaction.book.title}</h3>
                <p>Borrowed on: {new Date(transaction.borrowDate).toLocaleDateString()}</p>
                <p>Due Date: {new Date(transaction.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          <div className="return-actions">
            <button 
              onClick={handleReturnBooks}
              disabled={selectedBooks.length === 0}
            >
              Return Selected Books
            </button>
            <button 
              onClick={() => handleReturnBooks(borrowedBooks.map(t => t.book._id))}
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
