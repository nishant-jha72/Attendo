import { Router } from "express";
import { 
    loginAdmin,
    registerAdmin, 
    registerEmployee,
    verifyEmail ,
    logoutAdmin,
    getAllEmployees
    // Note: You should also add a loginAdmin controller
} from "../controller/admin.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// --- Public Routes ---
router.route("/register").post(registerAdmin);

// router.route("/login").post(loginAdmin); 
router.route("/login").post(loginAdmin);
router.route("/logout").post(logoutAdmin);
router.route("/employees").get(verifyJWT, getAllEmployees);
// --- Secured Routes (Require Admin Login) ---
router.route("/add-employee").post(
    verifyJWT, 
    upload.single("profilePicture"), 
    registerEmployee
);
router.route("/verify-email/:token").get(verifyEmail);

export default router;