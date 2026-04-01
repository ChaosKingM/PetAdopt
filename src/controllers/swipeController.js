const Swipe = require('../models/swipes'); 
const Pet = require('../models/pets'); 

exports.registerSwipe = async (req, res) => {
    try {
        const { petId, action } = req.body;
        
        const userId = req.usuario?.id || req.usuario?._id;

        if (!petId || !action) {
            return res.status(400).json({ msg: "Missing Data: requires petId y action ('liked' or 'passed')" });
        }

        const petExists = await Pet.findById(petId);
        if (!petExists) {
            return res.status(404).json({ msg: "The pet does not exist" });
        }

        const existingSwipe = await Swipe.findOne({ user: userId, pet: petId });
        if (existingSwipe) {
            return res.status(400).json({ msg: "You rated this pet previously" });
        }

        const newSwipe = new Swipe({
            user: userId,
            pet: petId,
            action: action
        });

        await newSwipe.save();

        res.status(201).json({ 
            msg: `Swipe '${action}' registred succesfully`, 
            swipe: newSwipe 
        });

    } catch (error) {
        res.status(500).json({ error: "Error registring swipe", message: error.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const userId = req.usuario?.id || req.usuario?._id;

        const allSwipes = await Swipe.find({ user: userId })
                                     .populate('pet', '_id name species image status');

        const history = allSwipes
            .filter(swipe => swipe.pet !== null)
            .map(swipe => ({
                action: swipe.action,         
                swipeDate: swipe.createdAt,    
                pet: swipe.pet            
            }));

        res.status(200).json({ 
            msg: "Complete historial from interactions", 
            total: history.length,
            history: history 
        });

    } catch (error) {
        res.status(500).json({ error: "Error while obtaining complete historial", message: error.message });
    }
};