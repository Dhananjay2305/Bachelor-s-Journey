const recipes = require('./models/Recipe');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const allRecipes = await recipes.find({});
    try {
        const html = allRecipes.map(r => {
            const difficultyCap = r.difficulty ? r.difficulty.charAt(0).toUpperCase() + r.difficulty.slice(1) : 'Medium';
            const regionEmoji = r.regionEmoji || '🍽️';
            return `Card: ${r.name}, ${difficultyCap}`;
        }).join('');
        console.log("Success! Rendered HTML length:", html.length);
    } catch (err) {
        console.error("Render failed:", err);
    }
    process.exit(0);
});
