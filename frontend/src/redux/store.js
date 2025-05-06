import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './features/books/bookSlice';
import borrowReducer from './features/borrow/borrowSlice';
import { booksApi } from './features/books/booksApi';

export const store = configureStore({
  reducer: {
    books: booksReducer,
    borrow: borrowReducer,
    [booksApi.reducerPath]: booksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(booksApi.middleware),
});
