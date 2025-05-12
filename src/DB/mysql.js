const { Client } = require('pg');
const config = require('../config');

const dbconfig = {
    host: config.postgresql.host,
    user: config.postgresql.user,
    password: config.postgresql.password,
    database: config.postgresql.database,
    port: 5432, // Puerto por defecto de PostgreSQL
    ssl: {
        rejectUnauthorized: false // Si estás utilizando un servicio que requiere SSL, como Render
    }
};

let conexion;

function conPostgres() {
    conexion = new Client(dbconfig);

    conexion.connect((err) => {
        if (err) {
            console.log('[db err]', err);
            setTimeout(conPostgres, 200); // Intentar reconectar
        } else {
            console.log('DB Lista :D');
        }
    });

    conexion.on('error', err => {
        console.log('[db err]', err);
        if (err.code === 'ECONNREFUSED') {
            conPostgres(); // Reconectar si se pierde la conexión
        } else {
            throw err; // Otro error fatal
        }
    });
}

conPostgres();

function todos(tabla) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla}`, (error, result) => {
            return error ? reject(error) : resolve(result.rows); // `rows` para PostgreSQL
        });
    });
}

function agregar(tabla, data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const valuePlaceholders = values.map((_, i) => `$${i + 1}`).join(', ');

    // Detectar clave de conflicto: primera propiedad que comience con "id_"
    const conflictKey = columns.find(col => col.startsWith('id_'));

    if (!conflictKey) {
        return Promise.reject(new Error("No se pudo determinar una clave de conflicto en los datos"));
    }

    // Construir cláusula de actualización
    const updateAssignments = columns
        .filter(col => col !== conflictKey)  // evita re-asignar la clave primaria
        .map(col => `${col} = EXCLUDED.${col}`)
        .join(', ');

    const query = `
        INSERT INTO ${tabla} (${columns.join(', ')})
        VALUES (${valuePlaceholders})
        ON CONFLICT (${conflictKey}) DO UPDATE SET ${updateAssignments}
    `;

    return new Promise((resolve, reject) => {
        conexion.query(query, values, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


function eliminar(tabla, data) {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM ${tabla} WHERE codigo_region = $1`;
        conexion.query(query, [data.codigo_region], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

function query(tabla, consulta) {
    const keys = Object.keys(consulta);
    const conditions = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
    const values = Object.values(consulta);

    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tabla} WHERE ${conditions}`;
        conexion.query(query, values, (error, result) => {
            return error ? reject(error) : resolve(result.rows);
        });
    });
}

function and(tabla, consulta, consulta2) {
    const keys1 = Object.keys(consulta);
    const keys2 = Object.keys(consulta2);
    const conditions1 = keys1.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
    const conditions2 = keys2.map((key, i) => `${key} = $${i + 1 + keys1.length}`).join(' AND ');

    const values1 = Object.values(consulta);
    const values2 = Object.values(consulta2);

    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tabla} WHERE ${conditions1} AND ${conditions2}`;
        conexion.query(query, [...values1, ...values2], (error, result) => {
            return error ? reject(error) : resolve(result.rows);
        });
    });
}

function or(tabla, consulta, consulta2) {
    const keys1 = Object.keys(consulta);
    const keys2 = Object.keys(consulta2);
    const conditions1 = keys1.map((key, i) => `${key} = $${i + 1}`).join(' OR ');
    const conditions2 = keys2.map((key, i) => `${key} = $${i + 1 + keys1.length}`).join(' OR ');

    const values1 = Object.values(consulta);
    const values2 = Object.values(consulta2);

    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tabla} WHERE ${conditions1} OR ${conditions2}`;
        conexion.query(query, [...values1, ...values2], (error, result) => {
            return error ? reject(error) : resolve(result.rows);
        });
    });
}

module.exports = {
    todos,
    agregar,
    eliminar,
    query,
    and,
    or
};
