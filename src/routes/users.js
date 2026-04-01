const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const {verifyToken} = require('../middlewares/auth');
  
router.post("/register", userController.createUser);

router.post("/login", userController.loginUser);

router.post("/logout", verifyToken, userController.logoutUser);

router.post("/forgot-password", userController.forgotPassword);

router.post("/reset-password", userController.resetPassword)

router.get("/me", verifyToken, userController.getMe)

module.exports = router;