import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { Admin } from "../models/admin.models.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import crypto from "crypto";
import { sendVerificationEmail  , sendPassowrdEmail} from "../utils/sendEmails.js"; 

const registerAdmin = asyncHandler(async (req, res) => {
    // 1. Get details from body (including new fields)
    const { organizationName, email, password, salary, gender, age } = req.body;

    // 2. Validation
    if (!organizationName || !email || !password) {
        throw new ApiError(400, "Organization name, email, and password are required");
    }

    const existedAdmin = await Admin.findOne({ email });
    if (existedAdmin) {
        throw new ApiError(409, "Admin already exists");
    }

    // 3. Handle Profile Picture Upload
    const profilePicLocalPath = req.file?.path;
    if (!profilePicLocalPath) {
        throw new ApiError(400, "Profile picture is required");
    }

    const profilePicture = await uploadOnCloudinary(profilePicLocalPath);
    if (!profilePicture) {
        throw new ApiError(400, "Error while uploading profile picture to Cloudinary");
    }

    // 4. Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const admin = await Admin.create({
        organizationName,
        email,
        password,
        salary,
        gender,
        age,
        profilePic: profilePicture.url, // Store the Cloudinary URL
        emailVerificationToken,
        isEmailVerified: false
    });

    // 6. Send verification email
    const options = {
        httpOnly: true,
        secure: true, 
        sameSite: 'None', 
        maxAge: 24 * 60 * 60 * 1000 
    };

    // Return response without sensitive data
    const createdAdmin = await Admin.findById(admin._id).select("-password -emailVerificationToken");

    return res
        .status(201)
        .cookie("emailVerificationToken", emailVerificationToken, options)
        .json(
            new ApiResponse(201, createdAdmin, "Admin registered successfully. Please verify your email.")
        );
});


const registerEmployee = asyncHandler(async (req, res) => {
  // 1. Get details from body
  const { name, email, position, salary, address, phoneNumber, password } =
    req.body;

  // 2. Validation
  if (!name || !email || !password)
    throw new ApiError(400, "Name, Email, and Password are required");
  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw new ApiError(409, "User with this email already exists");
  const profilePicLocalPath = req.file?.path;
  if (!profilePicLocalPath)
    throw new ApiError(400, "Profile picture is required");
  console.log("Received file:", profilePicLocalPath);
  const profilePicture = await uploadOnCloudinary(profilePicLocalPath);
  if (!profilePicture) throw new ApiError(400, "Error while uploading image");

    const generatedPassword = generatePassword(8); // Generate a random password for the employee
    const userName = genrateUsername(name);
  const user = await User.create({
    name,
    email,
    userName,
    password: generatedPassword, 
    position,
    salary,
    address,
    phoneNumber,
    profilePicture: profilePicture.url,
  });
   await sendPassowrdEmail(email, generatedPassword);
  // Send the generated password to the employee's email (simulated)
  await sendPassowrdEmail(email, userName, generatedPassword);

  return res
    .status(201)
    .json(
      new ApiResponse(201, user, "Employee registered successfully by Admin"),
    );
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ApiError(400, "Email and Password are required");

  const admin = await Admin.findOne({ email });
  if (!admin) throw new ApiError(401, "Invalid email or password");

  const isPasswordValid = await admin.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid email or password");

  if (!admin.isEmailVerified) {
    throw new ApiError(403, "Please verify your email before logging in");
}

  const accessToken = admin.generateAccessToken();
  const options = {
    httpOnly: true,
    secure: true, // Required for HTTPS
    sameSite: 'None', // Required for cross-origin (Frontend on Vercel, Backend on Render)
    maxAge: 24 * 60 * 60 * 1000 // 1 day
};
  return res.status(200).cookie("accessToken", accessToken, options).json(
    new ApiResponse(200, { accessToken }, "Admin logged in successfully"),
  );
});


const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const admin = await Admin.findOne({ emailVerificationToken: token });

    if (!admin)
        throw new ApiError(400, "Invalid or expired token");

    admin.isEmailVerified = true;
    admin.emailVerificationToken = undefined;

    await admin.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Email verified successfully")
    );
});

const logoutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true, // Required for HTTPS
        sameSite: 'None', // Required for cross-origin
    });
    return res.status(200).json(new ApiResponse(200, {}, "Admin logged out successfully"));
});

const getAllEmployees = asyncHandler(async (req, res) => {
    const employees = await User.find().select("-password");

    if (!employees || employees.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No employees found"));
    }

    // 2. Return the data
    return res
        .status(200)
        .json(new ApiResponse(200, employees, "Employees fetched successfully"));
});

const getMyProfile = asyncHandler(async (req, res) => {
    // Check if middleware actually populated req.user
    if (!req.user) {
        throw new ApiError(401, "Invalid Admin Session");
    }

    const admin = await Admin.findById(req.user._id).select("-password");

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    return res.status(200).json(
        new ApiResponse(200, admin, "Admin profile fetched successfully")
    );
});


const generatePassword = (length = 8) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  
  // Generate random bytes
  const bytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    // bytes[i] gives us a number between 0-255
    password += charset[bytes[i] % charset.length];
  }

  return password;
};

const removeEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const employee = await User.findById(id);
    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Employee removed successfully")
    );
});

const genrateUsername = (name) => {
    const baseUsername = name.toLowerCase().replace(/\s+/g, '');
    const randomSuffix = crypto.randomBytes(3).toString('hex'); // 6 characters
    return `${baseUsername}${randomSuffix}`;
};
export { registerAdmin, registerEmployee, loginAdmin, verifyEmail, logoutAdmin , getAllEmployees , getMyProfile , removeEmployee};
