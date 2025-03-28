// models/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/config');
const orderModel = require('./order');

// Initialize Sequelize
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  storage: config.storage,
  logging: false
});

// Initialize models
const Order = orderModel(sequelize);

// Test connection
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Connection error:', err));

// Sync models
sequelize.sync();

module.exports = {
  sequelize,
  Order // This is the properly initialized model
};