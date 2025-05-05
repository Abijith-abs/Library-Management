const Transaction = require('./transaction.model');
const Books = require('../books/book.model');


const borrowBook = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.id;

        // Check if book is already borrowed (unreturned)
        const existingTransaction = await Transaction.findOne({
            book: bookId,
            isReturned: false
        });

        if (existingTransaction) {
            return res.status(400).json({ message: 'Book is already borrowed.' });
        }

        const borrowDate = new Date();
        const dueDate = new Date(borrowDate);
        dueDate.setDate(dueDate.getDate() + 14); // 2-week return policy

        const newTransaction = new Transaction({
            user: userId,
            book: bookId,
            borrowDate,
            dueDate,
            isReturned: false
        });

        await newTransaction.save();

        // Update book status to 'borrowed'
        await Books.findByIdAndUpdate(bookId, { status: 'borrowed' });

        res.status(201).json({
            message: 'Book borrowed successfully.',
            transaction: newTransaction
        });

    } catch (error) {
        console.error('Error borrowing book:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


const returnBook = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.id;

        // Find the active transaction
        const transaction = await Transaction.findOne({
            user: userId,
            book: bookId,
            isReturned: false
        });

        if (!transaction) {
            return res.status(404).json({ message: 'No active borrow transaction found for this book.' });
        }

        const currentDate = new Date();
        transaction.returnDate = currentDate;
        transaction.isReturned = true;

        // Calculate late fee if return is after due date
        if (currentDate > transaction.dueDate) {
            const lateDays = Math.ceil((currentDate - transaction.dueDate) / (1000 * 60 * 60 * 24));
            const lateFeePerDay = 2; // Example: ₹2 per day
            transaction.lateFee = lateDays * lateFeePerDay;
        }

        await transaction.save();

        // Update book status to 'available'
        await Books.findByIdAndUpdate(bookId, { status: 'available' });

        res.status(200).json({
            message: 'Book returned successfully.',
            lateFee: transaction.lateFee
        });
    } catch (error) {
        console.error('Error returning book:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    returnBook,
    borrowBook
};
