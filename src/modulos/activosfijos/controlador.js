const TABLA = 'activofijo';

module.exports = function (dbInyectada){

    let db = dbInyectada;

    if(!db){
        db = require('../../DB/mysql');
    }

    function todos()
    {
        return db.todos(TABLA);
    }

    function uno(codigobarras_activo)
    {
        return db.query(TABLA, {codigobarras_activo: codigobarras_activo});
    }

    async function ubicacion(ubicacion_activo, tipoubicacion_activofijo)
    {
        return db.and(TABLA, {ubicacion_activo: ubicacion_activo}, {tipoubicacion_activofijo: tipoubicacion_activofijo}); 
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
        ubicacion,
        eliminar,
        agregar,
    }
}