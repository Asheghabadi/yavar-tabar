const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    part: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Part',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Initially no vendor is assigned
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'completed', 'cancelled'],
        default: 'pending'
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
}, { timestamps: true }); // Add timestamps for creation and update times

module.exports = mongoose.model('Order', orderSchema);