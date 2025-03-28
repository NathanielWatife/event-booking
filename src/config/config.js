require('dotenv').config();
const path = require('path');

module.exports = {
    app: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    },
    database: {
        dialect: process.env.DB_DIALECT || 'sqlite',
        storage: process.env.DB_STORAGE || path.join(__dirname, '../../database.sqlite'),
    }
};
