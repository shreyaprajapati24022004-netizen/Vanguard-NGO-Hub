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


router.post("/", protect, authorizeRoles("admin"), matchVolunteers);


router.get("/all", protect, authorizeRoles("admin"), getAllMatches);


router.get("/mine", protect, getMyMatches);


router.put("/:id", protect, updateMatchStatus);

module.exports = router;