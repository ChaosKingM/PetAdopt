const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');

//const auth = require('../middlewares/auth');
  
router.post("/register", userController.createUser);


router.post("/login", userController.loginUser);

router.post("/logout", userController.logoutUser);

router.post("/forgotPassword", userController.forgotPassword);


module.exports = router;