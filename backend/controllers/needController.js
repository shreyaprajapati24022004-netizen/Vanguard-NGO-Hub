const Need = require("../models/Need");


const getAllNeeds = async (req, res) => {
  try {
    const needs = await Need.find().sort({ urgencyScore: -1 });
    res.json(needs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getNeedById = async (req, res) => {
  try {
    const need = await Need.findById(req.params.id);
    if (!need) {
      return res.status(404).json({ message: "Need not found" });
    }
    res.json(need);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateNeedStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const need = await Need.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!need) {
      return res.status(404).json({ message: "Need not found" });
    }
    res.json({ message: "Status updated successfully!", need });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteNeed = async (req, res) => {
  try {
    const need = await Need.findByIdAndDelete(req.params.id);
    if (!need) {
      return res.status(404).json({ message: "Need not found" });
    }
    res.json({ message: "Need deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllNeeds, getNeedById, updateNeedStatus, deleteNeed };