const mongoose = require('mongoose');

const petScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, 
    },
    species: {
        type: String,
        required: true,
        trim: true, 
    },
    breed: {
        type: String,
        trim: true, 
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"]
    },
    size: {
        type: String,
        required: true,
        enum: ["Small", "Medium", "Large"]
    },
    description: {
        type: String,
    },
    disabilities: {
        type: String,
        required: true,
        enum: ["Yes", "No"]
    },
    healthStatus: {
        type: String,
        required: true,
        enum: ["Healthy", "Sick", "In treatment"]
    },
    requirements: {
        type: Array
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["Available", "In Process", "Adopted"]
    },
    adoptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    adoptionDate: {
        type: Date
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Pet', petScheme)