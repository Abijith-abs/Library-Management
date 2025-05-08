const mongoose = require('mongoose');
const express = require('express');
const Transaction = require('../transactions/transaction.model');
const Book = require('../books/book.model');
const User = require('../users/user.model');

const router = express.Router();

// Function to calculate admin stats
router.get("/", async (req, res) => {
    try {
        // Total number of books
        const totalBooks = await Book.countDocuments();

        // Total number of users
        const totalUsers = await User.countDocuments();

        // Total transactions
        const totalTransactions = await Transaction.countDocuments();

        // Overdue books
        const overdueBooks = await Transaction.countDocuments({
            status: 'BORROWED',
            dueDate: { $lt: new Date() }
        });

        // Top borrowed books
        const topBorrowedBooks = await Transaction.aggregate([
            { $match: { status: 'BORROWED' } },
            { $group: { _id: '$book', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'bookDetails'
                }
            },
            { $unwind: '$bookDetails' },
            {
                $project: {
                    title: '$bookDetails.title',
                    author: '$bookDetails.author',
                    count: 1
                }
            }
        ]);

        // Monthly transaction data (last 12 months)
        const monthlyTransactions = await Transaction.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Prepare monthly transaction data for chart (ensure 12 months)
        const transactionData = Array(12).fill(0).map((_, index) => {
            const monthData = monthlyTransactions.find(m => parseInt(m._id) === index + 1);
            return monthData ? monthData.count : 0;
        });

        // Top borrowers
        const topBorrowers = await Transaction.aggregate([
            { $match: { status: 'BORROWED' } },
            { 
                $group: { 
                    _id: '$user', 
                    borrowCount: { $sum: 1 } 
                } 
            },
            { $sort: { borrowCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $project: {
                    name: '$userDetails.username',
                    avatar: '$userDetails.avatar',
                    borrowCount: 1
                }
            }
        ]);

        // Result summary
        res.status(200).json({
            totalBooks,
            totalUsers,
            totalTransactions,
            overdueBooks,
            topBooks: topBorrowedBooks,
            monthlyTransactions: transactionData,
            topBorrowers
        });
      
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Failed to fetch admin stats" });
    }
});

module.exports = router;