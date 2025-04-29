const TABLA = 'plaza';

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