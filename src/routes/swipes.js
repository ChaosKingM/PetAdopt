const express = require('express');

const router = express.Router();
const swipeController = require('../controllers/swipeController');
const {verifyToken} = require('../middlewares/auth');


//Get
/**
 * @openapi
 * /api/swipe/getHistory:
 *   get:
 *     tags:
 *       - Swipes
 *     summary: See all liked pets
 *     responses:
 *       201:
 *         description: Succefully Created
 *       401:
 *         Unauthirized
 *       500:
 *         description: Server Error
 */
router.get("/getHistory", verifyToken, swipeController.getHistory);


//Post
/**
 * @openapi
 * /api/swipe/registerSwipe:
 *   post:
 *     tags:
 *       - Swipes
 *     summary: Like a specific pet
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - petId
 *               - action 
 *             properties:
 *               petId:
 *                 type: string
 *                 description: Pet ID of the liked pet
 *               action:
 *                 type: string
 *                 description: Action performed to the pet
 *           example:
 *               petId: "69c9dff553a2741cd12843ca"
 *               action: "liked"
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
router.post("/registerSwipe", verifyToken, swipeController.registerSwipe);

module.exports = router;