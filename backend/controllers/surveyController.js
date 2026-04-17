const Survey = require("../models/Survey");
const Need = require("../models/Need");

// ─── Survey submit karo (NGO karega) ──────────────────────────────
const createSurvey = async (req, res) => {
  try {
    const { area, category, description, urgencyLevel, peopleAffected } = req.body;

    // Survey banao
    const survey = await Survey.create({
      submittedBy: req.user._id,
      area,
      category,
      description,
      urgencyLevel,
      peopleAffected,
    });

    // Need update karo ya banao us area+category ke liye
    const existingNeed = await Need.findOne({ area, category });

    if (existingNeed) {
      existingNeed.totalReports += 1;
      // Urgency score calculate karo
      const urgencyMap = { low: 1, medium: 2, high: 3, critical: 4 };
      existingNeed.urgencyScore += urgencyMap[urgencyLevel] || 1;
      await existingNeed.save();
    } else {
      const urgencyMap = { low: 1, medium: 2, high: 3, critical: 4 };
      await Need.create({
        area,
        category,
        totalReports: 1,
        urgencyScore: urgencyMap[urgencyLevel] || 1,
      });
    }

    res.status(201).json({ message: "Survey submit ho gayi!", survey });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Saari surveys dekho (Admin) ──────────────────────────────────
const getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find()
      .populate("submittedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Apni surveys dekho (NGO) ─────────────────────────────────────
const getMySurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({ submittedBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Saari needs dekho (Dashboard ke liye) ────────────────────────
const getAllNeeds = async (req, res) => {
  try {
    const needs = await Need.find()
      .sort({ urgencyScore: -1 });
    res.json(needs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSurvey, getAllSurveys, getMySurveys, getAllNeeds };