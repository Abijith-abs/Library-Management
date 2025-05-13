const express = require('express');
const router = express.Router();
const { returnBooks, borrowBooks, getUserTransactions, getTransaction, calculateLateFee } = require('./transaction.controller');
const verifyToken = require('../middleware/verifyToken.jsx');

// Route to borrow multiple books
router.post('/borrow', verifyToken, borrowBooks);

// Route to return multiple books
router.post('/return', verifyToken, returnBooks);

// Route to get user's transaction history for current logged-in user
router.get('/history', verifyToken, getUserTransactions);

// Route to get user's transaction history by user ID (for admin)
router.get('/history/:userId', verifyToken, getUserTransactions);

// Route to calculate late fee
router.get('/calculate-late-fee', verifyToken, calculateLateFee);

// Route to get a single transaction by ID
router.get('/:id', verifyToken, getTransaction);

module.exports = router;
