import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:3000/api',
        prepareHeaders: (headers) => {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            
            // If token exists, add authorization header
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            
            return headers;
        },
    }),
    tagTypes: ['Transactions', 'Transaction'],
    endpoints: () => ({}),
});

// Export hooks for usage in components
export const {
    middleware: apiMiddleware,
    reducer: apiReducer,
    reducerPath: apiReducerPath,
} = api;
