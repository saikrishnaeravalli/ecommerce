const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    content: String
});

module.exports = mongoose.model('Image', imageSchema);
