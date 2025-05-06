const express = require('express');
const router = express.Router();
const { returnBooks, borrowBooks, getUserTransactions } = require('./transaction.controller');
const verifyToken = require('../middleware/verifyToken.jsx');

// Route to borrow multiple books
router.post('/borrow', verifyToken, borrowBooks);

// Route to return multiple books
router.post('/return', verifyToken, returnBooks);

// Route to get user's transaction history
router.get('/history', verifyToken, getUserTransactions);

module.exports = router;
