const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    title: String,
    genre: String,
    image: String,
    description: String,
    inventory: Number,
    price: Number
});

module.exports = mongoose.model('books', BookSchema);