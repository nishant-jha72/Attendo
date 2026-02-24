const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // We pull the URL from the environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📂 Working on Database: ${conn.connection.name}`);
  } catch (err) {
    console.error("❌ Database Connection Failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;