const express = require("express");
const router = express.Router();
const {
  getAllVolunteers,
  updateProfile,
} = require("../controllers/volunteerController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");


router.get("/", protect, authorizeRoles("admin", "ngo"), getAllVolunteers);


router.put("/profile", protect, updateProfile);

module.exports = router;