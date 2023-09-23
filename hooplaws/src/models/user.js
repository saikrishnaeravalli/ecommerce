const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    hash: String,
    salt: String,
    createdAt: Date,
    gender: String,
    phoneno: Number,
    address: String,
    zipcode: Number,
    role: { type: String, enum: ['C', 'S', 'A'], default: 'C' }
});
const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel