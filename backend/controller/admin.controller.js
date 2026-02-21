import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { Admin } from "../models/admin.models.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";

// --- Register a New Admin ---
const registerAdmin = asyncHandler(async (req, res) => {
    const { organizationName, email, password } = req.body;

    if ([organizationName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedAdmin = await Admin.findOne({ email });
    if (existedAdmin) throw new ApiError(409, "Admin with this email already exists");

    const admin = await Admin.create({ organizationName, email, password });

    return res.status(201).json(
        new ApiResponse(201, admin, "Admin registered successfully")
    );
});

// --- Admin Registers an Employee (User) ---
const registerEmployee = asyncHandler(async (req, res) => {
    // 1. Get details from body
    const { name, email, position, salary, address, phoneNumber, password } = req.body;

    // 2. Validation
    if (!name || !email || !password) throw new ApiError(400, "Name, Email, and Password are required");

    // 3. Handle Profile Picture (Multer + Cloudinary)
    // const profilePicLocalPath = req.file?.path;
    // if (!profilePicLocalPath) throw new ApiError(400, "Profile picture is required");

    // const profilePicture = await uploadOnCloudinary(profilePicLocalPath);
    // if (!profilePicture) throw new ApiError(400, "Error while uploading image");

    // 4. Create User
    const user = await User.create({
        name,
        email,
        password, // Will be hashed by pre-save hook in model
        position,
        salary,
        address,
        phoneNumber
        // profilePicture: profilePicture.url // Uncomment if you want to save the URL in the user document
    });

    return res.status(201).json(
        new ApiResponse(201, user, "Employee registered successfully by Admin")
    );
});

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) throw new ApiError(400, "Email and Password are required");

    const admin = await Admin.findOne({ email });
    if (!admin) throw new ApiError(401, "Invalid email or password");

    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid email or password");

    const accessToken = admin.generateAccessToken();

    return res.status(200).json(
        new ApiResponse(200, { accessToken }, "Admin logged in successfully")
    );
});

export { registerAdmin, registerEmployee , loginAdmin};