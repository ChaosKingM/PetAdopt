const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if(!token){
        return res.status(401).json({msg: 'No hay token, permiso denegado'});
    }

    try {
        const cifrado = jwt.verify(token, process.env.JWT_SECRET);
        console.log(cifrado);
        next(); //Pasa a la siguiente capa
    } catch (error) {
        res.status(401).json({msg: 'Token no valido'})
    }
}