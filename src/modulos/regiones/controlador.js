const TABLA = 'region';

module.exports = function (dbInyectada){

    let db = dbInyectada;

    if(!db){
        db = require('../../DB/mysql');
    }

    function todos()
    {
        return db.todos(TABLA);
    }

    function uno(id_region)
    {
        return db.query(TABLA, {id_region: id_region});
    }

    function eliminar(id_region)
    {
        return db.eliminar(TABLA, {id_region: id_region});
    }

    function agregar(body)
    {
        return db.agregar(TABLA, body);
    }
    
    return {
        todos,
        uno,
        eliminar,
        agregar,
    }
}