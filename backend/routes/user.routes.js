import { Router } from "express";
import { 
    loginUser, 
    markAttendance, 
    updateUserPassword 
} from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// --- Public Routes ---
router.route("/login").post(loginUser);

// --- Secured Routes (Require User Login) ---
// PATCH is used for attendance as we are partially updating the user record
router.route("/mark-attendance").patch(verifyJWT, markAttendance);

// POST is used for changing password as it involves sensitive data submission
router.route("/change-password").post(verifyJWT, updateUserPassword);

export default router;