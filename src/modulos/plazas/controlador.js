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

    async function agregar(body)
    {   
        const plaza = {
            id_plaza: body.id_plaza,
            idregion_plaza: body.idregion_plaza,
            nombre_plaza: body.nombre_plaza
        }
        
        const respuesta = await db.agregar(TABLA, plaza);
        
        var insertId = 0;
        body.id_usuario == 0 ? insertId = respuesta.insertId : insertId = body.id_usuario;
        
                var respuesta2 = '';
        
                console.log(insertId);
        
                if(body.usuario_auth || body.contrasena_auth)
                {
                    respuesta2 = await auth.agregar({
                        idusuario_auth: insertId,
                        usuario_auth: body.usuario_auth,
                        contrasena_auth: body.contrasena_auth,
                        rol_auth: body.rol_auth,
                    }) 
                }
        
                return respuesta2;

        return db.agregar(TABLA, body);
    }
    
    return {
        todos,
        uno,
        eliminar,
        agregar,
    }
}