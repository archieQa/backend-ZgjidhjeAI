/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management for tutors
 */

const express = require("express");
const {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/tutors/blogs:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
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
 *               - content
 *               - imageUrl
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Blog created successfully
 */
router.post("/", protect, createBlog);

/**
 * @swagger
 * /api/tutors/blogs:
 *   get:
 *     summary: Get all blog posts by authenticated tutor
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of blogs
 */
router.get("/", protect, getBlogs);

/**
 * @swagger
 * /api/tutors/blogs/{id}:
 *   put:
 *     summary: Update a blog post by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog updated successfully
 */
router.put("/:id", protect, updateBlog);

/**
 * @swagger
 * /api/tutors/blogs/{id}:
 *   delete:
 *     summary: Delete a blog post by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog to delete
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 */
router.delete("/:id", protect, deleteBlog);

module.exports = router;
