const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if(!token || !token.startsWith('Bearer')){
        return res.status(401).json({msg: 'There is no token, access denied'});
    }

    try {
        const jwtToken = token.split(' ')[1];

        const cifrado = jwt.verify(jwtToken, process.env.JWT_SECRET);
        console.log(cifrado);
        req.usuario = cifrado.usuario;
        next(); //Pasa a la siguiente capa
    } catch (error) {
        res.status(401).json({msg: 'Invalid token'})
    }
}

exports.verifyAdmin = async (req, res, next) => {
    try {
        console.log("User data in token:", req.usuario);

        const userId = req.usuario.id || req.usuario._id || req.usuario;

        const userDB = await User.findById(userId);

        if (!userDB || userDB.role !== "Admin") {
            return res.status(403).json({ msg: 'Access denied. Admin role required.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ msg: 'Server error verifying role' });
    }
};