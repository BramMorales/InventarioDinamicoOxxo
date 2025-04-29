const mysql = require('mysql');
const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
}

let conexion;

function conMysql(){
    conexion = mysql.createConnection(dbconfig);

    conexion.connect((err) => {
        if(err){
            console.log('[db err]', err);
            setTimeout(conMysql, 200);
        }
        else{
            console.log('DB Lista :D');
        }
    });

    conexion.on('error', err => {
        console.log('[db err]', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            conMysql();
        }
        else{
            throw err;
        }
    })
}

conMysql();

function todos(tabla)
{
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT*FROM ${tabla}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    });
}

function agregar(tabla, data)
{
    return new Promise((resolve, reject) => {
        conexion.query(`INSERT INTO ${tabla} SET ? ON DUPLICATE KEY UPDATE ?`, [data, data], (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    });
}

function eliminar(tabla, data)
{
    return new Promise((resolve, reject) => {
        conexion.query(`DELETE FROM ${tabla} WHERE codigo_region = ?`, data.codigo_region, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    });
}

function query(tabla, consulta)
{
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT*FROM ${tabla} WHERE ?`, consulta, (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    });
}

function and(tabla, consulta, consulta2)
{
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT*FROM ${tabla} WHERE ? AND ?`, [consulta, consulta2], (error, result) => {
            return error ? reject(error) : resolve(result);
        })
    });
}
    
function or(tabla, consulta, consulta2)
{
    console.log(consulta)
    console.log(consulta2)
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT*FROM ${tabla} WHERE ? OR ?`, [consulta, consulta2], (error, result) => {
            console.log(result)
            
            return error ? reject(error) : resolve(result);
        })
    });
}

module.exports = {
    todos,
    agregar,
    eliminar,
    query,
    and,
    or
}