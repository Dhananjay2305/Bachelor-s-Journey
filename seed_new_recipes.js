const mongoose = require('mongoose');
require('dotenv').config();
const Recipe = require('./models/Recipe');

const recipes = [
    // Breakfast
    { name: "Aloo Paratha (Punjab)", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "medium", time: "15 mins", servings: 1, desc: "Aloo Paratha (Punjab)", ingredients: ["Potato mix", "Ghee", "Dough"], steps: ["Stuff with potato mix", "Roll", "Cook with ghee"] },
    { name: "Panta Bhat (Assam)", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "easy", time: "10 mins", servings: 1, desc: "Fermented rice breakfast from Assam.", ingredients: ["Leftover rice", "Water", "Salt", "Mustard oil"], steps: ["Soak rice overnight", "Add salt and oil", "Serve with sides"] },
    { name: "Tomato Poha Upma", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "easy", time: "10 mins", servings: 1, desc: "Tomato Poha Upma", ingredients: ["Onion", "Tomato", "Poha", "Turmeric"], steps: ["Fry onion + tomato", "Add poha + turmeric"] },
    { name: "Ponganalu (Telangana)", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "medium", time: "15 mins", servings: 2, desc: "Rice and urad dal batter cooked in a special pan.", ingredients: ["Dosa batter", "Onion", "Chilies"], steps: ["Mix ingredients", "Pour in pan", "Cook both sides"] },
    { name: "Semiya Upma (Kerala)", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "medium", time: "10 mins", servings: 1, desc: "Semiya Upma (Kerala)", ingredients: ["Vermicelli", "Veggies", "Water"], steps: ["Fry vermicelli + veggies", "Add water", "Cook"] },
    { name: "Shavige Uppittu (Karnataka)", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "easy", time: "15 mins", servings: 2, desc: "Vermicelli upma popular in Karnataka.", ingredients: ["Vermicelli", "Vegetables", "Spices"], steps: ["Roast vermicelli", "Cook veggies", "Mix and steam"] },
    { name: "Sabudana Khichdi (Maharashtra)", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "easy", time: "10 mins", servings: 1, desc: "Sabudana Khichdi (Maharashtra)", ingredients: ["Sabudana", "Peanuts", "Spices"], steps: ["Rinse sabudana", "Fry peanuts", "Add everything"] },
    { name: "Dosa", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "medium", time: "15 mins", servings: 2, desc: "Crispy South Indian crepe.", ingredients: ["Dosa batter", "Oil/Ghee"], steps: ["Spread batter on pan", "Add oil", "Cook till crisp"] },
    { name: "Shorshe Dim (Bengal)", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "medium", time: "15 mins", servings: 1, desc: "Shorshe Dim (Bengal)", ingredients: ["Eggs", "Mustard sauce"], steps: ["Cook eggs in mustard sauce + 5 mins"] },
    { name: "Upma", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "easy", time: "15 mins", servings: 2, desc: "Classic semolina breakfast.", ingredients: ["Rava", "Vegetables", "Water"], steps: ["Roast rava", "Boil water and veggies", "Mix rava"] },
    { name: "Idli with Chutney (Tamil Nadu)", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "easy", time: "15 mins", servings: 1, desc: "Idli with Chutney (Tamil Nadu)", ingredients: ["Idli batter", "Chutney"], steps: ["Steam idlis", "Serve with chutneys"] },

    // Lunch
    { name: "Tomato Rice (Andhra Pradesh)", regionEmoji: "🟢", category: "lunch", time: "15 mins", difficulty: "easy", desc: "Tomato Rice", servings: 1, ingredients: ["Cooked rice", "Tomato", "Onion", "Green chilli", "Mustard seeds"], steps: ["Fry mustard + onion + chilli.", "Add tomato + cook soft.", "Add rice + salt + mix well."] },
    { name: "Sev Tameta (Gujarat)", regionEmoji: "🟡", category: "lunch", time: "15 mins", difficulty: "easy", desc: "Sev Tameta", servings: 1, ingredients: ["Tomato", "Sev", "Turmeric", "Red chilli powder"], steps: ["Cook tomato masala.", "Add little water.", "Add sev at last & mix.", "Eat with roti."] },
    { name: "Sambar Rice (Quick) (Tamil Nadu)", regionEmoji: "🔵", category: "lunch", time: "15 mins", difficulty: "medium", desc: "Sambar Rice (Quick)", servings: 1, ingredients: ["Cooked rice", "Boiled dal", "Sambar powder", "Vegetables"], steps: ["Cook dal + veggies + sambar powder.", "Mix with rice.", "Add tadka."] },
    { name: "Aloo Chokha + Rice (Bihar)", regionEmoji: "🟣", category: "lunch", time: "15 mins", difficulty: "easy", desc: "Aloo Chokha + Rice", servings: 1, ingredients: ["Boiled potato", "Onion", "Mustard oil", "Green chilli"], steps: ["Mash potatoes.", "Add onion + chilli + mustard oil.", "Serve with rice."] },
    { name: "Curd Rice with Pickle (Kerala)", regionEmoji: "🟠", category: "lunch", time: "10 mins", difficulty: "easy", desc: "Curd Rice with Pickle", servings: 1, ingredients: ["Cooked rice", "Curd", "Mustard seeds", "Curry leaves"], steps: ["Mix rice + curd.", "Add tadka.", "Serve with pickle."] },
    { name: "Aloo Bhate (West Bengal)", regionEmoji: "🔴", category: "lunch", time: "15 mins", difficulty: "easy", desc: "Aloo Bhate", servings: 1, ingredients: ["Boiled potato", "Mustard oil", "Onion", "Green chilli"], steps: ["Mash potato.", "Add mustard oil + onion + salt.", "Eat with rice."] },
    { name: "Papad Ki Sabzi (Rajasthan)", regionEmoji: "🟤", category: "lunch", time: "15 mins", difficulty: "easy", desc: "Papad Ki Sabzi", servings: 1, ingredients: ["Papad", "Curd", "Red chilli powder", "Turmeric"], steps: ["Break papad pieces.", "Make curd gravy.", "Add papad + cook 5 mins."] },
    { name: "Puliyogare (Karnataka)", regionEmoji: "🟢", category: "lunch", time: "15 mins", difficulty: "easy", desc: "Puliyogare (Tamarind Rice)", servings: 1, ingredients: ["Cooked rice", "Tamarind paste", "Peanuts", "Curry leaves"], steps: ["Fry peanuts + curry leaves.", "Add tamarind paste.", "Mix rice + salt."] },
    { name: "Jeera Rice + Boiled Egg (Punjab)", regionEmoji: "🟡", category: "lunch", time: "15 mins", difficulty: "medium", desc: "Jeera Rice + Boiled Egg", servings: 1, ingredients: ["Cooked rice", "Jeera", "Boiled eggs", "Butter"], steps: ["Heat butter + jeera.", "Add rice + salt.", "Serve with boiled egg."] },
    { name: "Besara (Odisha)", regionEmoji: "🔵", category: "lunch", time: "15 mins", difficulty: "easy", desc: "Besara (Quick Veg Curry)", servings: 1, ingredients: ["Mixed vegetables", "Mustard paste", "Turmeric"], steps: ["Cook veggies soft.", "Add mustard paste + turmeric.", "Cook 5 mins."] },
    { name: "Aloo Gobi", regionEmoji: "🟢", category: "lunch", time: "15 mins", difficulty: "easy", desc: "Aloo Gobi (Potato Cauliflower)", servings: 1, ingredients: ["1 potato (cubed)", "Cauliflower florets", "Turmeric", "Chilli powder", "Jeera"], steps: ["Heat oil + add jeera.", "Add potato + gobi.", "Add spices + salt.", "Cover & cook 10 mins."] },
    { name: "Bhindi Fry", regionEmoji: "🟡", category: "lunch", time: "15 mins", difficulty: "easy", desc: "Bhindi Fry (Ladyfinger)", servings: 1, ingredients: ["Bhindi (chopped)", "Onion", "Turmeric", "Chilli powder"], steps: ["Heat oil.", "Add bhindi + cook 5 mins.", "Add onion + spices.", "Cook till crisp."] },
    { name: "Cabbage Stir Fry", regionEmoji: "🔵", category: "lunch", time: "10 mins", difficulty: "easy", desc: "Cabbage Stir Fry", servings: 1, ingredients: ["Shredded cabbage", "Mustard seeds", "Curry leaves", "Salt"], steps: ["Add mustard + curry leaves.", "Add cabbage + salt.", "Cook 7–8 mins."] },
    { name: "Beans Poriyal", regionEmoji: "🟣", category: "lunch", time: "15 mins", difficulty: "easy", desc: "Beans Poriyal (Tamil Style)", servings: 1, ingredients: ["Chopped beans", "Mustard", "Coconut (optional)"], steps: ["Add mustard + beans.", "Cook with little water.", "Add grated coconut."] },
    { name: "Capsicum Masala", regionEmoji: "🟠", category: "lunch", time: "12 mins", difficulty: "easy", desc: "Capsicum Masala", servings: 1, ingredients: ["Capsicum", "Onion", "Garam masala", "Turmeric"], steps: ["Fry onion.", "Add capsicum + spices.", "Cook till soft."] },
    { name: "Tomato Curry (Simple)", regionEmoji: "🔴", category: "lunch", time: "10 mins", difficulty: "easy", desc: "Tomato Curry (Simple)", servings: 1, ingredients: ["Tomato", "Mustard seeds", "Turmeric", "Green chilli"], steps: ["Heat oil + mustard.", "Add chopped tomato.", "Cook till soft."] },
    { name: "Mixed Veg Fry", regionEmoji: "🟤", category: "lunch", time: "15 mins", difficulty: "medium", desc: "Mixed Veg Fry", servings: 1, ingredients: ["Carrot", "Beans", "Peas", "Potato", "Garam masala"], steps: ["Add all veggies.", "Add spices + salt.", "Cook covered 10 mins."] },
    { name: "Palak Dal", regionEmoji: "🟢", category: "lunch", time: "15 mins", difficulty: "easy", desc: "Palak Dal (Spinach Dal)", servings: 1, ingredients: ["Boiled dal", "Spinach", "Garlic", "Turmeric"], steps: ["Cook dal + spinach.", "Add garlic tadka.", "Simmer 5 mins."] },
    { name: "Lauki Sabzi", regionEmoji: "🟡", category: "lunch", time: "15 mins", difficulty: "easy", desc: "Lauki Sabzi (Bottle Gourd)", servings: 1, ingredients: ["Lauki cubes", "Jeera", "Turmeric", "Tomato"], steps: ["Heat oil + jeera.", "Add lauki + spices.", "Cover & cook."] },
    { name: "Carrot Beans Masala", regionEmoji: "🔵", category: "lunch", time: "15 mins", difficulty: "easy", desc: "Carrot Beans Masala", servings: 1, ingredients: ["Carrot", "Beans", "Onion", "Chilli powder"], steps: ["Fry onion.", "Add veggies + spices.", "Cook till soft."] },

    // Dinner
    { name: "Veg Pulao", regionEmoji: "🟢", category: "dinner", time: "15 mins", difficulty: "medium", desc: "Veg Pulao", servings: 1, ingredients: ["Cooked rice", "Carrot", "Beans", "Peas", "Garam masala"], steps: ["Fry veggies in oil.", "Add spices + salt.", "Add rice and mix well.", "Cook 5 mins."] },
    { name: "Aloo Jeera", regionEmoji: "🟡", category: "dinner", time: "15 mins", difficulty: "easy", desc: "Aloo Jeera", servings: 1, ingredients: ["Boiled potatoes", "Jeera", "Turmeric", "Chilli powder"], steps: ["Heat oil + add jeera.", "Add potato cubes.", "Add spices + cook 5–7 mins."] },
    { name: "Palak Paneer", regionEmoji: "🔵", category: "dinner", time: "15 mins", difficulty: "medium", desc: "Palak Paneer (Quick Version)", servings: 1, ingredients: ["Spinach", "Paneer cubes", "Garlic", "Garam masala"], steps: ["Blend boiled spinach.", "Fry garlic + add spinach paste.", "Add paneer + cook 5 mins."] },
    { name: "Cabbage Peas Curry", regionEmoji: "🟣", category: "dinner", time: "15 mins", difficulty: "easy", desc: "Cabbage Peas Curry", servings: 1, ingredients: ["Shredded cabbage", "Green peas", "Turmeric", "Onion"], steps: ["Fry onion.", "Add cabbage + peas.", "Add spices + cook covered."] },
    { name: "Vegetable Khichdi", regionEmoji: "🟠", category: "dinner", time: "15 mins", difficulty: "easy", desc: "Vegetable Khichdi", servings: 1, ingredients: ["Rice", "Moong dal", "Mixed vegetables", "Turmeric"], steps: ["Add rice + dal + veggies.", "Add water + salt.", "Pressure cook 2 whistles."] },
    { name: "Tomato Soup + Toast", regionEmoji: "🔴", category: "dinner", time: "10 mins", difficulty: "easy", desc: "Tomato Soup + Toast", servings: 1, ingredients: ["Tomato", "Garlic", "Pepper", "Salt"], steps: ["Boil tomatoes.", "Blend + add seasoning.", "Serve with toasted bread."] },
    { name: "Capsicum Potato Fry", regionEmoji: "🟤", category: "dinner", time: "15 mins", difficulty: "easy", desc: "Capsicum Potato Fry", servings: 1, ingredients: ["Capsicum", "Potato", "Turmeric", "Chilli powder"], steps: ["Fry potato cubes.", "Add capsicum + spices.", "Cook till soft."] },
    { name: "Paneer Bhurji", regionEmoji: "🟢", category: "dinner", time: "15 mins", difficulty: "medium", desc: "Paneer Bhurji", servings: 1, ingredients: ["Paneer", "Onion", "Tomato", "Garam masala"], steps: ["Fry onion + tomato.", "Add spices.", "Crumble paneer + cook 5 mins."] },
    { name: "Chole (Punjab)", regionEmoji: "🇮🇳", category: "lunch", time: "25 mins", difficulty: "medium", desc: "Classic Punjabi chickpea curry, spicy and flavorful.", servings: 2, ingredients: ["Chickpeas", "Onion", "Tomato", "Chole Masala"], steps: ["Boil soaked chickpeas.", "Make onion-tomato gravy with spices.", "Add chickpeas and simmer."] },
    { name: "Lemon Rice (Tamil Nadu)", regionEmoji: "🇮🇳", category: "lunch", time: "15 mins", difficulty: "easy", desc: "Tangy Indian rice with lemon and peanuts.", servings: 2, ingredients: ["Cooked rice", "Lemon", "Peanuts", "Green chilli", "Turmeric"], steps: ["Fry peanuts, mustard, and chilli.", "Add turmeric.", "Mix with cooked rice and fresh lemon juice."] },
    { name: "Egg Curry (Bengal)", regionEmoji: "🇮🇳", category: "dinner", time: "25 mins", difficulty: "medium", desc: "Authentic, slightly spicy, aromatic Bengali style egg curry.", servings: 2, ingredients: ["Boiled eggs", "Potato", "Onion", "Tomato", "Mustard oil"], steps: ["Fry boiled eggs and potato cubes.", "Cook onion-tomato masala.", "Add water, simmer eggs and potatoes."] },
    { name: "Bisi Bele Bath (Karnataka)", regionEmoji: "🇮🇳", category: "lunch", time: "30 mins", difficulty: "medium", desc: "Spicy, hot lentil rice dish from Karnataka.", servings: 2, ingredients: ["Rice", "Toor Dal", "Mixed Veggies", "Bisi Bele Bath Powder", "Tamarind"], steps: ["Cook rice, dal, and veggies.", "Add tamarind extract and powder.", "Simmer with ghee tadka."] },
    { name: "Aloo Posto (West Bengal)", regionEmoji: "🇮🇳", category: "lunch", time: "20 mins", difficulty: "easy", desc: "Classic Bengali dish of potatoes in poppy seed paste.", servings: 2, ingredients: ["Potatoes", "Poppy seeds", "Green chillies", "Mustard oil", "Panch Phoron"], steps: ["Make poppy seed paste.", "Fry potatoes with panch phoron.", "Add paste and cook with water."] },
    { name: "Dalma (Odisha)", regionEmoji: "🇮🇳", category: "lunch", time: "25 mins", difficulty: "medium", desc: "Wholesome Odia lentil and vegetable dish.", servings: 2, ingredients: ["Toor Dal", "Mixed Veggies", "Roasted Cumin Powder", "Coconut", "Panch Phutana"], steps: ["Boil dal and vegetables together.", "Add roasted spice powder.", "Add ghee and panch phutana tadka."] },

    // Snacks
    { name: "Veg Sandwich", regionEmoji: "🟢", category: "snacks", time: "7 mins", difficulty: "easy", desc: "Veg Sandwich", servings: 1, ingredients: ["Bread slices", "Cucumber", "Tomato", "Butter", "Chaat masala"], steps: ["Spread butter.", "Add sliced veggies.", "Sprinkle chaat masala.", "Close & cut."] },
    { name: "Onion Pakora", regionEmoji: "🟡", category: "snacks", time: "15 mins", difficulty: "easy", desc: "Onion Pakora", servings: 1, ingredients: ["Onion (sliced)", "Besan", "Chilli powder", "Salt"], steps: ["Mix onion + besan + spices.", "Add little water.", "Deep fry till golden."] },
    { name: "Corn Chat", regionEmoji: "🔵", category: "snacks", time: "10 mins", difficulty: "easy", desc: "Corn Chat", servings: 1, ingredients: ["Boiled sweet corn", "Onion", "Lemon", "Chilli powder"], steps: ["Mix corn + onion.", "Add lemon + salt.", "Serve fresh."] },
    { name: "Aloo Tikki", regionEmoji: "🟣", category: "snacks", time: "15 mins", difficulty: "easy", desc: "Aloo Tikki", servings: 1, ingredients: ["Boiled potatoes", "Chilli powder", "Garam masala", "Salt"], steps: ["Mash potatoes + spices.", "Shape into patties.", "Shallow fry both sides."] },
    { name: "Bread Pizza", regionEmoji: "🟠", category: "snacks", time: "10 mins", difficulty: "easy", desc: "Bread Pizza (Tawa Style)", servings: 1, ingredients: ["Bread", "Ketchup", "Onion", "Capsicum", "Cheese"], steps: ["Spread ketchup.", "Add veggies + cheese.", "Cook covered 5 mins."] },
    { name: "Roasted Peanuts Masala", regionEmoji: "🔴", category: "snacks", time: "5 mins", difficulty: "easy", desc: "Roasted Peanuts Masala", servings: 1, ingredients: ["Roasted peanuts", "Onion", "Lemon", "Salt"], steps: ["Mix all ingredients.", "Serve immediately."] },
    { name: "Veg Maggi Upgrade", regionEmoji: "🟤", category: "snacks", time: "7 mins", difficulty: "easy", desc: "Veg Maggi Upgrade", servings: 1, ingredients: ["Maggi", "Onion", "Carrot", "Capsicum"], steps: ["Fry veggies.", "Add water + noodles + masala.", "Cook 2 mins."] },
    { name: "Masala Papad", regionEmoji: "🟢", category: "snacks", time: "5 mins", difficulty: "easy", desc: "Masala Papad", servings: 1, ingredients: ["Roasted papad", "Onion", "Tomato", "Coriander"], steps: ["Roast papad.", "Add chopped veggies on top.", "Sprinkle chaat masala."] }
];

const foodImages = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500&q=80",
    "https://images.unsplash.com/photo-1484723091791-0fee59ca0e2b?w=500&q=80",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&q=80",
    "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=500&q=80"
];

const specificImages = {
    "Chole (Punjab)": "img/chole.png",
    "Bisi Bele Bath (Karnataka)": "img/bisi_bele_bath.png",
    "Aloo Posto (West Bengal)": "img/aloo_posto.png",
    "Dalma (Odisha)": "img/dalma.png",
    "Lemon Rice (Tamil Nadu)": "img/lemon_rice.png",
    "Egg Curry (Bengal)": "img/egg_curry.png"
};

recipes.forEach((r, i) => {
    r.emoji = "";
    if (specificImages[r.name]) {
        r.image = specificImages[r.name];
    } else {
        r.image = foodImages[i % foodImages.length];
    }
});

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        await Recipe.deleteMany({});
        await Recipe.insertMany(recipes);
        console.log(`Successfully populated ${recipes.length} new recipes!`);
    } catch (err) {
        console.error("Error populating recipes:", err);
    }
    process.exit(0);
});
