import dotenv from 'dotenv';
import connectDB from './src/db/index.js'; // Import the function to connect to MongoDB
import { app } from './app.js'; // Import the app you configured with all middlewares

dotenv.config();

// Define a root route for health check directly in the main file if you prefer
app.get("/", (req, res) => {
    res.status(200).send("🚀 Attendo API is live and healthy!");
});

const PORT = process.env.PORT || 8000;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(` ✅ MongoDB Connected`);
        console.log(` 🚀 Server running at: http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.log("❌ MongoDB connection failed !!! ", err);
    process.exit(1);
});