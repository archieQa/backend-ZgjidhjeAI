const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { checkAiUsageLimit } = require("../middleware/aiUsageMiddleware");
const {
  createData,
  getUserData,
  updateData,
  deleteData,
  useAiService,
  updateUserPlan,
  uploadFile,
} = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

router.post("/use-ai", protect, checkAiUsageLimit, useAiService); // Use AI service
router.put("/update-plan", protect, updateUserPlan); // Update user plan

// CRUD routes for user data
router.post("/", protect, createData); // Create new data
router.get("/", protect, getUserData); // Get user data
router.put("/:id", protect, updateData); // Update data by ID
router.delete("/:id", protect, deleteData); // Delete data by ID

// Upload file route
router.post("/upload", protect, upload.single("file"), uploadFile);

module.exports = router;
