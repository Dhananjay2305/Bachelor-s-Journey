const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    emoji: { type: String, required: false },
    image: { type: String, required: false },
    regionEmoji: { type: String, required: false },
    category: { type: String, required: true, enum: ['breakfast', 'lunch', 'dinner', 'snacks'] },
    difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
    time: { type: String, required: true },
    isVegetarian: { type: Boolean, default: true },
    servings: { type: Number, required: true },
    desc: { type: String, required: true },
    ingredients: [{ type: String }],
    steps: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
