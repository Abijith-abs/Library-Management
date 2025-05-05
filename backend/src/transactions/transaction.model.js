const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Books",
        required: true,
    },
    borrowDate: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    returnDate: Date,
    isReturned: {
        type: Boolean,
        default: false,
    },
    lateFee: {
        type: Number,
        default: 0,
    },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
