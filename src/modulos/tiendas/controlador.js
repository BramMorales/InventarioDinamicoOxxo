const TABLA = 'tienda';

module.exports = function (dbInyectada){

    let db = dbInyectada;

    if(!db){
        db = require('../../DB/mysql');
    }

    function todos()
    {
        return db.todos(TABLA);
    }

    function uno(id_tienda)
    {
        return db.query(TABLA, {id_tienda: id_tienda});
    }

    function busqueda(valor)
    {
        console.log(valor)
        return db.or(TABLA, {cr_tienda: valor}, {nombre_tienda: valor});
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