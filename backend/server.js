const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/analyze', require('./routes/analyze'));
app.use('/api/contracts', require('./routes/analyze')); // Reusing the same file for convienience as it has GET routes

app.get('/', (req, res) => {
    res.send('ContractScan API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
