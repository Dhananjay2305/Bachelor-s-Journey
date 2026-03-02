const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    emoji: String,
    price: Number,
    qty: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    delivery: { type: Number, default: 0 },
    total: { type: Number, required: true },
    estimatedDelivery: { type: Date },
    status: { type: String, default: 'placed', enum: ['placed', 'confirmed', 'delivered', 'cancelled'] }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
