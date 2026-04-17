const Need = require("../models/Need");

// ─── Saari needs dekho ────────────────────────────────────────────
const getAllNeeds = async (req, res) => {
  try {
    const needs = await Need.find().sort({ urgencyScore: -1 });
    res.json(needs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Ek need dekho ───────────────────────────────────────────────
const getNeedById = async (req, res) => {
  try {
    const need = await Need.findById(req.params.id);
    if (!need) {
      return res.status(404).json({ message: "Need nahi mili" });
    }
    res.json(need);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Need status update karo (Admin) ─────────────────────────────
const updateNeedStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const need = await Need.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!need) {
      return res.status(404).json({ message: "Need nahi mili" });
    }
    res.json({ message: "Status update ho gaya!", need });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Need delete karo (Admin) ─────────────────────────────────────
const deleteNeed = async (req, res) => {
  try {
    const need = await Need.findByIdAndDelete(req.params.id);
    if (!need) {
      return res.status(404).json({ message: "Need nahi mili" });
    }
    res.json({ message: "Need delete ho gayi!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllNeeds, getNeedById, updateNeedStatus, deleteNeed };