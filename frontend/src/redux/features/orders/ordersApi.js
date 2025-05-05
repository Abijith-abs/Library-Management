import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseUrl'

const ordersApi = createApi({
    reducerPath : 'ordersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/orders`,
        credentials: 'include',
    }),
    tagTypes:['Orders'],
    endpoints: (builder) => ({
        createAnOrder: builder.mutation({
            query: (newOrder) => ({
                url: '/',
                method: 'POST',
                body: newOrder,
                credentials: 'include'
            }),
            invalidatesTags: ['Orders']
        }),
        getOrderByEmail: builder.query({
            query: (email) => `/email/${email}`,
            transformResponse: (response) => response.orders,
            providesTags: ['Orders']
        })
    })
})

export const { useCreateAnOrderMutation, useGetOrderByEmailQuery } = ordersApi;

export default ordersApi