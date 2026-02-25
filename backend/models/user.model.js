import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        userName : {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        profilePicture: {
            type: String, // Cloudinary or AWS S3 URL
            required: true,
        },
        position: {
            type: String,
            required: true,
        },
        salary: {
            type: Number,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        presentDays: {
            type: Number,
            default: 0
        },
        attendanceHistory: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            status: {
                type: String,
                enum: ["Present", "Late"],
                default: "Present"
              }
        }
        ],
        absentDays: {
            type: Number,
            default: 0
        },
        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});
// Method to check if password is correct
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
    
};

// Method to generate Access Token
userSchema.methods.generateAccessToken = function(){
    console.log("SECRET USED FOR SIGNING:", process.env.ACCESS_TOKEN_SECRET);
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);