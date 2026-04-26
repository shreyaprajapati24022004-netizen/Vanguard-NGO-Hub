const Match = require("../models/Match");
const Need = require("../models/Need");
const User = require("../models/User");
const { getGeminiMatch } = require("../services/geminiService");

// ─── Match a single need (NGO use) ───────────────────────────────────────────
const matchVolunteers = async (req, res) => {
  try {
    const { needId } = req.body;

    if (!needId) {
      return res.status(400).json({ message: "needId is required" }); // ← added guard
    }

    const need = await Need.findById(needId);
    if (!need) {
      return res.status(404).json({ message: "Need not found" });
    }

    const volunteers = await User.find({
      role: "volunteer",
      isAvailable: true,
    }).select("-password");

    if (volunteers.length === 0) {
      return res.status(404).json({ message: "No volunteers available" });
    }

    const aiResult = await getGeminiMatch(need, volunteers);

    const savedMatches = [];
    for (const match of aiResult.matches) {
      const volunteer = volunteers.find((v) => v.name === match.volunteerName);
      if (volunteer) {
        const newMatch = await Match.create({
          volunteer: volunteer._id,
          need: needId,
          matchScore: match.score,
          aiReason: match.reason,
          status: "suggested",
        });

        const io = req.app.get("io");
        io.to(volunteer._id.toString()).emit("newMatch", {
          message: "You have been suggested for a new task!",
          need,
          reason: match.reason,
        });

        savedMatches.push(newMatch);
      }
    }

    res.json({
      message: "Matching complete!",
      matches: savedMatches,
      aiSummary: aiResult.summary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Trigger matching for ALL active needs (Admin use) ───────────────────────
const triggerAllMatching = async (req, res) => {          // ← NEW FUNCTION
  try {
    // Get every need that is not yet fulfilled
     const needs = await Need.find({ status: { $in: ["open", "in-progress"] } });

    if (needs.length === 0) {
      return res.status(404).json({ message: "No active needs found" });
    }

    // Get all available volunteers
    const volunteers = await User.find({
      role: "volunteer",
      isAvailable: true,
    }).select("-password");

    if (volunteers.length === 0) {
      return res.status(404).json({ message: "No volunteers available" });
    }

    const allMatches = [];

    // Run Gemini matching for each need
    for (const need of needs) {
      try {
        const aiResult = await getGeminiMatch(need, volunteers);

        for (const match of aiResult.matches) {
          const volunteer = volunteers.find((v) => v.name === match.volunteerName);

          if (volunteer) {
            // Avoid duplicate matches for same volunteer+need
            const alreadyExists = await Match.findOne({
              volunteer: volunteer._id,
              need: need._id,
            });

            if (!alreadyExists) {
              const newMatch = await Match.create({
                volunteer: volunteer._id,
                need: need._id,
                matchScore: match.score,
                aiReason: match.reason,
                status: "suggested",
              });

              const io = req.app.get("io");
              io.to(volunteer._id.toString()).emit("newMatch", {
                message: "You have been suggested for a new task!",
                need,
                reason: match.reason,
              });

              allMatches.push(newMatch);
            }
          }
        }
      } catch (needError) {
        // If one need fails, continue with the rest
        console.error(`Matching failed for need ${need._id}:`, needError.message);
      }
    }

    res.json({
      message: `Matching complete! ${allMatches.length} new matches created.`,
      totalNeeds: needs.length,
      totalMatches: allMatches.length,
      matches: allMatches,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get all matches (Admin view) ────────────────────────────────────────────
const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("volunteer", "name email skills location")
      .populate("need", "area category urgencyScore")
      .sort({ createdAt: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get my matches (Volunteer view) ─────────────────────────────────────────
const getMyMatches = async (req, res) => {
  try {
    const matches = await Match.find({ volunteer: req.user._id })
      .populate("need", "area category urgencyScore status")
      .sort({ createdAt: -1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Update match status (Volunteer accepts/rejects) ─────────────────────────
const updateMatchStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match.volunteer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "This is not your match" });
    }

    match.status = status;
    await match.save();

    res.json({ message: `Match ${status} successfully!`, match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  matchVolunteers,
  triggerAllMatching,   // ← exported
  getAllMatches,
  getMyMatches,
  updateMatchStatus,
};