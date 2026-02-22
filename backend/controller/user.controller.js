import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { User } from "../models/user.model.js";
import { TopologyDescriptionChangedEvent } from "mongodb";

// --- User Login ---
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User does not exist");

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

    const accessToken = user.generateAccessToken();

    user.password = undefined;
    // Set cookie for security
    const options = {
    httpOnly: true,
    secure: true, // Required for HTTPS
    sameSite: 'None', // Required for cross-origin (Frontend on Vercel, Backend on Render)
    maxAge: 24 * 60 * 60 * 1000 // 1 day
};

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, { user, accessToken }, "User logged in successfully"));
});

// --- Mark Attendance ---
const markAttendance = asyncHandler(async (req, res) => {
    // In a real app, req.user._id comes from verifyJWT middleware
    const user = await User.findById(req.user?._id);
    
    if (!user) throw new ApiError(404, "User not found");

    user.presentDays += 1;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, { presentDays: user.presentDays }, "Attendance marked!")
    );
});

// --- Change Password ---
const updateUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) throw new ApiError(400, "Invalid old password");

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true, // Required for HTTPS
        sameSite: 'None', // Required for cross-origin
    });
    return res.status(200).json(new ApiResponse(200, {}, "User logged out successfully"));
});  


export { loginUser, markAttendance, updateUserPassword, logoutUser };