import { Router } from "express";
import { 
    loginUser, 
    markAttendance, 
    updateUserPassword,
    logoutUser,
    getMyProfile,
    finalizeFaceLogin
} from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();
router.route("/face-login-finalize").post(finalizeFaceLogin); // New route for finalizing face login
router.route("/login").post(loginUser);
router.route("/mark-attendance").post(verifyJWT, markAttendance);
router.route("/change-password").post(verifyJWT, updateUserPassword);
router.route("/logout").post(logoutUser);
router.route("/me").get(verifyJWT, getMyProfile);

export default router;