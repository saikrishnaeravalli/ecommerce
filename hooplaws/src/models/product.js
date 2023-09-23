const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, },
    description: { type: String, required: true, },
    price: { type: Number, required: true, min: 0, },
    stock: { type: Number, required: true, min: 0, },
    category: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Home', 'Sports', 'Other'], },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
    createdAt: { type: Date, default: Date.now, },
});

module.exports = mongoose.model('Product', productSchema);
