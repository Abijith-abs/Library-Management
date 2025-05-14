import React from 'react';
import { formatDate } from '../../../utils/dateFormatter';
import { useAuth } from '../../../context/AuthContext';
import AuthProvider from '../../../context/AuthContext';
import axios from 'axios';

const UserDashboard = () => {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log('Current User:', currentUser);

                // Get token from localStorage
                const storedToken = localStorage.getItem('token');
                const storedUser = JSON.parse(localStorage.getItem('user'));

                console.log('Stored Token:', storedToken);
                console.log('Stored User:', storedUser);

                // Set token and user details
                setToken(storedToken);
                setUserDetails(storedUser);

                // Configure axios with token
                if (storedToken) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                }

                // Fetch transactions - MODIFY THIS ENDPOINT AS PER YOUR BACKEND
                try {
                    const transactionsResponse = await axios.get('http://localhost:3000/api/user/transactions', {
                        headers: {
                            'Authorization': `Bearer ${storedToken}`
                        }
                    });
                    console.log('Transactions Response:', transactionsResponse.data);
                    
                    // Handle different response types
                    if (typeof transactionsResponse.data === 'string') {
                        // If it's just a success message, set transactions to an empty array
                        setTransactions([]);
                    } else if (Array.isArray(transactionsResponse.data)) {
                        // If it's an array, set transactions directly
                        setTransactions(transactionsResponse.data);
                    } else if (transactionsResponse.data.transactions) {
                        // If it's an object with transactions property
                        setTransactions(transactionsResponse.data.transactions);
                    } else {
                        // Fallback to empty array
                        setTransactions([]);
                        console.warn('Unexpected transactions data format');
                    }
                } catch (transactionError) {
                    console.error('Transaction Fetch Error:', transactionError);
                    console.error('Transaction Error Response:', transactionError.response?.data);
                }

                setLoading(false);
            } catch (err) {
                console.error('Complete Fetch Error:', err);
                setError(err);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error getting user information: {error.message}</div>;

    return (
        <div className="bg-gray-100 min-h-screen py-16">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">User Dashboard</h1>
                
                {/* User Details Section */}
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Personal Information</h2>
                    <div className="space-y-3">
                        <p className="text-gray-600">
                            <span className="font-medium text-gray-800">Username:</span> {currentUser.username || 'Not available'}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium text-gray-800">Email:</span> {currentUser.email || 'Not available'}
                        </p>
                        {token && (
                            <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                                <p className="text-gray-600 font-medium mb-2">Authentication Token:</p>
                                <code className="break-all text-sm text-gray-700">{token}</code>
                            </div>
                        )}
                    </div>
                </div>

                {/* Book Transactions Section */}
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Book Transactions</h2>
                    {transactions && transactions.length > 0 ? (
                        <ul className="space-y-4">
                            {transactions.map((transaction) => (
                                <li key={transaction._id} className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-2">
                                    <p className="font-medium text-gray-800">Book: {transaction.book.title}</p>
                                    <p className="text-gray-600">Borrowed on: {formatDate(transaction.borrowDate)}</p>
                                    <p className="text-gray-600">Due Date: {formatDate(transaction.dueDate)}</p>
                                    <p className="font-semibold">Status: {transaction.isReturned ? 'Returned' : 'Active'}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">You have no recent book transactions.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;