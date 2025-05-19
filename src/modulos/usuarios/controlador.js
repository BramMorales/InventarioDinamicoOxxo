const TABLA = 'usuario';
const auth = require('../auth');

module.exports = function (dbInyectada){

    let db = dbInyectada;

    if(!db){
        db = require('../../DB/mysql');
    }

    function todos()
    {
        return db.todos(TABLA);
    }

    function uno(id_usuario)
    {
        return db.query(TABLA, {id_usuario: id_usuario});
    }

    function eliminar(id_usuario)
    {
        return db.eliminar(TABLA, id_usuario);
    }

    async function agregar(body) {
    console.log(body);

    const plaza = {
        id_plaza: body.id_plaza,
        idregion_plaza: body.idregion_plaza,
        nombre_plaza: body.nombre_plaza
    };

    const respuesta = await db.agregar(TABLA, plaza);
    console.log(respuesta);

    let insertId = 0;
    body.id_plaza == 0 ? insertId = respuesta.id_plaza : insertId = body.id_plaza;
    console.log('ID de plaza insertado o usado:', insertId);

    let respuesta2 = '';

    if (body.nombre_bodega || body.cr_bodega) {
        respuesta2 = await bodega.agregar({
            cr_bodega: body.cr_bodega,
            nombre_bodega: body.nombre_bodega,
            idplaza_bodega: insertId
        });

        console.log(respuesta2);
    }

    return respuesta2 || respuesta;
}

    
    return {
        todos,
        uno,
        eliminar,
        agregar,
    }
}