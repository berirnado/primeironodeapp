const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'mousetrap123', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
