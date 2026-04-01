const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    full_name: {
       type: String,
       required: true,
       trim: true, 

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true, 
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must have at least 8 characters"],
        select: false
    },
    role: {
        type: String,
        enum: ["Adopter", "Admin"],
        default: "Adopter"
    },
    resetPasswordCode: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    }
});

module.exports = mongoose.model('User', userScheme);