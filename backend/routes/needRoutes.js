const express = require("express");
const router = express.Router();
const {
  getAllNeeds,
  getNeedById,
  updateNeedStatus,
  deleteNeed,
} = require("../controllers/needController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Saari needs — sab dekh sakte hain
router.get("/", protect, getAllNeeds);

// Ek need — sab dekh sakte hain
router.get("/:id", protect, getNeedById);

// Status update — sirf admin
router.put("/:id", protect, authorizeRoles("admin"), updateNeedStatus);

// Delete — sirf admin
router.delete("/:id", protect, authorizeRoles("admin"), deleteNeed);

module.exports = router;