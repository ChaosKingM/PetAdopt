const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const {verifyToken} = require('../middlewares/auth');

//Get
/**
 * @openapi
 * /api/user/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: User Profile
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         Unauthirized
 *       404:
 *         User Not Found
 *       500:
 *         description: Server Error
 */
router.get("/me", verifyToken, userController.getMe)




//Post
/**
 * @openapi
 * /api/user/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               -full_name
 *               -email
 *               -password
 *             properties:
 *               id:
 *                 type: string
 *                 formated: objectId
 *                 description: Pet's ID (Do not input, automatically created)
 *               full_name:
 *                 type: string
 *                 description: User's fullname
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's unique password
 *               role:
 *                 type: string
 *                 description: User role (Do not input, automatically created)
 *                 enum:
 *                   - Adopter
 *                   - Admin
 *           example:
 *               full_name: "Osmar Curiel Silva"
 *               email: "myUser@petAdopt.com"
 *               password: "m181g874ck&53cur3P455w0rd"
 *     responses:
 *       201:
 *         description: Succesfully Created
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: conflict
 *       500:
 *         description: Server Error
 */
router.post("/register", userController.createUser);

/**
 * @openapi
 * /api/user/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new pet in the  database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               -email
 *               -password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's unique password
 *               token:
 *                 type: string
 *                 formated: JWT
 *                 description: Token for security (Do not input, automatically created) 
 *           example:
 *               email: "myUser@petAdopt.com"
 *               password: "m181g874ck&53cur3P455w0rd"
 *     responses:
 *       200:
 *         description: Ok
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
router.post("/login", userController.loginUser);

/**
 * @openapi
 * /api/user/logout:
 *   post:
 *     tags:
 *       - Users
 *     summary: Exits from the open acount and destroys the token
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
router.post("/logout", verifyToken, userController.logoutUser);

/**
 * @openapi
 * /api/user/forgot-password:
 *   post:
 *     tags:
 *       - Users
 *     summary: Send an email for password recovery
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *     example:
 *       email: "myUser@petAdopt.com"
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
router.post("/forgot-password", userController.forgotPassword);

/**
 * @openapi
 * /api/user/reset-password:
 *   post:
 *     tags:
 *       - Users
 *     summary: Reset the user password
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               verification_code:
 *                 type: integer
 *                 description: Code send to the user
 *               new_password:
 *                 type: string
 *                 description: Change password
 *           example:
 *             email: "myUser@petAdopt.com"
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
router.post("/reset-password", userController.resetPassword)


module.exports = router;