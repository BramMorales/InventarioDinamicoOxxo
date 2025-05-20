//Importar
const express = require('express');
const router = express.Router();
const respuesta = require('../../red/respuestas');
const controlador = require('./index');

//Rutas
router.get('/', todos);
router.get('/:id_region', uno);

router.post('/agregar', agregar);

router.put('/eliminar/:id_region', eliminar);

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
        const items = await controlador.uno(req.params.id_region);
        respuesta.success(req, res, items, 200);
    }
    catch(err)
    {
        next(err);
    }
};

async function eliminar (req, res, next) {
    try{
        const items = await controlador.eliminar(req.params.id_region);
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