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

    function uno(codigo_region)
    {
        return db.query(TABLA, {codigo_region: codigo_region});
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
        eliminar,
        agregar,
    }
}