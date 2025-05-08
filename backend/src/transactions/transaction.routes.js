const express = require('express');
const router = express.Router();
const { returnBooks, borrowBooks, getUserTransactions } = require('./transaction.controller');
const verifyToken = require('../middleware/verifyToken.jsx');

// Route to borrow multiple books
router.post('/borrow', verifyToken, borrowBooks);

// Route to return multiple books
router.post('/return', verifyToken, returnBooks);

// Route to get user's transaction history for current logged-in user
router.get('/history', verifyToken, getUserTransactions);

// Route to get user's transaction history by user ID (for admin)
router.get('/history/:userId', verifyToken, getUserTransactions);

module.exports = router;
