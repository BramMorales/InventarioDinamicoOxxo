//Importar
const app = require('./app');

//Inicializar servidor
app.listen(app.get('port'), () => {
    console.log("Servidor escuchando el puerto", app.get("port"));
});
