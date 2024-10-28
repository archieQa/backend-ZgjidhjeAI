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
  getUserProfile,
  deleteProfilePicture,
  uploadProfilePicture,
  uploadPackage,
} = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/user/upload-package:
 *   post:
 *     summary: Upload a package (PDF, extracted text, and AI solution)
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The PDF file to upload
 *               extractedText:
 *                 type: string
 *                 description: The extracted text from the PDF
 *               aiSolution:
 *                 type: string
 *                 description: The AI solution for the extracted text
 *     responses:
 *       201:
 *         description: Package uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Package uploaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     pdf:
 *                       type: object
 *                       properties:
 *                         originalName:
 *                           type: string
 *                         mimeType:
 *                           type: string
 *                         size:
 *                           type: number
 *                         url:
 *                           type: string
 *                     extractedText:
 *                       type: string
 *                     aiSolution:
 *                       type: string
 *       400:
 *         description: Bad request
 */
router.post("/upload-package", protect, uploadMiddleware, uploadPackage);

/**
 * @swagger
 * /api/user/profile-picture/upload:
 *   post:
 *     summary: Upload profile picture
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/profile-picture/upload",
  protect,
  uploadMiddleware,
  uploadProfilePicture
);
/**
 * @swagger
 * /api/user/profile-picture:
 *   delete:
 *     summary: Delete profile picture
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile picture deleted successfully
 *       404:
 *         description: Profile picture not found
 */
router.delete("/profile-picture", protect, deleteProfilePicture);

/**
 * @swagger
 * /api/user/use-ai:
 *   post:
 *     summary: Use AI service
 *     tags: [AI Service]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI service used successfully
 *       403:
 *         description: Daily token limit reached
 */
router.post("/use-ai", protect, checkAiUsageLimit, useAiService); // Use AI service
/**
 * @swagger
 * /api/user/update-plan:
 *   put:
 *     summary: Update user subscription plan
 *     tags: [User Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan
 *             properties:
 *               plan:
 *                 type: string
 *                 description: User plan (e.g., free, student, premium)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User plan updated successfully
 *       400:
 *         description: Invalid plan selected
 */
router.put("/update-plan", protect, updateUserPlan); // Update user plan

// CRUD routes for user data
/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Create new user data
 *     tags: [User Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - content
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of the data (e.g., picture, ai_answer, file)
 *               content:
 *                 type: string
 *                 description: Content of the data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: New data created
 *       400:
 *         description: Bad request
 */
router.post("/", protect, createData); // Create new data
/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Retrieve user profile
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       400:
 *         description: Bad request
 */
router.get("/profile", protect, getUserProfile); // Add route for fetching user profile
/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Retrieve all user data (files, AI answers, and packages)
 *     tags:
 *       - User Data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     files:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           content:
 *                             type: string
 *                           fileInfo:
 *                             type: object
 *                             properties:
 *                               originalName:
 *                                 type: string
 *                               mimeType:
 *                                 type: string
 *                               size:
 *                                 type: number
 *                               url:
 *                                 type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     aiAnswers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           content:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     packages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           pdf:
 *                             type: object
 *                             properties:
 *                               originalName:
 *                                 type: string
 *                               mimeType:
 *                                 type: string
 *                               size:
 *                                 type: number
 *                               url:
 *                                 type: string
 *                           extractedText:
 *                             type: string
 *                           aiSolution:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *       400:
 *         description: Bad request
 */
router.get("/", protect, getUserData); // Get user data
/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Update existing data by ID
 *     tags: [User Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the data to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated content
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data updated successfully
 *       404:
 *         description: Data not found
 */
router.put("/:id", protect, updateData); // Update data by ID
/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete data by ID
 *     tags: [User Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the data to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data deleted successfully
 *       404:
 *         description: Data not found
 */
router.delete("/:id", protect, deleteData); // Delete data by ID

// Upload file route
/**
 * @swagger
 * /api/user/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [File Upload]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded
 */
router.post("/upload", protect, uploadMiddleware, uploadFile);

module.exports = router;
