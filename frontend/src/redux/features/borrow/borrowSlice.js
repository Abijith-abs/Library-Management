import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Configure axios to include token
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchBorrowedBooks = createAsyncThunk(
  'borrow/fetchBorrowedBooks',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching borrowed books...');
      const response = await api.get('/transactions/history');
      console.log('Full API Response:', response);
      console.log('Transactions:', response.data.transactions);
      
      // Validate and transform transactions
      const transactions = response.data.transactions || [];
      const validTransactions = transactions.filter(transaction => 
        transaction && transaction.book && transaction.book._id
      );
      
      console.log('Valid Transactions:', validTransactions);
      
      if (validTransactions.length === 0) {
        console.warn('No valid transactions found');
      }
      
      return validTransactions;
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch borrowed books',
        error: error.message
      });
    }
  }
);

export const addToBorrow = createAsyncThunk(
  'borrow/addToBorrow',
  async ({ bookId }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const currentBorrowList = state.borrow.borrowList;
      
      // Check if book is already in borrow list
      if (currentBorrowList.includes(bookId)) {
        return currentBorrowList;
      }

      // Check borrowing limit
      if (currentBorrowList.length >= 3) {
        throw new Error('Maximum 3 books can be borrowed at a time');
      }

      return [...currentBorrowList, bookId];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const borrowBooks = createAsyncThunk(
  'borrow/borrowBooks',
  async (bookIds, { rejectWithValue }) => {
    try {
      const response = await api.post('/transactions/borrow', { bookIds });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const returnBooks = createAsyncThunk(
  'borrow/returnBooks',
  async (bookIds, { rejectWithValue }) => {
    console.log('ReturnBooks thunk called with:', bookIds);

    // Validate input
    if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
      console.error('Invalid bookIds provided');
      return rejectWithValue({ message: 'No books selected to return' });
    }

    try {
      console.log('Attempting to return books:', bookIds);
      const response = await api.post('/transactions/return', { bookIds });
      
      console.log('Return books API response:', response.data);

      // Validate response
      if (!response.data || !response.data.returnedTransactions) {
        console.warn('Unexpected API response structure');
        return rejectWithValue({ message: 'Unexpected server response' });
      }

      return {
        returnedTransactions: response.data.returnedTransactions,
        message: response.data.message || 'Books returned successfully'
      };
    } catch (error) {
      console.error('Comprehensive return books error:', error);
      
      // Log detailed error information
      if (error.response) {
        console.error('Error response details:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }

      return rejectWithValue(
        error.response?.data || { 
          message: error.message || 'Failed to return books',
          details: error.toString()
        }
      );
    }
  }
);

const borrowSlice = createSlice({
  name: 'borrow',
  initialState: {
    borrowList: [],
    borrowedBooks: [],
    loading: false,
    error: null
  },
  reducers: {
    removeFromBorrowList: (state, action) => {
      state.borrowList = state.borrowList.filter(bookId => bookId !== action.payload);
    },
    clearBorrowList: (state) => {
      state.borrowList = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToBorrow.fulfilled, (state, action) => {
        state.borrowList = action.payload;
        state.error = null;
      })
      .addCase(fetchBorrowedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBorrowedBooks.fulfilled, (state, action) => {
        console.log('Updating borrowedBooks state', action.payload);
        // Ensure payload is an array before assignment
        state.borrowedBooks = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchBorrowedBooks.rejected, (state, action) => {
        console.error('Fetch borrowed books failed', action.payload);
        state.borrowedBooks = [];
        state.loading = false;
        state.error = action.payload || 'Failed to fetch borrowed books';
      })
      .addCase(borrowBooks.fulfilled, (state) => {
        state.borrowList = [];
        state.error = null;
      })
      .addCase(returnBooks.fulfilled, (state, action) => {
        // Remove returned books from the borrowedBooks list
        if (action.payload && action.payload.returnedTransactions) {
          const returnedBookIds = action.payload.returnedTransactions.map(t => t.bookId);
          state.borrowedBooks = state.borrowedBooks.filter(
            transaction => !returnedBookIds.includes(transaction.book._id)
          );
        }
        state.error = null;
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = typeof action.payload === 'string' 
  ? { message: action.payload } 
  : (action.payload || { message: 'An error occurred' });

        }
      );
  }
});

export const { removeFromBorrowList, clearBorrowList } = borrowSlice.actions;
export default borrowSlice.reducer;
