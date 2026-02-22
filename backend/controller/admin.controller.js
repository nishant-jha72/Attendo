import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { Admin } from "../models/admin.models.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/sendEmails.js";

const registerAdmin = asyncHandler(async (req, res) => {
    const { organizationName, email, password } = req.body;

    if (!organizationName || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const existedAdmin = await Admin.findOne({ email });
    if (existedAdmin) {
        throw new ApiError(409, "Admin already exists");
    }

    // 🔐 Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    // 👇 Create admin but not verified yet
    const admin = await Admin.create({
        organizationName,
        email,
        password,
        emailVerificationToken,
        isEmailVerified: false
    });

    // 📧 Send verification email
    await sendVerificationEmail(email, emailVerificationToken);

    return res.status(201).json(
        new ApiResponse(
            201,
            {},
            "Admin registered successfully. Please verify your email."
        )
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

  const user = await User.create({
    name,
    email,
    password, 
    position,
    salary,
    address,
    phoneNumber,
    profilePicture: profilePicture.url,
  });

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

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
    })
    .json(new ApiResponse(200, { accessToken }, "Admin logged in successfully"));
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

export { registerAdmin, registerEmployee, loginAdmin, verifyEmail };
