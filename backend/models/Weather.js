const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Weather = sequelize.define('Weather', {
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Weather;
