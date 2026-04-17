const express = require("express");
const router = express.Router();
const {
  matchVolunteers,
  getAllMatches,
  getMyMatches,
  updateMatchStatus,
} = require("../controllers/matchController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// AI matching chalao — sirf admin
router.post("/", protect, authorizeRoles("admin"), matchVolunteers);

// Saare matches — sirf admin
router.get("/all", protect, authorizeRoles("admin"), getAllMatches);

// Apne matches — volunteer
router.get("/mine", protect, getMyMatches);

// Match accept/reject — volunteer
router.put("/:id", protect, updateMatchStatus);

module.exports = router;