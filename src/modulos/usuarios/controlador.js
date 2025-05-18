const TABLA = 'usuario';
const auth = require('../auth');

module.exports = function (dbInyectada){

    let db = dbInyectada;

    if(!db){
        db = require('../../DB/mysql');
    }

    function todos()
    {
        return db.todos(TABLA);
    }

    function uno(id_usuario)
    {
        return db.query(TABLA, {id_usuario: id_usuario});
    }

    function eliminar(id_usuario)
    {
        return db.eliminar(TABLA, id_usuario);
    }

    async function agregar(body)
    {
        console.log(body);


        const usuario = {
            id_usuario: body.id_usuario,
            nombre_usuario: body.nombre_usuario,
            apellidop_usuario: body.apellidop_usuario,
            apellidom_usuario: body.apellidom_usuario,
            idplaza_usuario: body.idplaza_usuario
        }

        const respuesta = await db.agregar(TABLA, usuario);
        console.log(respuesta)

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
    }
    
    return {
        todos,
        uno,
        eliminar,
        agregar,
    }
}