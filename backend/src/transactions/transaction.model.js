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
    status: {
        type: String,
        enum: ['pending', 'active', 'overdue', 'returned', 'cancelled'],
        default: 'pending'
    },
    lateFee: {
        type: Number,
        default: 0,
    },
    notes: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Pre-save middleware to update status
transactionSchema.pre('save', function(next) {
    const now = new Date();
    
    if (this.isReturned) {
        this.status = 'returned';
    } else if (now > this.dueDate) {
        this.status = 'overdue';
    } else if (this.borrowDate) {
        this.status = 'active';
    }

    next();
});

// Static method to calculate late fees
transactionSchema.statics.calculateLateFee = function(dueDate, returnDate, feePerDay = 2) {
    if (returnDate > dueDate) {
        const lateDays = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
        return lateDays * feePerDay;
    }
    return 0;
};

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
