require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');
const Product = require('./models/Product');

const recipes = [
    // --- BREAKFAST ---
    {
        name: "Aloo Paratha (Punjab)", emoji: "🫓", image: "img/aloo_paratha.png", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "medium", time: "20 min", servings: 2,
        desc: "Classic Punjabi flatbread stuffed with spiced mashed potatoes.",
        ingredients: ["2 cups Whole Wheat Flour", "3 Boiled Potatoes", "1 Green Chili", "1 tsp Cumin", "Ghee"],
        steps: ["Knead flour into soft dough.", "Mash potatoes and mix with chopped chili and cumin.", "Stuff dough balls with potato mix and roll them flat.", "Cook on hot tawa with ghee until golden brown."]
    },
    {
        name: "Panta Bhat (Assam)", emoji: "🍚", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "easy", time: "5 min", servings: 1,
        desc: "Traditional fermented rice breakfast, incredibly cooling and easy to prep.",
        ingredients: ["1 cup Leftover Rice", "2 cups Water", "1 Green Chili", "Salt", "Mustard Oil"],
        steps: ["Soak leftover cooked rice in water overnight.", "In the morning, add a pinch of salt and a splash of mustard oil.", "Serve cold with a side of raw onion and green chili.", "Enjoy a refreshing start to the day."]
    },
    {
        name: "Tomato Poha Upma", emoji: "🍛", image: "img/tomato_poha.png", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "easy", time: "15 min", servings: 2,
        desc: "A tangy twist on classic poha using juicy tomatoes and spices.",
        ingredients: ["2 cups Poha", "2 Tomatoes (chopped)", "1 Onion (chopped)", "1 tsp Mustard seeds", "Turmeric"],
        steps: ["Rinse poha and let it sit.", "Heat oil, add mustard seeds, onions, and cook until soft.", "Add chopped tomatoes, turmeric, and salt. Cook until mushy.", "Mix in poha gently, cover and cook for 2 mins. Serve hot."]
    },
    {
        name: "Ponganalu (Telangana)", emoji: "🍘", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "medium", time: "20 min", servings: 2,
        desc: "Crispy and fluffy snacks made from leftover dosa or idli batter.",
        ingredients: ["2 cups Dosa/Idli Batter", "1 Onion (finely chopped)", "2 Green Chilies", "Coriander", "Oil"],
        steps: ["Mix chopped onions, chilies, and coriander into the batter.", "Heat a ponganalu (appe) pan and drizzle oil in each mold.", "Pour batter into the molds.", "Cook until golden, then flip and cook the other side."]
    },
    {
        name: "Semiya Upma (Kerala)", emoji: "🍜", image: "img/semiya_upma.png", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "easy", time: "15 min", servings: 2,
        desc: "Quick vermicelli upma loaded with veggies and mild spices.",
        ingredients: ["1 cup Roasted Vermicelli", "1 Onion", "1 Carrot (chopped)", "Curry leaves", "1 tsp Mustard seeds"],
        steps: ["Heat oil, add mustard seeds and curry leaves.", "Saute onions and carrots until tender.", "Add 2 cups of water and bring to a boil.", "Add vermicelli, cover, and cook until water is absorbed."]
    },
    {
        name: "Shavige Uppittu (Karnataka)", emoji: "🍲", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "medium", time: "15 min", servings: 2,
        desc: "Flavorful string hopper or vermicelli upma with a coastal touch.",
        ingredients: ["1 cup Shavige (Rice Vermicelli)", "1 tbsp Urad Dal", "1 Lemon", "Green Chilies", "Grated Coconut"],
        steps: ["Cook shavige in boiling water, then drain and cool.", "Temper urad dal, mustard seeds, and chilies in hot oil.", "Add cooked shavige and toss well.", "Garnish with lemon juice and fresh grated coconut."]
    },
    {
        name: "Sabudana Khichdi (Maharashtra)", emoji: "🥘", image: "img/sabudana_khichdi.png", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "medium", time: "20 min", servings: 2,
        desc: "Chewy tapioca pearls tossed with crunchy peanuts and potatoes.",
        ingredients: ["1 cup Sabudana (soaked overnight)", "1 Potato (boiled and cubed)", "1/2 cup Roasted Peanuts (crushed)", "1 tsp Cumin", "Green Chilies"],
        steps: ["Drain sabudana completely and mix with crushed peanuts and salt.", "Heat oil, add cumin and green chilies.", "Add cubed potatoes and sauté for a minute.", "Add sabudana mix, cook until pearls turn translucent. Serve hot."]
    },
    {
        name: "Dosa", emoji: "🥞", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "medium", time: "15 min", servings: 2,
        desc: "Classic thin, crispy crepe made from fermented rice and lentil batter.",
        ingredients: ["2 cups Dosa Batter", "Oil or Ghee", "Potato Masala (optional)", "Chutney"],
        steps: ["Heat a non-stick tawa (griddle).", "Pour a ladle of batter and spread it in a circular motion.", "Drizzle oil/ghee around the edges.", "Cook until the bottom is crispy and golden, fold and serve."]
    },
    {
        name: "Shorshe Dim (Bengal)", emoji: "🥚", image: "img/shorshe_dim.png", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "easy", time: "15 min", servings: 2,
        desc: "Boiled eggs cooked in a pungent mustard paste.",
        ingredients: ["4 Boiled Eggs", "2 tbsp Mustard Paste", "1 tsp Turmeric", "Green Chilies", "Mustard Oil"],
        steps: ["Lightly fry boiled eggs with turmeric in mustard oil.", "In the same pan, add mustard paste, green chilies, and a little water.", "Simmer the eggs in the gravy for 5 minutes.", "Serve hot with rice or flatbread."]
    },
    {
        name: "Upma", emoji: "🥣", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "easy", time: "10 min", servings: 2,
        desc: "Comforting semolina porridge with savory aromatics.",
        ingredients: ["1 cup Rava (Semolina)", "1 Onion", "1 tsp Mustard seeds", "Curry leaves", "Water"],
        steps: ["Dry roast rava until fragrant and set aside.", "Heat oil, pop mustard seeds, and sauté onions with curry leaves.", "Add 2.5 cups of water and bring to a boil.", "Gradually mix in rava to avoid lumps, cover and cook for 3 mins."]
    },
    {
        name: "Idli with Chutney (Tamil Nadu)", emoji: "🍙", image: "img/idli_chutney.png", regionEmoji: "🇮🇳", category: "breakfast", difficulty: "easy", time: "20 min", servings: 2,
        desc: "Soft, fluffy steamed rice cakes served with fresh coconut chutney.",
        ingredients: ["2 cups Idli Batter", "1/2 cup Grated Coconut", "2 Green Chilies", "1 tsp Mustard Seeds", "Curry leaves"],
        steps: ["Pour idli batter into greased idli plates.", "Steam for 10-12 minutes until a toothpick comes out clean.", "Blend coconut, chilies, and salt for chutney.", "Temper chutney with mustard seeds and curry leaves. Serve with hot idlis."]
    },

    // --- LUNCH ---
    {
        name: "Tomato Rice (Andhra Pradesh)", emoji: "🍅", regionEmoji: "🇮🇳", category: "lunch", difficulty: "easy", time: "20 min", servings: 2,
        desc: "Spicy and tangy one-pot rice dish packed with robust tomato flavor.",
        ingredients: ["2 cups Cooked Rice", "3 Tomatoes (pureed)", "1 Onion (chopped)", "1 tsp Garam Masala", "Curry leaves"],
        steps: ["Heat oil, add cumin, curry leaves, and onions. Sauté until golden.", "Add tomato puree, salt, and garam masala. Cook until oil separates.", "Add the cooked rice and mix thoroughly.", "Serve hot with papad or raita."]
    },
    {
        name: "Sev Tameta (Gujarat)", emoji: "🍛", regionEmoji: "🇮🇳", category: "lunch", difficulty: "easy", time: "15 min", servings: 2,
        desc: "Sweet, spicy, and tangy tomato curry topped with crispy besan sev.",
        ingredients: ["3 Tomatoes (chopped)", "1 cup Thick Sev", "1 tsp Cumin", "1 tbsp Jaggery", "1/2 tsp Turmeric", "Chili powder"],
        steps: ["Heat oil, add cumin and chopped tomatoes.", "Cook until tomatoes are soft, adding turmeric, chili powder, and jaggery.", "Add half a cup of water to make a gravy.", "Top with crispy sev right before serving. Enjoy with chapati."]
    },
    {
        name: "Sambar Rice (Quick) (Tamil Nadu)", emoji: "🍲", regionEmoji: "🇮🇳", category: "lunch", difficulty: "medium", time: "25 min", servings: 2,
        desc: "One-pot comfort meal mixing rice, lentils, and veggies in sambar powder.",
        ingredients: ["1 cup Rice", "1/2 cup Toor Dal", "1 cup Mixed Veggies", "2 tbsp Sambar Powder", "Tamarind Extract"],
        steps: ["Wash rice and dal together.", "In a pressure cooker, sauté veg, add sambar powder, tamarind, and the rice/dal mix.", "Add 4 cups water and pressure cook for 3-4 whistles.", "Mash slightly, temper with mustard and curry leaves, and serve."]
    },
    {
        name: "Aloo Chokha + Rice (Bihar)", emoji: "🥔", regionEmoji: "🇮🇳", category: "lunch", difficulty: "easy", time: "15 min", servings: 2,
        desc: "Rustic mashed potatoes with mustard oil and raw onions, paired with rice.",
        ingredients: ["3 Boiled Potatoes", "1 Onion (finely chopped)", "2 Green Chilies", "Mustard Oil", "2 cups Cooked Rice"],
        steps: ["Mash the boiled potatoes in a bowl.", "Mix in raw chopped onions, green chilies, salt, and a generous drizzle of raw mustard oil.", "Mix well and serve alongside steamed white rice.", "Simple, filling bachelor lunch!"]
    },
    {
        name: "Curd Rice with Pickle (Kerala)", emoji: "🍚", regionEmoji: "🇮🇳", category: "lunch", difficulty: "easy", time: "10 min", servings: 2,
        desc: "Cooling yogurt rice tempered with spices, served with tangy pickle.",
        ingredients: ["2 cups Cooked Rice", "1 cup Curd (Yogurt)", "1 tsp Mustard seeds", "Curry leaves", "Mango Pickle"],
        steps: ["Mash the cooked rice slightly and mix well with curd and salt.", "In a pan, heat a little oil, pop mustard seeds, and sizzle curry leaves.", "Pour the tempering over the curd rice.", "Serve cold with a scoop of spicy pickle."]
    },
    {
        name: "Aloo Bhate (West Bengal)", emoji: "🥔", regionEmoji: "🇮🇳", category: "lunch", difficulty: "easy", time: "15 min", servings: 2,
        desc: "Comforting mashed potatoes prepared with ghee or mustard oil.",
        ingredients: ["3 Boiled Potatoes", "Mustard Oil or Ghee", "Dry Red Chilies", "1 Onion (chopped)", "Salt"],
        steps: ["Roast dry red chilies in a pan or open flame.", "Mash the boiled potatoes.", "Crush the roasted chilies into the potatoes along with raw onions and salt.", "Pour mustard oil over it, mix well, and serve with hot rice."]
    },
    {
        name: "Papad Ki Sabzi (Rajasthan)", emoji: "🥙", regionEmoji: "🇮🇳", category: "lunch", difficulty: "easy", time: "15 min", servings: 2,
        desc: "A quick curry made using roasted papads in an aromatic yogurt gravy.",
        ingredients: ["4 Urad Dal Papads", "1 cup Whisked Yogurt", "1/2 tsp Turmeric", "1 tsp Chili Powder", "Cumin seeds"],
        steps: ["Roast or fry the papads and break them into rough pieces.", "Mix turmeric, chili powder, and salt into the yogurt.", "Heat oil, add cumin, then pour in the yogurt mixture (stir continuously).", "Once boiling, add the crushed papads. Serve immediately with roti."]
    },
    {
        name: "Puliyogare (Karnataka)", emoji: "🍛", regionEmoji: "🇮🇳", category: "lunch", difficulty: "medium", time: "20 min", servings: 2,
        desc: "Tangy and spicy tamarind rice infused with peanuts and southern spices.",
        ingredients: ["2 cups Cooked Rice", "3 tbsp Puliyogare Paste/Powder", "1/4 cup Peanuts", "Curry leaves", "Sesame Oil"],
        steps: ["Spread cooked rice on a plate to cool.", "Heat sesame oil, roast peanuts, and temper curry leaves.", "Add puliyogare paste and mix well for a minute.", "Pour over rice and mix evenly. Let it sit for 10 mins before eating."]
    },
    {
        name: "Jeera Rice + Boiled Egg (Punjab)", emoji: "🍚", regionEmoji: "🇮🇳", category: "lunch", difficulty: "easy", time: "20 min", servings: 2,
        desc: "Fragrant cumin-tempered rice served with simple boiled eggs.",
        ingredients: ["1 cup Basmati Rice", "2 tsp Cumin seeds", "1 tbsp Ghee", "4 Eggs", "Salt"],
        steps: ["Boil the eggs for 8-10 mins, cool, and peel.", "Cook basmati rice until fluffy.", "Heat ghee in a pan, add cumin seeds, and let them crackle.", "Add cooked rice and toss gently. Serve with boiled eggs on the side."]
    },
    {
        name: "Besara (Odisha)", emoji: "🥘", regionEmoji: "🇮🇳", category: "lunch", difficulty: "medium", time: "25 min", servings: 3,
        desc: "Mixed vegetables cooked in a pungent mustard and garlic paste.",
        ingredients: ["2 cups Mixed Veggies (Pumpkin, Potato, Banana)", "2 tbsp Mustard seeds", "4 Garlic cloves", "1/2 tsp Turmeric", "Panch Phoron (5 spice blend)"],
        steps: ["Grind mustard seeds and garlic into a smooth paste.", "Sauté veggies briefly, add the mustard paste, turmeric, salt, and water.", "Cook until veggies are tender.", "Temper with panch phoron in mustard oil and pour over the curry."]
    },
    {
        name: "Aloo Gobi", emoji: "🥦", regionEmoji: "🇮🇳", category: "lunch", difficulty: "medium", time: "25 min", servings: 2,
        desc: "Classic dry dish made with potatoes, cauliflower, and Indian spices.",
        ingredients: ["1 Potato (cubed)", "1 cup Cauliflower florets", "1 Onion", "1 Tomato", "Cumin", "Turmeric"],
        steps: ["Heat oil and pan-fry potato and cauliflower florets until slightly browned. Remove.", "In the same pan, add cumin and chopped onions.", "Add tomatoes and spices, cook until mushy.", "Add the fried veggies back, cover and cook until tender. Serve with roti."]
    },
    {
        name: "Bhindi Fry", emoji: "🥒", regionEmoji: "🇮🇳", category: "lunch", difficulty: "easy", time: "20 min", servings: 2,
        desc: "Crispy fried okra tossed with a simple spice mix.",
        ingredients: ["250g Bhindi (Okra) chopped", "1 tsp Cumin", "1 tsp Amchur (Dry Mango powder)", "1 tsp Chili powder", "Oil"],
        steps: ["Wash and completely dry the bhindi before chopping.", "Heat oil in a pan, add cumin.", "Add bhindi and fry open (do not cover) until crispy and non-sticky.", "Mix in salt, chili powder, and amchur right at the end."]
    },
    {
        name: "Cabbage Stir Fry", emoji: "🥬", regionEmoji: "🇮🇳", category: "lunch", difficulty: "easy", time: "15 min", servings: 2,
        desc: "Quick shredded cabbage sautéed with mustard seeds and fresh coconut.",
        ingredients: ["2 cups Shredded Cabbage", "1 tsp Mustard seeds", "1 tsp Urad Dal", "2 Green Chilies", "Grated coconut"],
        steps: ["Heat oil, add mustard seeds, urad dal, and chilies.", "Add shredded cabbage and salt.", "Stir fry on medium-high heat for 5-7 minutes until tender but crunchy.", "Garnish generously with fresh grated coconut."]
    },
    {
        name: "Beans Poriyal", emoji: "🫛", regionEmoji: "🇮🇳", category: "lunch", difficulty: "easy", time: "15 min", servings: 2,
        desc: "South Indian style green beans stir-fried with coconut.",
        ingredients: ["250g Green Beans (chopped)", "1 tsp Mustard seeds", "1 Dry Red Chili", "Curry leaves", "2 tbsp Grated Coconut"],
        steps: ["Boil or steam the green beans until tender.", "Heat oil, crackle mustard seeds, red chili, and curry leaves.", "Add the cooked beans and toss.", "Turn off heat and mix in the grated coconut."]
    },
    {
        name: "Capsicum Masala", emoji: "🫑", regionEmoji: "🇮🇳", category: "lunch", difficulty: "medium", time: "20 min", servings: 2,
        desc: "A rich peanut and sesame-based gravy enveloping fresh bell peppers.",
        ingredients: ["2 Capsicum (cubed)", "2 tbsp Peanuts", "1 tbsp Sesame seeds", "1 Onion", "1 Tomato"],
        steps: ["Dry roast peanuts and sesame seeds, then powder them.", "Sauté capsicum cubes for 2-3 mins and remove.", "Sauté onion, tomato, add the peanut-sesame powder and water to form a gravy.", "Add capsicum back into the gravy and simmer for 5 mins."]
    },
    {
        name: "Tomato Curry (Simple)", emoji: "🍅", regionEmoji: "🇮🇳", category: "lunch", difficulty: "easy", time: "15 min", servings: 3,
        desc: "Everyday staple curry made simply with tomatoes, onions, and basic spices.",
        ingredients: ["4 Tomatoes (chopped)", "1 Onion (sliced)", "1 tsp Garam Masala", "1 tsp Mustard seeds", "Oil"],
        steps: ["Heat oil, add mustard seeds until they pop.", "Sauté onions until translucent.", "Add all the chopped tomatoes, salt, and spices.", "Cover and cook until everything turns into a thick mushy gravy. Serve with rice."]
    },
    {
        name: "Mixed Veg Fry", emoji: "🥗", regionEmoji: "🇮🇳", category: "lunch", difficulty: "easy", time: "20 min", servings: 2,
        desc: "A healthy dry toss of leftover vegetables in the fridge.",
        ingredients: ["2 cups Mixed Veggies (Carrot, Beans, Peas, Potato)", "1 tsp Cumin", "1/2 tsp Turmeric", "1 tsp Coriander powder"],
        steps: ["Chop all veggies into similar sizes.", "Heat oil in a pan, add cumin.", "Add veggies, turmeric, and salt. Cover and let them steam cook in their own moisture.", "Remove lid, add coriander powder, and fry for 2 mins to crisp up."]
    },
    {
        name: "Palak Dal", emoji: "🍲", regionEmoji: "🇮🇳", category: "lunch", difficulty: "medium", time: "25 min", servings: 3,
        desc: "Nutritious dal cooked with fresh spinach.",
        ingredients: ["1/2 cup Toor Dal", "2 cups Spinach (chopped)", "1 Tomato", "Cumin", "Garlic"],
        steps: ["Pressure cook dal, spinach, and tomato with turmeric for 3 whistles.", "Whisk the cooked dal to a smooth consistency.", "Heat ghee, fry cumin and crushed garlic until golden.", "Pour the garlic-cumin tadka into the dal. Serve hot."]
    },
    {
        name: "Lauki Sabzi", emoji: "🥒", regionEmoji: "🇮🇳", category: "lunch", difficulty: "easy", time: "20 min", servings: 2,
        desc: "Light and digestive bottle gourd curry.",
        ingredients: ["1 Bottle Gourd (Lauki) cubed", "1 Tomato (chopped)", "1 tsp Cumin", "1/2 tsp Turmeric", "Coriander"],
        steps: ["Heat oil, add cumin.", "Add tomato and sauté until soft.", "Add cubed lauki, turmeric, and salt. Cover and cook on low heat.", "Wait until lauki releases its water and cooks through. Garnish with coriander."]
    },
    {
        name: "Carrot Beans Masala", emoji: "🥕", regionEmoji: "🇮🇳", category: "lunch", difficulty: "easy", time: "20 min", servings: 2,
        desc: "A semi-dry curry of sweet carrots and beans in a tomato-onion base.",
        ingredients: ["1 cup Carrots (chopped)", "1 cup Green Beans (chopped)", "1 Onion", "1 Tomato", "Garam Masala"],
        steps: ["Boil carrots and beans until soft.", "In a pan, sauté onions and tomatoes with spices.", "Mix the boiled vegetables into the masala base.", "Cook together for 5 mins to blend the flavors."]
    },
    {
        name: "Chole (Punjab)", emoji: "🥘", image: "img/chole.png", regionEmoji: "🇮🇳", category: "lunch", difficulty: "medium", time: "30 min", servings: 2,
        desc: "Hearty and spicy chickpea curry, a North Indian favorite.",
        ingredients: ["1 cup Boiled Chole (Chickpeas)", "1 Onion", "2 Tomatoes", "1 tbsp Chole Masala", "Ginger Garlic paste"],
        steps: ["Sauté onions and ginger-garlic paste until brown.", "Add chopped tomatoes and chole masala. Cook until oil separates.", "Add the boiled chole along with its water.", "Simmer for 10-15 mins. Garnish with cilantro."]
    },
    {
        name: "Lemon Rice (Tamil Nadu)", emoji: "🍋", image: "img/lemon_rice.png", regionEmoji: "🇮🇳", category: "lunch", difficulty: "easy", time: "15 min", servings: 2,
        desc: "Zesty, vibrant yellow rice tempered with mustard, peanuts, and lemon.",
        ingredients: ["2 cups Cooked Rice", "1 Lemon", "Peanuts", "1 tsp Mustard seeds", "Turmeric"],
        steps: ["Heat oil, fry peanuts, pop mustard seeds, and add turmeric.", "Turn off heat and squeeze in lemon juice.", "Pour this tempering over the cooked rice.", "Mix well until rice is evenly yellow. Serve with papad."]
    },
    {
        name: "Bisi Bele Bath (Karnataka)", emoji: "🍚", image: "img/bisi_bele_bath.png", regionEmoji: "🇮🇳", category: "lunch", difficulty: "medium", time: "30 min", servings: 2,
        desc: "A hot lentil rice dish brewed with aromatic spices and mixed veggies.",
        ingredients: ["1 cup Cooked Rice", "1/2 cup Cooked Toor Dal", "1 cup Veggies (Carrot, Beans)", "2 tbsp Bisi Bele Bath Masala", "Tamarind Extract", "Ghee"],
        steps: ["Boil veggies with tamarind extract and the masala powder.", "Once veggies are soft, add cooked rice and dal.", "Simmer everything together until it thickens.", "Temper with spices in ghee and pour over the dish."]
    },
    {
        name: "Aloo Posto (West Bengal)", emoji: "🥔", image: "img/aloo_posto.png", regionEmoji: "🇮🇳", category: "lunch", difficulty: "medium", time: "25 min", servings: 2,
        desc: "Classic Bengali mildly-spiced potato preparation in poppy seed paste.",
        ingredients: ["2 Potatoes (cubed)", "3 tbsp Poppy Seeds (Posto) paste", "2 Green Chilies", "Mustard Oil", "Panch Phoron (optional)"],
        steps: ["Fry cubed potatoes in mustard oil lightly.", "Add water and cook until potatoes are half-done.", "Add the thick poppy seed paste and green chilies.", "Cook until the paste coats the potatoes and raw smell leaves."]
    },
    {
        name: "Dalma (Odisha)", emoji: "🍲", image: "img/dalma.png", regionEmoji: "🇮🇳", category: "lunch", difficulty: "medium", time: "30 min", servings: 3,
        desc: "Lentils slowly cooked with assorted vegetables and roasted cumin dust.",
        ingredients: ["1/2 cup Toor Dal", "2 cups Mixed Veg (Papaya, Pumpkin, Banana, Beans)", "1 tsp Roasted Cumin-Chili Powder", "Ghee", "Panch Phoron"],
        steps: ["Boil dal and vegetables together with turmeric and salt in a cooker.", "In a pan, heat ghee and add panch phoron and dry chilies.", "Pour the tadka into the boiled dal-veg mix.", "Sprinkle heavily with roasted cumin-chili powder before serving."]
    },

    // --- DINNER ---
    {
        name: "Veg Pulao", emoji: "🍛", regionEmoji: "🇮🇳", category: "dinner", difficulty: "medium", time: "30 min", servings: 2,
        desc: "A one-pot rice meal layered with veggies and whole spices.",
        ingredients: ["1 cup Basmati Rice", "1.5 cups Mixed Veggies", "Whole Spices (Cloves, Cinnamon, Cardamom)", "1 Sliced Onion", "Ghee"],
        steps: ["Sauté whole spices and onion in ghee until fragrant.", "Add mixed veggies and sauté for 2 minutes.", "Add washed rice and 2 cups of water.", "Cover and cook until rice is tender and water is absorbed."]
    },
    {
        name: "Aloo Jeera", emoji: "🥔", regionEmoji: "🇮🇳", category: "dinner", difficulty: "easy", time: "15 min", servings: 2,
        desc: "Quick, flavor-packed cumin potatoes, an ultimate comfort side.",
        ingredients: ["3 Boiled Potatoes (cubed)", "2 tsp Cumin seeds", "1/2 tsp Turmeric", "1 tsp Amchur", "Coriander"],
        steps: ["Heat oil or ghee, add a generous amount of cumin seeds.", "Add the cubed boiled potatoes, turmeric, and salt.", "Fry well until potatoes get a slight crust.", "Finish with amchur powder and chopped coriander."]
    },
    {
        name: "Palak Paneer", emoji: "🍲", regionEmoji: "🇮🇳", category: "dinner", difficulty: "medium", time: "30 min", servings: 2,
        desc: "Soft paneer cubes simmered in a smooth, vibrant spinach gravy.",
        ingredients: ["200g Paneer", "1 bunch Spinach (blanched & pureed)", "1 Onion", "1 Tomato", "Garam Masala", "Cream"],
        steps: ["Sauté chopped onions and tomatoes with spices.", "Add pureed spinach and cook for 5 minutes.", "Add paneer cubes to the gravy.", "Finish with a swirl of fresh cream and serve hot with naan."]
    },
    {
        name: "Cabbage Peas Curry", emoji: "🥗", regionEmoji: "🇮🇳", category: "dinner", difficulty: "easy", time: "20 min", servings: 2,
        desc: "A mildly sweet, dry homestyle preparation of cabbage and green peas.",
        ingredients: ["2 cups Shredded Cabbage", "1/2 cup Green Peas", "1 Tomato", "1 tsp Cumin", "Turmeric"],
        steps: ["Heat oil, add cumin and chopped tomato. Cook briefly.", "Add shredded cabbage, peas, turmeric, and salt.", "Cover and cook on low heat in its own moisture.", "Serve once tender with hot chapatis."]
    },
    {
        name: "Vegetable Khichdi", emoji: "🥣", regionEmoji: "🇮🇳", category: "dinner", difficulty: "easy", time: "25 min", servings: 2,
        desc: "The ultimate wholesome comfort food of softly cooked rice and lentils.",
        ingredients: ["1/2 cup Rice", "1/2 cup Moong Dal", "1 cup Mixed Veggies", "1 tsp Turmeric", "Ghee"],
        steps: ["Wash rice and dal together.", "Sauté veggies briefly in a pressure cooker.", "Add rice, dal, turmeric, salt, and 3.5 cups of water.", "Pressure cook for 4 whistles until mushy. Serve with ghee on top."]
    },
    {
        name: "Tomato Soup + Toast", emoji: "🍅", regionEmoji: "🍅", category: "dinner", difficulty: "easy", time: "20 min", servings: 2,
        desc: "A light Western-style dinner. Tangy, rich tomato soup.",
        ingredients: ["4 Ripe Tomatoes", "1 Garlic clove", "1 tsp Butter", "Black Pepper", "Bread slices"],
        steps: ["Boil tomatoes, peel the skin, and blend into a puree.", "Heat butter, sauté garlic, pour the puree, and simmer.", "Add salt, pepper, and a pinch of sugar.", "Serve hot with crispy buttered toast."]
    },
    {
        name: "Capsicum Potato Fry", emoji: "🫑", regionEmoji: "🇮🇳", category: "dinner", difficulty: "easy", time: "20 min", servings: 2,
        desc: "A satisfying dry pan fry of bell peppers and tender potato cubes.",
        ingredients: ["2 Potatoes (sliced)", "2 Capsicum (sliced)", "1 tsp Cumin", "Chili Powder", "Amchur"],
        steps: ["Sauté potato slices in a pan until almost cooked.", "Add capsicum slices and continue to stir-fry.", "Add spices, cook for another 5 minutes until crispy.", "Serve with dal and rice."]
    },
    {
        name: "Paneer Bhurji", emoji: "🧀", regionEmoji: "🇮🇳", category: "dinner", difficulty: "easy", time: "15 min", servings: 2,
        desc: "Spiced scrambled paneer, perfect to scoop up with parathas.",
        ingredients: ["200g Paneer (crumbled)", "1 Onion (chopped)", "1 Tomato", "Green chilies", "Pav Bhaji Masala (optional)"],
        steps: ["Sauté onions and green chilies until translucent.", "Add tomatoes and spices, cook until mushy.", "Stir in crumbled paneer and mix well.", "Cook for 2 minutes and garnish with coriander."]
    },
    {
        name: "Egg Curry (Bengal)", emoji: "🥚", image: "img/egg_curry.png", regionEmoji: "🇮🇳", category: "dinner", difficulty: "medium", time: "25 min", servings: 2,
        desc: "Hearty and mildly spiced Bengali style egg and potato curry.",
        ingredients: ["4 Hard-boiled Eggs", "2 Potatoes (halved)", "1 Onion paste", "1 Tomato puree", "Garam Masala"],
        steps: ["Fry the eggs and potato halves in mustard oil until golden. Remove.", "Sauté the onion paste, tomato puree, and spices in the same oil.", "Add water to make gravy and slide the fried potatoes in to boil.", "Lastly, add the eggs, simmer, and finish with garam masala."]
    },

    // --- SNACKS ---
    {
        name: "Veg Sandwich", emoji: "🥪", regionEmoji: "🥪", category: "snacks", difficulty: "easy", time: "10 min", servings: 1,
        desc: "A timeless raw veggie sandwich with mint chutney.",
        ingredients: ["2 Bread slices", "Cucumber slices", "Tomato slices", "Mint Chutney", "Butter"],
        steps: ["Apply butter to both slices of bread.", "Spread mint chutney evenly over one slice.", "Layer with cucumber, tomato, onion and sprinkle chaat masala.", "Close sandwich, grill, or eat raw!"]
    },
    {
        name: "Onion Pakora", emoji: "🧅", regionEmoji: "🇮🇳", category: "snacks", difficulty: "medium", time: "20 min", servings: 2,
        desc: "Crispy, deep-fried onion fritters for a rainy evening.",
        ingredients: ["2 Onions (thinly sliced)", "1 cup Besan (Gram flour)", "Green chilies", "Ajwain (Carom seeds)", "Oil for frying"],
        steps: ["Mix sliced onions tightly with salt and squeeze out their moisture.", "Add besan, chilies, ajwain and a splash of water to make a thick batter coating.", "Drop small portions into hot oil.", "Deep fry until golden brown and crispy."]
    },
    {
        name: "Corn Chat", emoji: "🌽", regionEmoji: "🌽", category: "snacks", difficulty: "easy", time: "10 min", servings: 1,
        desc: "Spicy, buttery steamed sweet corn loaded with lemon and chaat masala.",
        ingredients: ["1 cup Sweet Corn kernels (boiled)", "1 tbsp Butter", "1/2 Onion (chopped)", "Chaat Masala", "Lemon juice"],
        steps: ["Mix boiled hot corn generously with butter.", "Toss in the finely chopped raw onions and tomatoes.", "Sprinkle chaat masala, chili powder, and lemon juice.", "Mix well and serve hot!"]
    },
    {
        name: "Aloo Tikki", emoji: "🥔", regionEmoji: "🇮🇳", category: "snacks", difficulty: "medium", time: "30 min", servings: 2,
        desc: "Golden pan-fried mashed potato patties.",
        ingredients: ["3 Boiled Potatoes (mashed)", "2 tbsp Cornflour", "Chaat Masala", "Green chilies", "Oil for shallow frying"],
        steps: ["Mix mashed potatoes with cornflour, chilies, and chaat masala.", "Shape into medium-sized round patties.", "Heat oil in a shallow pan.", "Fry the patties until a dark golden crust forms on both sides."]
    },
    {
        name: "Bread Pizza", emoji: "🍕", regionEmoji: "🍕", category: "snacks", difficulty: "easy", time: "10 min", servings: 1,
        desc: "Quick pizza cravings fixed using a bread slice base.",
        ingredients: ["2 Bread slices", "Pizza Sauce", "Grated Cheese", "Chopped Capsicum/Onion", "Oregano"],
        steps: ["Toast one side of the bread slightly in a pan.", "Spread pizza sauce on the toasted side.", "Top with veggies, generous cheese, and oregano.", "Cover and cook on low heat until cheese fully melts."]
    },
    {
        name: "Roasted Peanuts Masala", emoji: "🥜", regionEmoji: "🥜", category: "snacks", difficulty: "easy", time: "5 min", servings: 2,
        desc: "Bar-style chakna. Crunchy, salty, tangy roasted peanuts.",
        ingredients: ["1 cup Roasted Peanuts", "1/2 Onion (chopped)", "1/2 Tomato (chopped)", "Chaat Masala", "Lemon"],
        steps: ["Take crunchy roasted peanuts in a bowl.", "Mix quickly with chopped onions, tomatoes, and coriander.", "Add chaat masala and a good squeeze of lemon.", "Serve immediately to retain the crunch."]
    },
    {
        name: "Veg Maggi Upgrade", emoji: "🍜", regionEmoji: "🍜", category: "snacks", difficulty: "easy", time: "10 min", servings: 1,
        desc: "Instant noodles elevated with fresh veggies and cheese.",
        ingredients: ["1 block Maggi Noodles", "Mixed Veggies (Peas, Carrots)", "1 slice Cheese", "Maggi Tastemaker"],
        steps: ["Boil water and add the chopped veggies until soft.", "Add noodles and tastemaker.", "Cook until the water is almost absorbed.", "Place the cheese slice on top, cover for a min until melted. Mix and eat."]
    },
    {
        name: "Masala Papad", emoji: "🍘", regionEmoji: "🇮🇳", category: "snacks", difficulty: "easy", time: "5 min", servings: 1,
        desc: "Crispy roasted papad topped with a fresh zesty salad.",
        ingredients: ["1 Papad (Urad or Moong)", "1/2 Onion (chopped)", "1/2 Tomato (chopped)", "Coriander", "Chaat Masala"],
        steps: ["Roast the papad on a flame or cook in microwave until crisp.", "Scatter chopped onions and tomatoes evenly on top.", "Sprinkle heavily with chaat masala and red chili powder.", "Garnish with fresh coriander and serve at once."]
    }
];

