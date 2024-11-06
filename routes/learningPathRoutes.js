// routes/learningPathRoutes.js

const express = require("express");
const {
  createLearningPath,
  getLearningPaths,
  updateLearningPath,
  deleteLearningPath,
} = require("../controllers/learningPathController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/tutors/learning-paths:
 *   post:
 *     summary: Create a new learning path
 *     tags: [Learning Paths]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - level
 *               - imageUrl
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               level:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Learning path created successfully
 */
router.post("/", protect, createLearningPath);

/**
 * @swagger
 * /api/tutors/learning-paths:
 *   get:
 *     summary: Get all learning paths by authenticated tutor
 *     tags: [Learning Paths]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of learning paths
 */
router.get("/", protect, getLearningPaths);

/**
 * @swagger
 * /api/tutors/learning-paths/{id}:
 *   put:
 *     summary: Update a learning path by ID
 *     tags: [Learning Paths]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the learning path to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               level:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Learning path updated successfully
 */
router.put("/:id", protect, updateLearningPath);

/**
 * @swagger
 * /api/tutors/learning-paths/{id}:
 *   delete:
 *     summary: Delete a learning path by ID
 *     tags: [Learning Paths]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the learning path to delete
 *     responses:
 *       200:
 *         description: Learning path deleted successfully
 */
router.delete("/:id", protect, deleteLearningPath);

module.exports = router;
