const User = require("../models/User");

// ─── Saare volunteers dekho (Admin/NGO) ───────────────────────────
const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await User.find({ role: "volunteer" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Apna profile update karo (Volunteer) ─────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { skills, location, isAvailable } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { skills, location, isAvailable },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllVolunteers, updateProfile };