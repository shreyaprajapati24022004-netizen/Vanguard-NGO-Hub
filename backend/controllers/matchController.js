const Match = require("../models/Match");
const Need = require("../models/Need");
const User = require("../models/User");
const { getGeminiMatch } = require("../services/geminiService");

// ─── AI se match karo ─────────────────────────────────────────────
const matchVolunteers = async (req, res) => {
  try {
    const { needId } = req.body;

    // Need dhundo
    const need = await Need.findById(needId);
    if (!need) {
      return res.status(404).json({ message: "Need nahi mili" });
    }

    // Saare available volunteers lo
    const volunteers = await User.find({
      role: "volunteer",
      isAvailable: true,
    }).select("-password");

    if (volunteers.length === 0) {
      return res.status(404).json({ message: "Koi volunteer available nahi hai" });
    }

    // Gemini AI se best match lo
    const aiResult = await getGeminiMatch(need, volunteers);

    // Match save karo database mein
    const savedMatches = [];
    for (const match of aiResult.matches) {
      const volunteer = volunteers.find(
        (v) => v.name === match.volunteerName
      );
      if (volunteer) {
        const newMatch = await Match.create({
          volunteer: volunteer._id,
          need: needId,
          matchScore: match.score,
          aiReason: match.reason,
          status: "suggested",
        });

        // Real time notification bhejo Socket.io se
        const io = req.app.get("io");
        io.to(volunteer._id.toString()).emit("newMatch", {
          message: `Tumhe ek naye task ke liye suggest kiya gaya hai!`,
          need: need,
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

// ─── Saare matches dekho (Admin) ──────────────────────────────────
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

// ─── Apne matches dekho (Volunteer) ───────────────────────────────
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

// ─── Match accept ya reject karo (Volunteer) ──────────────────────
const updateMatchStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: "Match nahi mila" });
    }

    // Sirf apna match update kar sakta hai volunteer
    if (match.volunteer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Ye tumhara match nahi hai" });
    }

    match.status = status;
    await match.save();

    res.json({ message: `Match ${status} ho gaya!`, match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  matchVolunteers,
  getAllMatches,
  getMyMatches,
  updateMatchStatus,
};