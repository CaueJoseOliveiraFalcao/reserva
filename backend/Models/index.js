const { Sequelize, DataTypes } = require('@sequelize/core');
const { MySqlDialect } = require('@sequelize/mysql');
const dotenv = require('dotenv');

const sequelize = new Sequelize({
  dialect: MySqlDialect,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: 3306,
});

sequelize.authenticate().then(() =>{
    console.log("database is ok");
}).catch((err) => {
    console.log(err);
})

const db ={}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./userModel") (sequelize , DataTypes)
db.restaurant = require("./restaurantModel") (sequelize , DataTypes)

module.exports = db;