const Transaction = require('./transaction.model');
const Books = require('../books/book.model');
const User = require('../users/user.model');

// Borrow multiple books
const borrowBooks = async (req, res) => {
    try {
        const { bookIds } = req.body;
        const userId = req.user.id;

        if (!Array.isArray(bookIds) || bookIds.length === 0) {
            return res.status(400).json({ message: 'No books selected to borrow' });
        }

        // Check user's current borrowed books limit
        const currentBorrowedBooks = await Transaction.countDocuments({
            user: userId,
            isReturned: false
        });

        if (currentBorrowedBooks + bookIds.length > 4) {
            return res.status(400).json({ message: 'Exceeds maximum book borrowing limit of 3' });
        }

        const borrowedTransactions = [];
        const failedBorrows = [];

        for (const bookId of bookIds) {
            try {
                // Check if book is already borrowed
                const existingTransaction = await Transaction.findOne({
                    book: bookId,
                    isReturned: false
                });

                if (existingTransaction) {
                    failedBorrows.push({
                        bookId,
                        reason: 'Book is already borrowed'
                    });
                    continue;
                }

                const borrowDate = new Date();
                const dueDate = new Date(borrowDate);
                dueDate.setDate(dueDate.getDate() + 14); // 2-week return policy

                const newTransaction = new Transaction({
                    user: userId,
                    book: bookId,
                    borrowDate,
                    dueDate,
                    status: 'active',
                    notes: 'Standard 2-week borrow'
                });

                await newTransaction.save();

                // Update book status to 'borrowed'
                await Books.findByIdAndUpdate(bookId, { status: 'borrowed' });

                borrowedTransactions.push({
                    bookId,
                    transactionId: newTransaction._id,
                    dueDate: newTransaction.dueDate
                });
            } catch (bookError) {
                failedBorrows.push({
                    bookId,
                    reason: bookError.message
                });
            }
        }

        // Determine overall response
        if (borrowedTransactions.length === 0) {
            return res.status(400).json({
                message: 'Failed to borrow any books',
                failedBorrows
            });
        }

        return res.status(201).json({
            message: 'Books borrowed successfully!',
            borrowedTransactions,
            ...(failedBorrows.length > 0 && { failedBorrows })
        });
    } catch (error) {
        console.error('Error borrowing books:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Return multiple books
const returnBooks = async (req, res) => {
    try {
        const { bookIds } = req.body;
        const userId = req.user.id;

        if (!Array.isArray(bookIds) || bookIds.length === 0) {
            return res.status(400).json({ message: 'No books selected to return' });
        }

        const returnedTransactions = [];
        const failedReturns = [];

        for (const bookId of bookIds) {
            try {
                // Find the active transaction
                console.log('Searching for transaction with:', {
                    user: userId,
                    book: bookId,
                    isReturned: false
                });
                const transaction = await Transaction.findOne({
                    user: userId,
                    book: bookId,
                    isReturned: false
                });
                console.log('Found transaction:', transaction);

                if (!transaction) {
                    failedReturns.push({
                        bookId,
                        reason: 'No active borrow transaction found'
                    });
                    continue;
                }

                const currentDate = new Date();
                transaction.returnDate = currentDate;
                transaction.isReturned = true;

                // Calculate late fee
                transaction.lateFee = Transaction.calculateLateFee(transaction.dueDate, currentDate);

                await transaction.save();

                // Update book status to 'available'
                await Books.findByIdAndUpdate(bookId, { status: 'available' });

                returnedTransactions.push({
                    bookId,
                    lateFee: transaction.lateFee,
                    returnDate: currentDate
                });
            } catch (bookError) {
                failedReturns.push({
                    bookId,
                    reason: bookError.message
                });
            }
        }

        // Determine overall response
        if (returnedTransactions.length === 0) {
            return res.status(400).json({
                message: 'Failed to return any books',
                failedReturns
            });
        }

        return res.status(200).json({
            message: 'Books returned successfully!',
            returnedTransactions,
            ...(failedReturns.length > 0 && { failedReturns })
        });
    } catch (error) {
        console.error('Error returning books:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get user's transaction history
const getUserTransactions = async (req, res) => {
    try {
        // Check if admin is requesting transactions for a specific user
        const userId = req.params.userId || req.user.id;

        const transactions = await Transaction.find({ user: userId })
            .populate('book', 'title')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'User transactions retrieved successfully',
            transactions
        });
    } catch (error) {
        console.error('Error retrieving user transactions:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    borrowBooks,
    returnBooks,
    getUserTransactions
};
