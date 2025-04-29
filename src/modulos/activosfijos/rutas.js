//Importar
const express = require('express');
const router = express.Router();
const respuesta = require('../../red/respuestas');
const controlador = require('./index');

//Rutas
router.get('/', todos);
router.get('/:codigobarras_activo', uno);
router.get('/ubicacion/:ubicacion_activo&:tipoubicacion_activofijo', ubicacion);

router.post('/agregar', agregar);

router.put('/eliminar', eliminar);

//Funciones
async function todos (req, res, next){
    try{
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    }
    catch(err)
    {
        next(err);
    }
};

async function uno(req, res, next){
    try{
        const items = await controlador.uno(req.params.codigobarras_activo);
        respuesta.success(req, res, items, 200);
    }
    catch(err)
    {
        next(err);
    }
};

async function ubicacion(req, res, next){
    try{
        const items = await controlador.ubicacion(req.params.ubicacion_activo, req.params.tipoubicacion_activofijo);
        respuesta.success(req, res, items, 200);
    }
    catch(err)
    {
        next(err);
    }
};

async function eliminar (req, res, next) {
    try{
        const items = await controlador.eliminar(req.body);
        respuesta.success(req, res, 'Item eliminado', 200);
    }
    catch (err) {
        next(err);
    }
};

async function agregar (req, res, next){
    try{
        const items = await controlador.agregar(req.body);
        req.body.id == 0 ? mensaje = "Item guardador con éxito" : mensaje = "Item actualizado con éxito";
        respuesta.success(req, res, mensaje, 201);
    }
    catch(err)
    {
        next(err);
    }
};

//Valor devuelto
module.exports = router;