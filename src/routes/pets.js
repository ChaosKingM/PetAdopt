const express = require('express');

const router = express.Router();
const petController = require('../controllers/petController');
const {verifyToken, verifyAdmin} = require('../middlewares/auth');

//Get
/**
 * @openapi
 * /api/pets/:
 *   get:
 *     tags:
 *       - Pets
 *     summary: Get all pets data form the database
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Server Error
 */
router.get("/", petController.getAllPets);

/**
 * @openapi
 * /api/pets/:
 *   get:
 *     tags:
 *       - Pets
 *     summary: Get a specific pets data form the database with ID
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Pet Not Found
 *       500:
 *         description: Server Error
 */
router.get("/getPet/:id", petController.getPetById);









//Post
/**
 * @openapi
 * /api/registerPet:
 *   post:
 *     tags:
 *       - Pets
 *     summary: Register a new pet in the  database
 *     responses:
 *       201:
 *         description: Succesfully created
 *       400:
 *         description: Bad Request 
 *       500:
 *         description: Server Error
 */
router.post("/registerPet", verifyToken, verifyAdmin, petController.createPet);



router.delete("/deletePet/:id", verifyToken, verifyAdmin, petController.deletePet);

router.put("/updatePet/:id", verifyToken, verifyAdmin,  petController.updatePet);

router.patch("/adopt", verifyToken, petController.startAdoption);

router.patch("/confirm-adoption", verifyToken, verifyAdmin, petController.confirmAdoption);

module.exports = router;