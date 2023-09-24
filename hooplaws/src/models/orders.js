const mongoose = require('mongoose');

// Define the OrderItem schema
const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

// Define the Order schema
const orderSchema = new mongoose.Schema({
    orderID: {
        type: String,
        required: true,
        unique: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shippingInformation: {
        fullName: {
            type: String,
            required: true,
        },
        address1: {
            type: String,
            required: true,
        },
        address2: String,
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        zipcode: {
            type: String,
            required: true,
        },
    },
    items: [orderItemSchema], // Array of order items
    totalAmount: {
        type: Number,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
});

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
