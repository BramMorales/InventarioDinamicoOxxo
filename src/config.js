require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT || 4000
    },
    jwt:{
        secret: process.env.JET_SECRET || 'notasecreta!',
        expiration: process.env.JWT_EXPIRATION || '7d',
        cookie_expiration: process.env.JWT_COOKIE_EXPIRES || 1,
    },
    postgresql: {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DB || 'parra',
    }
}