const mongoose = require("mongoose");

const FaceSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  descriptor: {
    type: [Number],
    required: true,
  },
});

module.exports = mongoose.model("Face", FaceSchema);
