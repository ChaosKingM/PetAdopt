const express = require('express');

const router = express.Router();
const petController = require('../controllers/petController');
const {verifyToken, verifyAdmin} = require('../middlewares/auth');

router.get("/", petController.getAllPets);

router.post("/registerPet", verifyToken, verifyAdmin, petController.createPet);

router.get("/getPet/:id", petController.getPetById);

router.delete("/deletePet/:id", verifyToken, verifyAdmin, petController.deletePet);

router.put("/updatePet/:id", verifyToken, verifyAdmin,  petController.updatePet);

router.patch("/adopt", verifyToken, petController.startAdoption);

router.patch("/confirm-adoption", verifyToken, verifyAdmin, petController.confirmAdoption);

module.exports = router;