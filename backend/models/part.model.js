const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    partNumber: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Part', partSchema);

