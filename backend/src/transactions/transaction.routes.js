const express = require('express');
const router = express.Router();
const { returnBook, borrowBook } = require('./transaction.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken.jsx');

// Route to return a book
router.post('/return', verifyAdminToken, returnBook);

// Route to borrow a book
router.post('/borrow', verifyAdminToken, borrowBook);

module.exports = router;
