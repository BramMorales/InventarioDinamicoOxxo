const TABLA = 'auth';
const bcrypt = require('bcryptjs');
const auth = require('../../auth');

module.exports = function (dbInyectada){

    let db = dbInyectada;

    if(!db){
        db = require('../../DB/mysql');
    }

    async function login(usuario_auth, contrasena_auth, res){
        try{
            const [user] = await db.query(TABLA, {usuario_auth: usuario_auth});
            const [user_extra] = await db.query('usuario', {id_usuario: user.idusuario_auth});
            const [plaza] = await db.query('plaza', {id_plaza: user_extra.idplaza_usuario,});

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            const isMatch = await bcrypt.compare(contrasena_auth, user.contrasena_auth);
            if (!isMatch) {
                throw new Error('Credenciales inválidas');
            }

            const payload = { 
                id: user.idusuario_auth, 
                rol: user.rol_auth,
                nombre: user_extra.nombre_usuario,
                apellido: user_extra.apellidop_usuario,
                plaza: user_extra.idplaza_usuario,
                region: plaza.idregion_plaza,
            };
            
            return token = auth.asignarToken(res, payload);
        }
        catch(error){
            throw new Error(`Error en login: ${error.message}`);
        }
    }

async function agregar(data) {
  // 1) Buscamos el registro auth si existe
  const [existingAuth] = await db.query('auth', { idusuario_auth: data.idusuario_auth }) || [];

  console.log("Consulta:", existingAuth)
  // 2) Construimos authData
  const authData = {
    idusuario_auth: data.idusuario_auth,
    rol_auth:       data.rol_auth
  };

  // 3) SI ya había auth, guardamos su PK real
  if (existingAuth?.id_auth) {
    authData.id_auth = existingAuth.id_auth;
  }

  // 4) Campos opcionales
  if (data.usuario_auth)   authData.usuario_auth   = data.usuario_auth;
  if (data.contrasena_auth) {
    authData.contrasena_auth = await bcrypt.hash(data.contrasena_auth, 5);
  }

  // Ésta vez sí tendrás `id_auth` en authData y se hará UPDATE
  return db.agregar('auth', authData);
}


    
    return {
        agregar,
        login
    }
}