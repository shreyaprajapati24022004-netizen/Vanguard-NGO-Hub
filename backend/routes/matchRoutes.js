const express = require("express");
const router = express.Router();

const {
  matchVolunteers,
  triggerAllMatching,
  getAllMatches,
  getMyMatches,
  updateMatchStatus,
} = require("../controllers/matchController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware"); // ← correct import

router.post("/trigger", protect, authorizeRoles("admin"), triggerAllMatching);
router.post("/",        protect, matchVolunteers);
router.get("/",         protect, authorizeRoles("admin"), getAllMatches);
router.get("/my",       protect, getMyMatches);
router.patch("/:id/status", protect, updateMatchStatus);

module.exports = router;