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
      const response = await api.get('/transactions/history');
      return response.data.transactions;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
    try {
      const response = await api.post('/transactions/return', { bookIds });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
      })
      .addCase(fetchBorrowedBooks.fulfilled, (state, action) => {
        state.borrowedBooks = action.payload;
        state.loading = false;
      })
      .addCase(borrowBooks.fulfilled, (state) => {
        state.borrowList = [];
        state.error = null;
      })
      .addCase(returnBooks.fulfilled, (state) => {
        state.error = null;
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || 'An error occurred';
        }
      );
  }
});

export const { removeFromBorrowList, clearBorrowList } = borrowSlice.actions;
export default borrowSlice.reducer;
