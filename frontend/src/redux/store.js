import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './features/books/bookSlice';
import borrowReducer from './features/borrow/borrowSlice';
import { booksApi } from './features/books/booksApi';
import { transactionsApi } from './features/transactions/transactionsApi';
import { api } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer,
    borrow: borrowReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(booksApi.middleware)
      .concat(api.middleware),
});
