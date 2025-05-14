import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  useGetTransactionQuery,
  useCalculateLateFeeQuery,
  useReturnBookMutation
} from '../../../redux/features/transactions/transactionsApi';
import LateFeeInfo from '../../../components/LateFeeInfo/LateFeeInfo';
import { formatDate } from '../../../utils/dateFormatter';

const ReturnBook = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [returnDate] = useState(new Date().toISOString());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [successDialog, setSuccessDialog] = useState(false);

  const { data: transaction, isLoading, isError, refetch } = useGetTransactionQuery(transactionId);
  const { data: lateFeeData } = useCalculateLateFeeQuery(
    { dueDate: transaction?.dueDate, returnDate },
    { skip: !transaction?.dueDate }
  );
  const [returnBook, { isLoading: isReturning }] = useReturnBookMutation();
  console.log("Trying to return book with transactionId:", transactionId);

  const handleReturnBook = async () => {
    if (!transaction?.book?._id) {
      setSnackbar({
        open: true,
        message: 'Book information not found',
        severity: 'error'
      });
      return;
    }

    try {
      await returnBook([transaction.book._id]).unwrap();
      setSuccessDialog(true);
      // Will navigate after dialog is closed
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.data?.message || 'Failed to return book',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography color="error" gutterBottom>
            Error loading transaction details
          </Typography>
          <Button variant="contained" onClick={refetch} sx={{ mt: 2 }}>
            Retry
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Late Fee Calculator
        </Typography>

        {transaction && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Book: {transaction.book?.title}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              Borrowed on: {formatDate(transaction.borrowDate)}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              Due on: {formatDate(transaction.dueDate)}
            </Typography>
          </Box>
        )}

        {transaction?.dueDate && (
          <LateFeeInfo
            lateFee={lateFeeData?.lateFee || 0}
            dueDate={transaction.dueDate}
            returnDate={returnDate}
          />
        )}

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/borrowed-books')}
          >
            Back to Borrowed Books
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReturnBook}
            disabled={isReturning}
          >
            {isReturning ? 'Returning...' : 'Return Book'}
          </Button>
        </Box>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Dialog
          open={successDialog}
          onClose={() => {
            setSuccessDialog(false);
            navigate('/borrowed-books');
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" component="div">
              Book Returned Successfully!
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography align="center" sx={{ mt: 2 }}>
              {transaction?.book?.title} has been successfully returned.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button
              variant="contained"
              onClick={() => {
                setSuccessDialog(false);
                navigate('/borrowed-books');
              }}
              sx={{ minWidth: 150 }}
            >
              Back to Borrowed Books
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default ReturnBook;
