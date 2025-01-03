const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Alert = sequelize.define('Alert', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Alert;
