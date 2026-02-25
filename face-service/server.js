require('dotenv').config(); // MUST be the first line
const express = require('express');
const connectDB = require('./config/db');
const faceRoutes = require('./routes/FaceRoutes');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for all routes

// Connect to the DB using the variable in .env
connectDB();

app.use(express.json({ limit: '10mb' }));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Face Service API');
});
app.use('/api/face', faceRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Face Service running on port ${PORT}`));