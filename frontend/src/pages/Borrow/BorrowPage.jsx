import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToBorrow, borrowBooks } from '../../redux/features/borrow/borrowSlice';
import { fetchBooks } from '../../redux/features/books/bookSlice';

const BorrowPage = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector(state => state.books);
  const borrowList = useSelector(state => state.borrow.borrowList);
  const [selectedBooks, setSelectedBooks] = useState([]);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleAddToBorrow = (bookId) => {
    dispatch(addToBorrow({ bookId }));
  };

  const handleBorrowBooks = () => {
    dispatch(borrowBooks(borrowList));
  };

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error loading books: {error.message}</div>;
  if (!books || books.length === 0) return <div>No books available</div>;

  return (
    <div className="borrow-page">
      <h2>Borrow Books</h2>
      <div className="books-grid">
        {books.map(book => (
          <div key={book._id} className="book-card">
            <img src={`/assets/books/${book.coverImage}`} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.description}</p>
            <div className="book-actions">
              <button 
                onClick={() => handleAddToBorrow(book._id)}
                disabled={borrowList.includes(book._id)}
              >
                {borrowList.includes(book._id) ? 'Added to Borrow' : 'Add to Borrow'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="borrow-summary">
        <h3>Borrow List ({borrowList.length}/3)</h3>
        <button 
          onClick={handleBorrowBooks} 
          disabled={borrowList.length === 0}
        >
          Borrow Selected Books
        </button>
      </div>
    </div>
  );
};

export default BorrowPage;
