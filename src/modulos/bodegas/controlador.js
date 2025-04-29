const TABLA = 'bodega';

module.exports = function (dbInyectada){

    let db = dbInyectada;

    if(!db){
        db = require('../../DB/mysql');
    }

    function todos()
    {
        return db.todos(TABLA);
    }

    function uno(id_bodega)
    {
        console.log(id_bodega)
        return db.query(TABLA, {id_bodega: id_bodega});
    }

    function busqueda(idplaza_bodega,codigoregion_bodega)
    {
        return db.and(TABLA, {idplaza_bodega: idplaza_bodega}, {codigoregion_bodega: codigoregion_bodega});
    }

    function eliminar(body)
    {
        return db.eliminar(TABLA, body);
    }

    function agregar(body)
    {
        return db.agregar(TABLA, body);
    }
    
    return {
        todos,
        uno,
        busqueda,
        eliminar,
        agregar,
    }
}