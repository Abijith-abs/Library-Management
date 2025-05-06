// src/transactions/borrow.controller.js
const Transaction = require('../transactions/transaction.model');
const Books = require('../books/book.model');
const User = require('../users/user.model'); // MongoDB User model

async function borrowBooks(req, res) {
  try {
    const userId = req.user.id; // ← Now from JWT, not Firebase

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { productIds } = req.body; // List of book IDs
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'No books selected to borrow' });
    }

    const transactions = [];
    for (const bookId of productIds) {
      const book = await Books.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: `Book ${bookId} not found` });
      }
      if (book.status === 'borrowed') {
        return res.status(400).json({ message: `Book "${book.title}" is already borrowed` });
      }

      const borrowDate = new Date();
      const dueDate = new Date(borrowDate);
      dueDate.setDate(dueDate.getDate() + 14); // 2-week policy

      // Create transaction
      const tx = await Transaction.create({
        user: userId,
        book: bookId,
        borrowDate,
        dueDate,
        isReturned: false,
        lateFee: 0,
      });

      // Update book status
      book.status = 'borrowed';
      await book.save();

      transactions.push(await tx.populate('book'));
    }

    return res.status(201).json({
      message: 'Books borrowed successfully!',
      transactions,
    });
  } catch (error) {
    console.error('Error borrowing books:', error);
    return res.status(500).json({ message: 'Failed to borrow books', error: error.message });
  }
}

module.exports = { borrowBooks };
