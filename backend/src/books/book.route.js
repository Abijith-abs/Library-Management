const express = require('express');

const Book = require('../books/book.model');

const { postBook, getAllBooks, getSingleBook, updateBookData, deleteABook } = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyToken.jsx');

const router = express.Router();


// post = when submit something frontend to DB
//get = when get something from DB to frontend
//put/patch = update something from DB
//delete = delete something from DB


// post a book

router.post("/create-Book",verifyAdminToken,postBook )

router.get("/", getAllBooks)

router.get("/:id", getSingleBook)

router.put("/edit/:id",verifyAdminToken,updateBookData)

router.delete("/:id", verifyAdminToken,deleteABook)



module.exports=router;