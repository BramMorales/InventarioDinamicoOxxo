const TABLA = 'plaza';
const bodega = require('../bodegas');

module.exports = function (dbInyectada){

    let db = dbInyectada;

    if(!db){
        db = require('../../DB/mysql');
    }

    function todos()
    {
        return db.todos(TABLA);
    }

    function uno(id_plaza)
    {
        return db.query(TABLA, {id_plaza: id_plaza});
    }

    function eliminar(body)
    {
        return db.eliminar(TABLA, body);
    }

    async function agregar(body)
    {   
        const plaza = {
            id_plaza: body.id_plaza,
            idregion_plaza: body.idregion_plaza,
            nombre_plaza: body.nombre_plaza
        }
        
        const respuesta = await db.agregar(TABLA, plaza);
        
        var insertId = 0;
        body.id_usuario == 0 ? insertId = respuesta.id_plaza : insertId = body.id_usuario;        
        console.log(insertId);
        
        var respuesta2 = ''

        if(body.nombre_bodega || body.cr_bodega)
        {
            respuesta2 = await bodega.agregar({
                id_bodega: insertId,
                cr_bodega: body.cr_bodega,
                nombre_bodega: body.nombre_bodega
            }) 
        }
        
        return respuesta2;
    }
    
    return {
        todos,
        uno,
        eliminar,
        agregar,
    }
}