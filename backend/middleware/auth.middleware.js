import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) throw new ApiError(401, "No token provided");

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // First, check if it's an Admin (since admins usually access secured routes)
        let account = await Admin.findById(decodedToken?._id).select("-password");

        // If not an admin, check if it's a regular User
        if (!account) {
            account = await User.findById(decodedToken?._id).select("-password");
        }

        if (!account) {
            throw new ApiError(401, "Invalid Access Token: Account not found");
        }

        req.user = account; // Store the admin/user in req.user
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
