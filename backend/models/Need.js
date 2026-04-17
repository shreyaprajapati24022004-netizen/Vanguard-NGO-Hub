const mongoose = require("mongoose");

const needSchema = new mongoose.Schema({
  area: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["food", "education", "health", "shelter", "clothing", "other"],
    required: true,
  },
  totalReports: {
    type: Number,
    default: 1,
  },
  urgencyScore: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "resolved"],
    default: "open",
  },
}, { timestamps: true });

module.exports = mongoose.model("Need", needSchema);