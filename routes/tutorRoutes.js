// routes/tutorRoutes.js
const express = require("express");
const { registerTutor, loginTutor } = require("../controllers/tutorController");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");
const router = express.Router();

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
 * /api/tutor/login:
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

router.get("/test", (req, res) => res.send("Tutor route works!"));

module.exports = router;
