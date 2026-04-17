const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  need: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Need",
    required: true,
  },
  matchScore: {
    type: Number,
    default: 0,
  },
  aiReason: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["suggested", "accepted", "rejected", "completed"],
    default: "suggested",
  },
}, { timestamps: true });

module.exports = mongoose.model("Match", matchSchema);