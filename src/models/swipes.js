const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    pet: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Pet', 
        required: true 
    },
    action: { 
        type: String, 
        enum: ['liked', 'passed'], 
        required: true 
    }
}, { 
    timestamps: true 
});

swipeSchema.index({ user: 1, pet: 1 }, { unique: true });

module.exports = mongoose.model('Swipe', swipeSchema);