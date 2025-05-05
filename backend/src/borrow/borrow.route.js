const express = require('express');
const router = express.Router();
const { borrowBooks } = require('./borrow.controller');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken.jsx');

router.post('/', verifyFirebaseToken, borrowBooks);

module.exports = router;
