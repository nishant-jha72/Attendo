import { Router } from "express";
import { 
    loginUser, 
    markAttendance, 
    updateUserPassword,
    logoutUser
} from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();
router.route("/login").post(loginUser);
router.route("/mark-attendance").patch(verifyJWT, markAttendance);
router.route("/change-password").post(verifyJWT, updateUserPassword);
router.route("/logout").post(logoutUser);

export default router;