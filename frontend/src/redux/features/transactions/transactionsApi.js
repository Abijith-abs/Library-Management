import { api } from "../../api/apiSlice";

export const transactionsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTransactions: builder.query({
            query: () => "/transactions/history",
            providesTags: ["Transactions"],
        }),

        getTransaction: builder.query({
            query: (id) => `/transactions/${id}`,
            providesTags: (result, error, id) => [{ type: "Transaction", id }],
        }),

        returnBook: builder.mutation({
            query: (bookIds) => ({
                url: `/transactions/return`,
                method: "POST",
                body: { bookIds },
            }),
            invalidatesTags: ["Transactions"],
        }),

        calculateLateFee: builder.query({
            query: ({ dueDate, returnDate }) => ({
                url: `/transactions/calculate-late-fee`,
                method: "GET",
                params: { dueDate, returnDate },
            }),
        }),
    }),
});

export const {
    useGetTransactionsQuery,
    useGetTransactionQuery,
    useReturnBookMutation,
    useCalculateLateFeeQuery,
} = transactionsApi;
