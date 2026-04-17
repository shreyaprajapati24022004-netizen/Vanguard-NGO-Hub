const express = require("express");
const router = express.Router();
const {
  getAllVolunteers,
  updateProfile,
} = require("../controllers/volunteerController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Saare volunteers — admin aur NGO dekh sakte hain
router.get("/", protect, authorizeRoles("admin", "ngo"), getAllVolunteers);

// Profile update — volunteer khud karega
router.put("/profile", protect, updateProfile);

module.exports = router;