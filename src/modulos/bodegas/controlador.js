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

    function busqueda(idplaza_bodega,idregion_bodega)
    {
        return db.and(TABLA, {idplaza_bodega: idplaza_bodega}, {idregion_bodega: idregion_bodega});
    }

    function eliminar(body)
    {
        return db.eliminar(TABLA, body);
    }

    async function agregar(data) {
        const consulta = await db.query(TABLA, { idplaza_bodega: data.idplaza_bodega })
            
        const authData = {
            idplaza_bodega: data.idplaza_bodega,
            idregion_bodega: data.idregion_plaza,
            cr_bodega: data.cr_bodega,
            nombre_bodega: data.nombre_bodega,
        };
    
        if(consulta.length === 0){
            authData.id_bodega = 0
        }
        else{
            authData.id_bodega = consulta[0].id_bodega
        }
    
        return db.agregar('auth', authData);
    } 
    
    return {
        todos,
        uno,
        busqueda,
        eliminar,
        agregar,
    }
}