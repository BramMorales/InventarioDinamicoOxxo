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

    async function agregar(data)
    {
        const authData = {
            id_bodega: data.id_bodega,
            cr_bodega: data.cr_bodega,
            nombre_bodega: data.nombre_bodega
        }
        
                if(data.id_bodega)
                {  
                    authData.id_bodega = data.id_bodega
                }
        
                if(data.cr_bodega)
                {  
                    authData.cr_bodega = data.cr_bodega
                }

                if(data.nombre_bodega)
                {  
                    authData.nombre_bodega = data.nombre_bodega
                }
        
                console.log(authData)
        
                return db.agregar(TABLA, authData);
    }
    
    return {
        todos,
        uno,
        busqueda,
        eliminar,
        agregar,
    }
}