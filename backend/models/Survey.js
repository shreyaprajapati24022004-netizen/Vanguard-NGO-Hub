const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema({
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["food", "education", "health", "shelter", "clothing", "other"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  urgencyLevel: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium",
  },
  peopleAffected: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "active", "resolved"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Survey", surveySchema);