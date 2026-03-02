const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    monthlyBudget: { type: Number, required: true },
    splits: {
        rent: { pct: Number, amount: Number },
        food: { pct: Number, amount: Number },
        utilities: { pct: Number, amount: Number },
        cleaning: { pct: Number, amount: Number },
        transport: { pct: Number, amount: Number },
        savings: { pct: Number, amount: Number }
    },
    expenses: [{
        title: String,
        amount: Number,
        category: String,
        date: { type: Date, default: Date.now }
    }],
    tip: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);
