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


router.get("/", protect, getAllNeeds);


router.get("/:id", protect, getNeedById);


router.put("/:id", protect, authorizeRoles("admin"), updateNeedStatus);


router.delete("/:id", protect, authorizeRoles("admin"), deleteNeed);

module.exports = router;