const products = [
    { name: "Tomatoes", emoji: "🍅", price: 30, weight: "500g", category: "vegetables" },
    { name: "Onions", emoji: "🧅", price: 25, weight: "1 kg", category: "vegetables" },
    { name: "Potatoes", emoji: "🥔", price: 30, weight: "1 kg", category: "vegetables" },
    { name: "Green Chilies", emoji: "🌶️", price: 15, weight: "100g", category: "vegetables" },
    { name: "Capsicum", emoji: "🫑", price: 40, weight: "250g", category: "vegetables" },
    { name: "Carrots", emoji: "🥕", price: 35, weight: "500g", category: "vegetables" },
    { name: "Cauliflower", emoji: "🥦", price: 30, weight: "1 pc", category: "vegetables" },
    { name: "Spinach", emoji: "🥬", price: 20, weight: "1 bunch", category: "vegetables" },
    { name: "Bananas", emoji: "🍌", price: 40, weight: "6 pcs", category: "fruits" },
    { name: "Apples", emoji: "🍎", price: 120, weight: "500g", category: "fruits" },
    { name: "Oranges", emoji: "🍊", price: 60, weight: "500g", category: "fruits" },
    { name: "Lemons", emoji: "🍋", price: 20, weight: "4 pcs", category: "fruits" },
    { name: "Milk", emoji: "🥛", price: 28, weight: "500ml", category: "dairy" },
    { name: "Curd / Yogurt", emoji: "🫙", price: 35, weight: "400g", category: "dairy" },
    { name: "Paneer", emoji: "🧀", price: 80, weight: "200g", category: "dairy" },
    { name: "Eggs", emoji: "🥚", price: 72, weight: "12 pcs", category: "dairy" },
    { name: "Basmati Rice", emoji: "🍚", price: 90, weight: "1 kg", category: "staples" },
    { name: "Wheat Flour", emoji: "🌾", price: 45, weight: "1 kg", category: "staples" },
    { name: "Toor Dal", emoji: "🫘", price: 120, weight: "1 kg", category: "staples" },
    { name: "Cooking Oil", emoji: "🫗", price: 140, weight: "1 L", category: "staples" },
    { name: "Sugar", emoji: "🧂", price: 42, weight: "1 kg", category: "staples" },
    { name: "Salt", emoji: "🧂", price: 20, weight: "1 kg", category: "staples" },
    { name: "Tea Powder", emoji: "🍵", price: 110, weight: "250g", category: "staples" },
    { name: "Bread", emoji: "🍞", price: 35, weight: "400g", category: "staples" },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Recipe.deleteMany({});
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing recipes and products');

        // Insert data
        await Recipe.insertMany(recipes);
        console.log(`🍳 Inserted ${recipes.length} recipes`);

        await Product.insertMany(products);
        console.log(`🛒 Inserted ${products.length} products`);

        console.log('\n✅ Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    }
}

seed();
