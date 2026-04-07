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
 * /api/pets/getPet/{id}
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
 * /api/pets/registerPet:
 *   post:
 *     tags:
 *       - Pets
 *     summary: Register a new pet in the  database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - species
 *               - gender
 *               - size
 *               - healthStatus
 *               - status
 *             properties:
 *               id:
 *                 type: string
 *                 formated: objectId
 *                 description: Pet's ID (Do not input, automatically created)
 *               name:
 *                 type: string
 *                 description: Pet's Name
 *               species:
 *                 type: string
 *                 description: Pet's species
 *               breed:
 *                 type: string
 *                 description: Pet's breed
 *               age:
 *                 type: integer
 *                 description: Pet's age in years                  
 *               gender:
 *                 type: string
 *                 description: Pet's gender
 *                 enum:
 *                   - Male
 *                   - Female
 *               size:
 *                 type: string
 *                 description: pet's size
 *                 enum:
 *                   - Small
 *                   - Medium
 *                   - Large
 *               description:
 *                 type: string
 *                 description: Details of the animal 
 *               disabilities:
 *                 type: string
 *                 description: Does the pet have any disabilities?
 *                 enum:
 *                   - Yes
 *                   - No
 *               healthStatus:
 *                 type: string
 *                 description: Pet's health
 *                 enum:
 *                   - Healthy
 *                   - Sick
 *                   - In Treatment
 *               requirements:
 *                 type: array
 *                 items: 
 *                   type: string
 *                 description: Any extra requirements for the animal
 *               image:
 *                 type: array
 *                 items:
 *                   type: base64    
 *                 description: The images of the animal      
 *               status:
 *                 type: string
 *                 description: The current adoption status 
 *                 enum:
 *                   - Available
 *                   - In Process
 *                   - Adopted
 *               adoptedBy:
 *                 type: string
 *                 formated: objectId
 *                 description: ID of the User who adopted (Extracted from JWT)
 *               adoptionDate:
 *                 type: date
 *                 description: Date when the adoption was confirmed
 *               createdAt:
 *                 type: date
 *                 formated: objectId
 *                 description: When the register was created (Do not input, automatically created)
 *               updateAt:
 *                 type: date
 *                 description: Last change in the database (Do not input, automatically created)
 *           example:
 *               name: "Blanca"
 *               species: "Dog"
 *               breed: "Pastor Aleman Suizo"
 *               age: 5
 *               gender: "Female"
 *               size: "Medium"
 *               description: "A beautiful white dog that loves to play"
 *               disabilities: "Yes"
 *               healthStatus: "Healthy"
 *               requirements: ["A big place", "Lot of time"]
 *               image: ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD...","data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD...","data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD..."]
 *               status: "Avaiable"
 *               adoptedBy: "69c84946fc5d7f3fd1606e50"
 *     responses:
 *       201:
 *         description: Succesfully created
 *       400:
 *         description: Bad Request
 *       401: 
 *         Unauthorized 
 *       500:
 *         description: Server Error
 */
router.post("/registerPet", verifyToken, verifyAdmin, petController.createPet);



//Patch
/**
 * @openapi
 * /api/pets/adopt:
 *   patch:
 *     tags:
 *       - Pets
 *     summary: Change Pet status to "In Progress"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id: 
 *                 type: string
 *                 formated: objectId
 *                 description: ID of the pet that status needs to change
 *           example:
 *             id: "69c9dff553a2741cd12843ca"    
 * responses:
 *       200:
 *         description: Succesfully Updated
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Pet not found
 *       401: 
 *         Unauthorized 
 *       500:
 *         description: Server Error
 */
router.patch("/adopt", verifyToken, petController.startAdoption);

/**
 * @openapi
 * /api/pets/confirm-adoption:
 *   patch:
 *     tags:
 *       - Pets
 *     summary: Change Pet status to "Adopted"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id: 
 *                 type: string
 *                 formated: objectId
 *                 description: ID of the pet that status needs to change
 *           example:
 *             id: "69c9dff553a2741cd12843ca"    
 * responses:
 *       200:
 *         description: Succesfully Updated
 *       400:
 *         description: Bad Request
 *       401: 
 *         Unauthorized 
 *       404:
 *         description: Pet not found 
 *       500:
 *         description: Server Error
 */
