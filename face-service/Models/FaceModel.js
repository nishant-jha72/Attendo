const mongoose = require("mongoose");

const FaceSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  descriptor: {
    type: [Number],
    required: true,
  },
} , { timestamps: true });

module.exports = mongoose.model("Face", FaceSchema);
