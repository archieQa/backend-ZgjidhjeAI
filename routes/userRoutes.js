const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { checkAiUsageLimit } = require("../middleware/aiUsageMiddleware");
const {
  getUserProfileCompact,
  getItemDetails,
  createItem,
  updateItem,
  deleteItem,
  getAllUserItems,
} = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const router = express.Router();

// New Routes for the backend --------------------------------------------------------------------------------

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Retrieve streamlined user profile
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Streamlined user profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 profile:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     tokensLeft:
 *                       type: integer
 *                       example: 5
 *                     nextRefillTime:
 *                       type: string
 *                       example: "In 12 hours and 30 minutes"
 *                     plan:
 *                       type: string
 *                       example: free
 *                     profilePictureUrl:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *       404:
 *         description: User profile not found
 *       500:
 *         description: Internal server error
 */
router.get("/profile", protect, getUserProfileCompact);
/**
 * @swagger
 * /api/user/item/{id}:
 *   get:
 *     summary: Retrieve item details
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to retrieve
 *     responses:
 *       200:
 *         description: Item details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 item:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109ca"
 *                     question:
 *                       type: string
 *                       example: "What is AI?"
 *                     uploadedFile:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         fileName:
 *                           type: string
 *                           example: "document.pdf"
 *                         fileUrl:
 *                           type: string
 *                           example: "https://example.com/document.pdf"
 *                     extractedText:
 *                       type: string
 *                       nullable: true
 *                       example: "Extracted text from file"
 *                     aiAnswer:
 *                       type: string
 *                       example: "AI stands for Artificial Intelligence."
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */
router.get("/item/:id", protect, getItemDetails);
/**
 * @swagger
 * /api/user/items:
 *   get:
 *     summary: Retrieve all items for authenticated user
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all user items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "60d0fe4f5311236168a109ca"
 *                       question:
 *                         type: string
 *                         example: "What is AI?"
 *                       uploadedFile:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           fileName:
 *                             type: string
 *                             example: "document.pdf"
 *                           fileUrl:
 *                             type: string
 *                             example: "https://example.com/document.pdf"
 *                       extractedText:
 *                         type: string
 *                         nullable: true
 *                         example: "Extracted text from file"
 *                       aiAnswer:
 *                         type: string
 *                         example: "AI stands for Artificial Intelligence."
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2021-07-20T17:32:28Z"
 *       500:
 *         description: Internal server error
 */
router.get("/items", protect, getAllUserItems);
/**
 * @swagger
 * /api/user/item:
 *   post:
 *     summary: Create a new item
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
 *               question:
 *                 type: string
 *                 description: The question text or prompt provided by the user
 *                 example: "What is AI?"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Optional uploaded file
 *               extractedText:
 *                 type: string
 *                 description: Extracted text from the file, if applicable
 *                 example: "Extracted text"
 *               aiAnswer:
 *                 type: string
 *                 description: Response generated by AI
 *                 example: "AI stands for Artificial Intelligence."
 *     responses:
 *       201:
 *         description: New item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 item:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109ca"
 *                     question:
 *                       type: string
 *                       example: "What is AI?"
 *                     uploadedFile:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         fileName:
 *                           type: string
 *                           example: "document.pdf"
 *                         fileUrl:
 *                           type: string
 *                           example: "https://example.com/document.pdf"
 *                     extractedText:
 *                       type: string
 *                       nullable: true
 *                       example: "Extracted text from file"
 *                     aiAnswer:
 *                       type: string
 *                       example: "AI stands for Artificial Intelligence."
 *       400:
 *         description: Bad request
 */
router.post("/item", protect, uploadMiddleware, createItem);
/**
 * @swagger
 * /api/user/use-ai-prompt:
 *   post:
 *     summary: Use an AI prompt and deduct a token
 *     tags: [AI Service]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI prompt used successfully, token deducted
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
 *                   example: "AI prompt sent successfully. Token deducted."
 *                 tokensLeft:
 *                   type: integer
 *                   example: 4
 *       403:
 *         description: Daily token limit reached
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/use-ai-prompt", protect, useAiPrompt);
/**
 * @swagger
 * /api/user/item/{id}:
 *   put:
 *     summary: Update item details by ID
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: Updated question or prompt
 *                 example: "What is AI?"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Updated uploaded file
 *               extractedText:
 *                 type: string
 *                 description: Updated extracted text
 *                 example: "Updated extracted text"
 *               aiAnswer:
 *                 type: string
 *                 description: Updated AI answer
 *                 example: "AI stands for Artificial Intelligence."
 *     responses:
 *       200:
 *         description: Item updated successfully
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
 *                   example: "Item updated successfully"
 *                 item:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109ca"
 *                     question:
 *                       type: string
 *                       example: "What is AI?"
 *                     uploadedFile:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         fileName:
 *                           type: string
 *                           example: "document.pdf"
 *                         fileUrl:
 *                           type: string
 *                           example: "https://example.com/document.pdf"
 *                     extractedText:
 *                       type: string
 *                       nullable: true
 *                       example: "Updated extracted text"
 *                     aiAnswer:
 *                       type: string
 *                       example: "AI stands for Artificial Intelligence."
 *       404:
 *         description: Item not found
 */
router.put("/item/:id", protect, uploadMiddleware, updateItem);
/**
 * @swagger
 * /api/user/item/{id}:
 *   delete:
 *     summary: Delete item by ID
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to delete
 *     responses:
 *       200:
 *         description: Item deleted successfully
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
 *                   example: "Item deleted successfully"
 *       404:
 *         description: Item not found
 */
router.delete("/item/:id", protect, deleteItem);

module.exports = router;
