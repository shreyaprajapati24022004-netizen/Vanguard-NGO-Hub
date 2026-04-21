const Survey = require("../models/Survey");
const Need = require("../models/Need");

const createSurvey = async (req, res) => {
  try {
    const { area, category, description, urgencyLevel, peopleAffected } = req.body;

    
    const survey = await Survey.create({
      submittedBy: req.user._id,
      area,
      category,
      description,
      urgencyLevel,
      peopleAffected,
    });

    
    const existingNeed = await Need.findOne({ area, category });

    if (existingNeed) {
      existingNeed.totalReports += 1;
      
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

    res.status(201).json({ message: "Survey submitted successfully!", survey });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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


const getMySurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({ submittedBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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