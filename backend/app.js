import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// --- 1. TEST ROUTE (Move this to the very top to bypass other logic) ---

// --- 2. GLOBAL MIDDLEWARES ---
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*", // Fallback to * for testing
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// --- 3. ROUTE IMPORTS ---
import userRouter from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js';

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);

export { app };