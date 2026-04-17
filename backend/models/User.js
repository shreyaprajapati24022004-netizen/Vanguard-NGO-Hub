const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
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
    enum: ["admin", "ngo", "volunteer"],
    default: "volunteer",
  },
  // Volunteer ke liye extra fields
  skills: [String],
  location: {
    type: String,
    default: "",
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);