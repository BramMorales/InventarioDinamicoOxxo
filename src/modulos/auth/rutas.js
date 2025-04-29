//Importar
const express = require('express');
const router = express.Router();
const respuesta = require('../../red/respuestas');
const controlador = require('./index');

//Rutas
router.post('/login', login);

//Funciones
async function login(req, res, next){
    try{
        const items = await controlador.login(req.body.usuario_auth, req.body.contrasena_auth, res);
        respuesta.success(req, res, items, 200);
    }
    catch(err)
    {
        next(err);
    }
};

//Valor devuelto
module.exports = router;