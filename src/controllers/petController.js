const Pet = require('../models/pets');

exports.getAllPets = async (req,res) => {
    try {
        const pets = await Pet.find().select('_id name species image status');
        res.json(pets);
    } catch (error) {
        res.status(500).json({error: "Error: Get Pets", message: error});
    }
}

exports.createPet = async (req,res) => {
    try {
        const {
            name,
            species,
            breed,
            age,
            gender,
            size,
            description,
            disabilities,
            healthStatus,
            requirements,
            image,
            status,
        } = req.body;

        if (!name || !species || !gender || !size || !disabilities || !healthStatus || !status || !image) {
            return res.status(400).json({ msg: "Please fill in all required fields" });
        }

        const newPet = new Pet({
            name,
            species,
            breed,
            age,
            gender,
            size,
            description,
            disabilities,
            healthStatus,
            requirements,
            image,
            status,
        })

        await newPet.save();
        res.status(201).json(newPet);
    } catch (error) {
       res.status(500).json({error: "Error: Create pet", message: error}) 
    }
};


exports.getPetById = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({ msg: "Pet not found" });
        }

        res.status(200).json(pet);

    } catch (error) {
        res.status(500).json({ error: "Error: Get Pet", message: error.message });
    }
};

exports.deletePet = async (req, res) => {
    try {
        const petDeleted = await Pet.findByIdAndDelete(req.params.id);

        if (!petDeleted) {
            return res.status(404).json({ msg: "Pet not found or already deleted" });
        }
        
        res.status(200).json({ msg: "Pet deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: "Error: Delete Pet", message: error.message });
    }
};

exports.updatePet = async (req, res) => {
    try {

        const petUpdated = await Pet.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!petUpdated) {
            return res.status(404).json({ msg: "Pet not found" });
        }

        res.status(200).json(petUpdated);

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ msg: "Validation Error", error: error.message });
        }
        
        res.status(500).json({ error: "Error: Update Pet", message: error.message });
    }
};


exports.startAdoption = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ msg: "Pet ID is required" });
        }

        const pet = await Pet.findById(_id);
        if (!pet) {
            return res.status(404).json({ msg: "Pet not found" });
        }

        if (pet.status !== "Available") {
            return res.status(400).json({ msg: "Pet is not available for adoption" });
        }

        const idAdopter = req.usuario?.id || req.usuario?._id;
        
        pet.status = "In Process";
        pet.adoptedBy = idAdopter;
        await pet.save();

        res.status(200).json({ 
            msg: "Adoption process started", 
            pet, 
            adoptedBy: idAdopter
        });

    } catch (error) {
        res.status(500).json({ error: "Error: Start Adoption", message: error.message });
    }
};


exports.confirmAdoption = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ msg: "Pet ID is required" });
        }

        const pet = await Pet.findById(_id);
        if (!pet) {
            return res.status(404).json({ msg: "Pet not found" });
        }

        if (pet.status !== "In Process") {
            return res.status(400).json({ msg: "Pet must be 'In Process' to confirm adoption" });
        }

        pet.status = "Adopted";
        pet.adoptionDate = new Date(); 

        await pet.save();

        res.status(200).json({ 
            msg: "Adoption confirmed successfully", 
            pet, 
            adoptedBy: pet.adoptedBy 
        });

    } catch (error) {
        res.status(500).json({ error: "Error: Confirm Adoption", message: error.message });
    }
};