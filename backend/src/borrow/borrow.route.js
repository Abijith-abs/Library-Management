const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken.jsx'); // Your JWT middleware
const { borrowBooks } = require('./borrow.controller');

// Route to borrow books (POST with book IDs in body)
router.post('/borrow', verifyToken, borrowBooks);

module.exports = router;
