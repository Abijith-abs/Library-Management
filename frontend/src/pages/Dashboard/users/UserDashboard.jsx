import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useEffect, useState } from 'react';

const UserDashboard = () => {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('/api/transactions/history');
                setTransactions(response.data.transactions);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchTransactions();
        }
    }, [currentUser]);

    if (!currentUser) return <div>Please log in to view your dashboard</div>;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error getting transaction history</div>;

    return (
        <div className="bg-gray-100 py-16">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
                <p className="text-gray-700 mb-6">Welcome, {currentUser?.username || currentUser?.email || 'User'}!</p>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Your Book Transactions</h2>
                    {transactions && transactions.length > 0 ? (
                        <ul className="space-y-4">
                            {transactions.map((transaction) => (
                                <li key={transaction._id} className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-1">
                                    <p className="font-medium">Book: {transaction.book.title}</p>
                                    <p>Borrowed on: {new Date(transaction.borrowDate).toLocaleDateString()}</p>
                                    <p>Due Date: {new Date(transaction.dueDate).toLocaleDateString()}</p>
                                    <p>Status: {transaction.isReturned ? 'Returned' : 'Active'}</p>                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">You have no recent book transactions.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;