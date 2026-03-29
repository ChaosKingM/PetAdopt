const User = require('../models/users');
const sendEmail = require('../helpers/sendEmail');

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

        const mensaje = `¡Hi! We received a request to recover your password.\n\nYour recovery code is: ${resetCode}\n\nThis code will expire in 15 minutes.\n\nIf you did not ask for this recovery, ignore the message.`;

        try {
            await sendEmail({
                email: usuario.email,
                subject: 'Password Recovery Code',
                message: mensaje
            });

            res.status(200).json({ msg: "Recovery Code has been sent to your email." });
            
        } catch (emailError) {
            usuario.resetPasswordCode = undefined;
            usuario.resetPasswordExpire = undefined;
            await usuario.save();

            console.error("Error sending Email:", emailError);
            return res.status(500).json({ msg: "Error while sending email. Please try again." });
        }

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
}

// resetPassword
exports.resetPassword = async (req, res) => {
    try {
        const { email, verification_code, new_password } = req.body;

        if (!email || !verification_code || !new_password) {
            return res.status(400).json({ msg: "Please fill all fields" });
        }

        const usuario = await User.findOne({ 
            email: email,
            resetPasswordCode: verification_code 
        });

        if (!usuario) {
            return res.status(400).json({ msg: "Code does not exist or it is invalid" });
        }

        if (usuario.resetPasswordExpire < Date.now()) {
            return res.status(400).json({ msg: "Code expired. Please ask for a new one" });
        }

        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(new_password, salt);

        usuario.resetPasswordCode = undefined;
        usuario.resetPasswordExpire = undefined;

        await usuario.save();

        res.status(200).json({ msg: "Password updated correctly. Now you can login." });

    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
}

// getMe 
exports.getMe = async (req, res) => {
    try {
        const usuario = await User.findById(req.usuario.id).select('_id full_name email role');

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.status(200).json(usuario);

    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error: error.message });
    }
}