router.patch("/confirm-adoption", verifyToken, verifyAdmin, petController.confirmAdoption);


//Put
/**
 * @openapi
 * /api/pets/updatePet/{id}:
 *   put:
 *     tags:
 *       - Pets
 *     summary: Update a pet in the  database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - species
 *               - gender
 *               - size
 *               - healthStatus
 *               - status
 *             properties:
 *               id:
 *                 type: string
 *                 formated: objectId
 *                 description: Pet's ID (Do not input, automatically created)
 *               name:
 *                 type: string
 *                 description: Pet's Name
 *               species:
 *                 type: string
 *                 description: Pet's species
 *               breed:
 *                 type: string
 *                 description: Pet's breed
 *               age:
 *                 type: integer
 *                 description: Pet's age in years                  
 *               gender:
 *                 type: string
 *                 description: Pet's gender
 *                 enum:
 *                   - Male
 *                   - Female
 *               size:
 *                 type: string
 *                 description: pet's size
 *                 enum:
 *                   - Small
 *                   - Medium
 *                   - Large
 *               description:
 *                 type: string
 *                 description: Details of the animal 
 *               disabilities:
 *                 type: string
 *                 description: Does the pet have any disabilities?
 *                 enum:
 *                   - Yes
 *                   - No
 *               healthStatus:
 *                 type: string
 *                 description: Pet's health
 *                 enum:
 *                   - Healthy
 *                   - Sick
 *                   - In Treatment
 *               requirements:
 *                 type: array
 *                 items: 
 *                   type: string
 *                 description: Any extra requirements for the animal
 *               image:
 *                 type: array
 *                 items:
 *                   type: base64    
 *                 description: The images of the animal      
 *               status:
 *                 type: string
 *                 description: The current adoption status 
 *                 enum:
 *                   - Available
 *                   - In Process
 *                   - Adopted
 *               adoptedBy:
 *                 type: string
 *                 formated: objectId
 *                 description: ID of the User who adopted (Extracted from JWT)
 *               adoptionDate:
 *                 type: date
 *                 description: Date when the adoption was confirmed
 *               createdAt:
 *                 type: date
 *                 formated: objectId
 *                 description: When the register was created (Do not input, automatically created)
 *               updateAt:
 *                 type: date
 *                 description: Last change in the database (Do not input, automatically created)
 *           example:
 *               name: "Blanca"
 *               species: "Dog"
 *               breed: "Pastor Aleman Suizo"
 *               age: 5
 *               gender: "Female"
 *               size: "Medium"
 *               description: "A beautiful white dog that loves to play"
 *               disabilities: "Yes"
 *               healthStatus: "Healthy"
 *               requirements: ["A big place", "Lot of time"]
 *               image: ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD...","data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD...","data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD..."]
 *               status: "Avaiable"
 *               adoptedBy: "69c84946fc5d7f3fd1606e50"
 *     responses:
 *       201:
 *         description: Succesfully created
 *       400:
 *         description: Bad Request
 *       401: 
 *         Unauthorized 
 *       404:
 *         description: Pet Not Found 
 *       500:
 *         description: Server Error
 */
router.put("/updatePet/:id", verifyToken, verifyAdmin,  petController.updatePet);




//Delete
/**
 * @openapi
 * /api/pets/deletePet/{id}:
 *   delete:
 *     tags:
 *       - Pets
 *     summary: Delete a specific pet by ID
 *     responses:
 *       200:
 *         description: Succesfully Deleted
 *       401: 
 *         Unauthorized 
 *       404:
 *         description: Pet Not Found
 *       500:
 *         description: Server Error
 */
router.delete("/deletePet/:id", verifyToken, verifyAdmin, petController.deletePet);


module.exports = router;