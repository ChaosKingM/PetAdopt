const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

//const auth = require('../middlewares/auth');
  
router.post("/register", userController.createUser);

router.post("/login", userController.loginUser);

router.post("/logout", auth, userController.logoutUser);

router.post("/forgot-password", userController.forgotPassword);

router.post("/reset-password", userController.resetPassword)

router.get("/me", auth, userController.getMe)

module.exports = router;