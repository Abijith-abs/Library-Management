import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseUrl'


const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/books`, 
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('admin-token')
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
    }
})

export const booksApi = createApi({
    reducerPath: 'booksApi',
    baseQuery,
    tagTypes: ['Books'], 
    endpoints: (builder) => 
    ({
        fetchAllBooks: builder.query({
            query: () => "/",
            providesTags: ['Books']
        }),

        fetchBookById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (results, error, id) => [{type: 'Books', id}],
            transformResponse: (response) => {
                console.log('Book fetch response:', response);
                return response.book || response; // Handle both { book: {...} } and direct book object
            },
          }),
          

        addBook: builder.mutation({
            query: (newBook) => ({
                url: "/create-Book",
                method: "POST",
                body: newBook
            }),
            invalidatesTags: ['Books']
        }),

        updateBookData: builder.mutation({
            query: ({id, ...rest}) => ({
                url: `/edit/${id}`,
                method: "PUT",
                body: rest,
                headers: { 'Content-type': 'application/json' }
        }),

        invalidatesTags: ['Books']
        }),
        deleteBook: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Books']
        })
    })
    })



export const { useFetchAllBooksQuery,useFetchBookByIdQuery,useAddBookMutation, useUpdateBookDataMutation, useDeleteBookMutation } = booksApi
export default booksApi
