// routes/tutorRoutes.js
const express = require("express");
const {
  registerTutor,
  loginTutor,
  getAuthenticatedTutorDetails,
} = require("../controllers/tutorController");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");
const router = express.Router();
const resourceRoutes = require("./resourceRoutes");
const { protect } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/tutors/register:
 *   post:
 *     summary: Register a new tutor
 *     tags: [Tutor Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - subject
 *               - expertise
 *               - yearsExperience
 *               - email
 *               - password
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               subject:
 *                 type: string
 *               expertise:
 *                 type: array
 *                 items:
 *                   type: string
 *               yearsExperience:
 *                 type: integer
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tutor registered successfully
 *       400:
 *         description: Bad request
 */
router.post("/register", registerTutor);
/**
 * @swagger
 * /api/tutors/login:
 *   post:
 *     summary: Login an existing tutor
 *     tags: [Tutor Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tutor logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginTutor);
// Include resource routes
router.use("/resources", resourceRoutes);
/**
 * @swagger
 * /api/tutors/me:
 *   get:
 *     summary: Retrieve details of the authenticated tutor
 *     tags: [Tutors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated tutor details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tutor:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     subject:
 *                       type: string
 *                     expertise:
 *                       type: array
 *                       items:
 *                         type: string
 *                     yearsExperience:
 *                       type: integer
 *                     rating:
 *                       type: number
 *                     description:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *       404:
 *         description: Authenticated tutor not found
 */
router.get("/me", protect, getAuthenticatedTutorDetails);

module.exports = router;
