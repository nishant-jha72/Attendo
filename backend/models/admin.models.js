import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new Schema(
    {
        organizationName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "ADMIN"
        },
        // --- New Fields Added Below ---
        profilePic: {
            type: String, // Stores the Cloudinary URL
            default: "https://via.placeholder.com/150" // Optional default image
        },
        salary: {
            type: Number,
            default: 0
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other", "Prefer not to say"]
        },
        age: {
            type: Number,
            min: [18, "Age must be at least 18"]
        },
        // ------------------------------
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        emailVerificationToken: {
            type: String
        }
    },
    { timestamps: true }
);

// Encrypt password before saving
adminSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Method to check password validity
adminSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
};

// Method to generate Access Token
adminSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        { 
            _id: this._id, 
            role: this.role,
            email: this.email 
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

export const Admin = mongoose.model("Admin", adminSchema);