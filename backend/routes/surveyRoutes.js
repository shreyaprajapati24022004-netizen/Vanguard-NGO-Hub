const express = require("express");
const router = express.Router();
const {
  createSurvey,
  getAllSurveys,
  getMySurveys,
  getAllNeeds,
} = require("../controllers/surveyController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Survey submit — sirf NGO kar sakta hai
router.post("/", protect, authorizeRoles("ngo", "admin"), createSurvey);

// Saari surveys — sirf admin dekh sakta hai
router.get("/all", protect, authorizeRoles("admin"), getAllSurveys);

// Apni surveys — NGO dekh sakta hai
router.get("/mine", protect, getMySurveys);

// Saari needs — sab dekh sakte hain (dashboard)
router.get("/needs", protect, getAllNeeds);

module.exports = router;