const express = require('express');

const router = express.Router();
const swipeController = require('../controllers/swipeController');
const {verifyToken} = require('../middlewares/auth');

router.get("/getHistory", verifyToken, swipeController.getHistory);

router.post("/registerSwipe", verifyToken, swipeController.registerSwipe);

module.exports = router;