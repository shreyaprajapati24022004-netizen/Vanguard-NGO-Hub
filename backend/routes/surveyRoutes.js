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


router.post("/", protect, authorizeRoles("ngo", "admin"), createSurvey);


router.get("/all", protect, authorizeRoles("admin"), getAllSurveys);


router.get("/mine", protect, getMySurveys);


router.get("/needs", protect, getAllNeeds);

module.exports = router;