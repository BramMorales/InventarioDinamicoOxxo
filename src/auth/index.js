const jwt = require('jsonwebtoken');
config = require('../config')

const { secret, expiration, cookie_expiration } = config.jwt;

function asignarToken(res, data){
  try {
    const token = jwt.sign(data, secret, { expiresIn: expiration });
        
    const cookieOptions = {
      expires: new Date(Date.now() + cookie_expiration * 24 * 60 * 60 * 1000),
      httpOnly: true,
      path: "/"
    };
      
    res.cookie("jwt", token, cookieOptions);

    return token;
  } catch (err) {
    console.error('Error al generar el token o establecer la cookie:', err.message);
    throw new Error('No se pudo generar el token.');
  }
}

module.exports = {
    asignarToken
}