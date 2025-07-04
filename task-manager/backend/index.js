const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();

app.use(cors({
    origin: 'https://turbo-winner-74gv96gww67fx95v-3000.app.github.dev',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
}));

app.options('*', cors());
app.use(express.json());

// Correct router mount point
app.use('/api', authRoutes);  // ✅ Fixed

// Test route
app.get('/', (req, res) => res.send('Backend working!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Load models and associations
require('./models');

// Sync tables
db.sync()
    .then(() => console.log('Tables created'))
    .catch(err => console.log('Error: ' + err));
