require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/budget', require('./routes/budget'));
app.use('/api/auth', require('./routes/auth'));

// Serve pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/recipes', (req, res) => res.sendFile(path.join(__dirname, 'public', 'recipes.html')));
app.get('/budget', (req, res) => res.sendFile(path.join(__dirname, 'public', 'budget.html')));
app.get('/shop', (req, res) => res.sendFile(path.join(__dirname, 'public', 'shop.html')));
app.get('/auth', (req, res) => res.sendFile(path.join(__dirname, 'public', 'auth.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🏠 Bachelor Life Hub is running!`);
    console.log(`🌐 http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api\n`);
});
