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
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post("/trigger", protect, authorizeRoles("admin"), triggerAllMatching);
router.post("/", protect, matchVolunteers);
router.get("/", protect, authorizeRoles("admin", "ngo"), getAllMatches); // ← fixed
router.get("/my", protect, getMyMatches);
router.patch("/:id/status", protect, updateMatchStatus);

module.exports = router;