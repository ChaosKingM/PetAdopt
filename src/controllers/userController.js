const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// registerUser
exports.createUser = async (req,res) => {
    try {
        const {full_name, email, password} = req.body;
        
        if (!full_name || !email || !password) {
            return res.status(400).json({ msg: "Please fill in all fields" });
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({msg: "Please enter a valid email address"});
        }

        const usuario = await User.findOne({email});
        
        if(usuario){
            return res.status(409).json({msg: 'User already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);

        const nuevoUser = new User({
            full_name,
            email,
            password: newPassword
        })

        await nuevoUser.save()
        res.status(201).json(nuevoUser);
    } catch (error) {
        res.status(500).json({error: "Error: Create user", message: error})
    }
}

//loginUser
exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const usuario = await User.findOne({email}).select('+password');
        //Verificar email

        if(!usuario) return res.status(401).json({msg: 'Authorization Error'});
        
        //Verificar la password
        const isMatch = await bcrypt.compare(password, usuario.password);

        if (!isMatch) return res.status(401).json({msg: 'Password is incorrect. Wrong Credential'});

        const payload = {
            usuario: {
                id: usuario.id,
                email: usuario.email
            }
        }

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h'},
        )
        res.json({token})

    } catch (error) {
        res.status(500).json({msg: 'Server Error', error: error})
    }
}

// logoutUser
exports.logoutUser = async (req, res) => {
    try {
        res.status(200).json({ 
            msg: "Succesful logout. Session finished.",
            instruction: "Frontend: Please delete the JWT token from local storage."
        });

    } catch (error) {
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
}

// forgotPassword
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ msg: "Email is required" });
        }

        const usuario = await User.findOne({ email });

        
        if(!usuario) return res.status(401).json({msg: 'Authorization Error'});

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        usuario.resetPasswordCode = resetCode;
        usuario.resetPasswordExpire = Date.now() + 15 * 60 * 1000; 
        
        await usuario.save();

        console.log(`[SIMULACIÓN DE EMAIL] - Código enviado a ${email}: ${resetCode}`);

        res.status(200).json({ msg: "Recovery code has been sent to your email." });

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
}