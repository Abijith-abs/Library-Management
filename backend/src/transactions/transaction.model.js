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

const FEE_STRUCTURE = {
    gracePeriod: 2,          // 2 days grace period
    progressiveFees: [
        { days: 7,  feePerDay: 2 },   // $2/day for first week
        { days: 14, feePerDay: 3 },   // $3/day for second week
        { days: Infinity, feePerDay: 5 }  // $5/day after two weeks
    ],
    maxTotalFee: 100         // Maximum total fee cap
};

// Enhanced static method to calculate late fees
transactionSchema.statics.calculateLateFee = function(dueDate, returnDate) {
    if (!returnDate || returnDate <= dueDate) return 0;

    // Add grace period to due date
    const effectiveDueDate = new Date(dueDate);
    effectiveDueDate.setDate(effectiveDueDate.getDate() + FEE_STRUCTURE.gracePeriod);
    
    if (returnDate <= effectiveDueDate) return 0;

    let totalFee = 0;
    let lateDays = Math.ceil((returnDate - effectiveDueDate) / (1000 * 60 * 60 * 24));
    let remainingDays = lateDays;
    let currentFeeIndex = 0;

    while (remainingDays > 0 && totalFee < FEE_STRUCTURE.maxTotalFee) {
        const currentLevel = FEE_STRUCTURE.progressiveFees[currentFeeIndex];
        const daysAtCurrentRate = currentFeeIndex < FEE_STRUCTURE.progressiveFees.length - 1
            ? Math.min(remainingDays, currentLevel.days)
            : remainingDays;

        const feeForPeriod = daysAtCurrentRate * currentLevel.feePerDay;
        totalFee += feeForPeriod;
        remainingDays -= daysAtCurrentRate;
        currentFeeIndex++;
    }

    return Math.min(totalFee, FEE_STRUCTURE.maxTotalFee);
};

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
