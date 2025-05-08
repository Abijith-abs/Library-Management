import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getBaseUrl from '../../utils/baseUrl';
import { IoPersonOutline, IoBookOutline } from 'react-icons/io5';

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Use admin token directly
        const adminToken = localStorage.getItem('admin-token');
        
        // Validate admin token
        if (!adminToken) {
          throw new Error('No admin authentication token found. Please log in as admin.');
        }

        // Fetch all users from the backend using admin token
        const usersResponse = await axios.get(`${getBaseUrl()}/api/auth`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });

        // Validate response
        if (usersResponse.data === 'Library is runniing succesfully') {
          throw new Error('Backend returned a default message instead of users.');
        }

        // Determine the correct users array
        let usersList = Array.isArray(usersResponse.data) 
          ? usersResponse.data 
          : (usersResponse.data.users || usersResponse.data.data || []);

        // Filter users with role="user"
        const filteredUsers = usersList.filter(user => user.role === 'user');

        // Fetch borrowed books for each user
        const usersWithBooks = await Promise.all(filteredUsers.map(async (user) => {
          try {
            console.log(`Fetching transactions for user: ${user._id}`);
            // Fetch transactions for the specific user by passing their ID in the request body
            const transactionsResponse = await axios.get(`${getBaseUrl()}/transactions/history/${user._id}`, {
              headers: {
                'Authorization': `Bearer ${adminToken}`
              }
            });

            console.log('Transactions response:', JSON.stringify(transactionsResponse.data, null, 2));

            // Robust check for transactions
            if (!transactionsResponse.data || !transactionsResponse.data.transactions) {
              console.warn(`No transactions found for user ${user._id}`);
              return {
                ...user,
                borrowedBooks: []
              };
            }

            // Filter active (not returned) transactions and map to books
            const activeBorrowedBooks = (transactionsResponse.data.transactions || [])
              .filter(transaction => transaction && !transaction.isReturned)
              .map(transaction => ({
                _id: transaction.book?._id || null,
                title: transaction.book?.title || 'Unknown Book',
                dueDate: transaction.dueDate
              }));

            return {
              ...user,
              borrowedBooks: activeBorrowedBooks
            };
          } catch (bookError) {
            console.error(`Error fetching books for user ${user._id}:`, bookError);
            return {
              ...user,
              borrowedBooks: []
            };
          }
        }));

        // Update state
        setUsers(usersWithBooks);
        setLoading(false);
      } catch (err) {
        console.error('Full error:', err);
        setError(err.message || 'An unexpected error occurred while fetching users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="text-center py-10">Loading users...</div>;
  if (error) return <div className="text-red-500 text-center py-10">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex items-center mb-6">
          <IoPersonOutline className="h-8 w-8 text-indigo-600 mr-3" />
          <h2 className="text-3xl font-semibold leading-tight">User Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user._id} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex items-center mb-4">
                <IoPersonOutline className="h-6 w-6 text-indigo-600 mr-3" />
                <h3 className="text-xl font-semibold">{user.username}</h3>
              </div>
              <p className="text-gray-600 mb-2">Email: {user.email}</p>
              <p className="text-gray-600 mb-4">Role: {user.role}</p>
              
              <div className="border-t pt-4">
                <h4 className="text-lg font-medium mb-2">Borrowed Books</h4>
                {user.borrowedBooks && user.borrowedBooks.length > 0 ? (
                  <ul className="space-y-2">
                    {user.borrowedBooks.map((book) => (
                      <li key={book._id} className="flex justify-between text-sm text-gray-700">
                        <span>{book.title}</span>
                        <span className="text-xs text-gray-500">
                          Due: {new Date(book.dueDate).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No books borrowed</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
