import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { formatDate } from '../../utils/dateFormatter';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBorrowedBooks } from '../../redux/features/borrow/borrowSlice';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Container, Box, Pagination } from '@mui/material';

const BorrowedBooksPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { borrowedBooks, loading, error } = useSelector(state => state.borrow);
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

  const handleReturnBook = (transactionId) => {
    navigate(`/return-book/${transactionId}`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" py={4}>
          <Typography>Loading borrowed books...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box display="flex" flexDirection="column" alignItems="center" py={4}>
          <Typography color="error" gutterBottom>
            Error: {typeof error === 'string' ? error : error?.message || 'Failed to load books'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => dispatch(fetchBorrowedBooks())}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        My Library Journey
      </Typography>

      {/* Currently Borrowed Books */}
      <Box mb={6}>
        <Typography variant="h5" gutterBottom>
          Currently Borrowed Books
        </Typography>
        
        {currentlyBorrowedBooks.length === 0 ? (
          <Typography color="textSecondary" align="center">
            No books currently borrowed.
          </Typography>
        ) : (
          <Box>
            {currentlyBorrowedBooks.map(transaction => (
              <Card key={transaction._id} sx={{ p: 2, mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6">{transaction.book.title}</Typography>
                    <Typography color="textSecondary">
                      Borrowed: {formatDate(transaction.borrowDate)}
                    </Typography>
                    <Typography color="error">
                      Due: {formatDate(transaction.dueDate)}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleReturnBook(transaction._id)}
                  >
                    Return Book
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Past Borrowed Books */}
      <Box mt={6}>
        <Typography variant="h5" gutterBottom>
          Past Borrowed Books
        </Typography>
        {pastBorrowedBooksPaginated.length === 0 ? (
          <Typography color="textSecondary" align="center">
            No past borrowed books.
          </Typography>
        ) : (
          <Box>
            {pastBorrowedBooksPaginated.map(transaction => (
              <Card key={transaction._id} sx={{ p: 2, mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6">{transaction.book.title}</Typography>
                    <Typography color="textSecondary">
                      Borrowed: {formatDate(transaction.borrowDate)}
                    </Typography>
                    <Typography color="success.main">
                      Returned: {formatDate(transaction.returnDate)}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        )}

        {/* Pagination */}
        {pastBorrowedBooks.length > itemsPerPage && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={Math.ceil(pastBorrowedBooks.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default BorrowedBooksPage;
