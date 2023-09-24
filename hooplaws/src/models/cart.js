const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 }, // You can adjust this as needed
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Update the `updatedAt` field before saving
cartSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Cart', cartSchema);
