const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    emoji: { type: String, required: true },
    price: { type: Number, required: true },
    weight: { type: String, required: true },
    category: { type: String, required: true, enum: ['vegetables', 'fruits', 'dairy', 'staples'] },
    stock: { type: Number, default: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
