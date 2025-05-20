const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const config = require('../config');
const db = require('../DB/mysql');

dotenv.config();

const TABLA = 'auth';

async function soloUsuarios(req, res, next) {
    const log = await revisarCookie(req);
    if (log) return next();
    return res.redirect("/Iniciar_Sesion");
}

async function soloNoUsuarios(req, res, next) {
    const log = await revisarCookie(req);
    if (!log) return next();
    return res.redirect("/Inicio");

}

async function permisoPorRol(rolesPermitidos = [], redireccion = "/") {
    return async function(req, res, next) {
        const log = await revisarCookie(req);

        if (!log || !rolesPermitidos.includes(log.rol_auth)) {
            return res.redirect(redireccion);
        }

        return next();
    };
}

async function revisarCookie(req) {
    try {
        const cookies = req.headers.cookie;
        if (!cookies) return false;

        const jwtCookie = cookies
            .split(";")
            .map(c => c.trim())
            .find(cookie => cookie.startsWith("jwt="));

        if (!jwtCookie) return false;

        const token = jwtCookie.split("=")[1];
        const decoded = jwt.verify(token, config.jwt.secret, config.jwt.expiration);
        const [usuarioActivo] = await db.query(TABLA, { idusuario_auth: decoded.id });
        return usuarioActivo;
    } catch (error) {
        console.error("Error revisando cookie:", error.message);
        return false;
    }
}

module.exports = {
    soloUsuarios,
    soloNoUsuarios,
    permisoPorRol
};