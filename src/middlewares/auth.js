const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
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