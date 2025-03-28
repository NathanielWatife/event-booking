const { Sequelize } = require('sequelize');
const path = require('path');
const config = require('./config');

const sequelize = new Sequelize({
    dialect: config.database.dialect,
    storage: config.database.storage,
    logging: config.app.env === 'development' ? console.log : false,
});

module.exports = sequelize;
