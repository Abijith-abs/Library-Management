const mongoose = require('mongoose');

const kittySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    trending: {
        type: Boolean,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    oldPrice: Number,
    newPrice: Number,
    createdAt:{
        type: Date,
        default: Date.now()
    }
},{
    timestamps: true
});

const Books = mongoose.model('Books', kittySchema);

module.exports = Books;
