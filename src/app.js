//Importar modulos
const express = require('express');
const config = require('./config');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const { fileURLToPath } = require('url');
const jwt = require('jsonwebtoken');

const regiones = require('./modulos/regiones/rutas');
const plazas = require('./modulos/plazas/rutas');
const tiendas = require('./modulos/tiendas/rutas');
const bodegas = require('./modulos/bodegas/rutas');
const activosfijos = require('./modulos/activosfijos/rutas');
const usuarios = require('./modulos/usuarios/rutas');
const auth = require('./modulos/auth/rutas');
const authorization = require('./middleware/authorization');
const error = require('./red/errors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(cookieParser());

//Configuracion del puerto
app.set('port', config.app.port);
app.set('view engine', 'ejs');

//Configuración de estáticos
app.set('views', path.join(__dirname, '/public/view'));
app.use(express.static(__dirname + '/public/js'));
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/img'));

//Verificacion token
app.use((req, res, next) => {
    res.locals.usuario = null; // ← esta línea es clave
  
    const token = req.cookies.jwt;
    if (token) {
      try {
        res.locals.usuario = jwt.verify(token, config.jwt.secret);
      } catch(err) {
        console.error('Falló jwt.verify:', err.message);
      }
    }


    next();
  });

//Rutas API
app.use('/api/regiones', regiones);
app.use('/api/plazas', plazas);
app.use('/api/tiendas', tiendas);
app.use('/api/bodegas', bodegas);
app.use('/api/activosfijos', activosfijos);
app.use('/api/usuarios', usuarios);
app.use('/api/auth', auth);
app.use(error);

//Rutas URl
app.get("/", authorization.soloNoUsuarios, (req,res)=>{res.render('login')});

//Tecnico
app.get("/Inicio", authorization.soloUsuarios, (req,res)=>{res.render('mainpage_tecnico')});
app.get("/_Inicio", authorization.soloUsuarios, authorization.permisos, (req,res)=>{res.render('main')});
app.get("/Busqueda", authorization.soloUsuarios, (req,res)=>{res.render('busqueda')});
app.get("/Tienda", authorization.soloUsuarios, (req,res)=>{res.render('tienda')});
app.get("/Agregar", authorization.soloUsuarios, (req,res)=>{res.render('agregar')});

//Admin
app.get("/Consulta", authorization.soloUsuarios, (req,res)=>{res.render('consulta')});

app.get('/logout', (req, res) => {res.clearCookie('jwt', { path: '/' }); res.redirect('/Iniciar_Sesion');});

//"Return"
module.exports = app;