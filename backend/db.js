// db.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const dbHost = process.env.DB_HOST || 'localhost';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: dbHost,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
  }
);

module.exports = sequelize;
