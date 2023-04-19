const Sequelize = require('sequelize');

const sequelize = new Sequelize('blog_posts', 'root', '123456789', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

module.exports = sequelize;
