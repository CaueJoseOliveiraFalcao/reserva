const { Sequelize, DataTypes } = require('@sequelize/core');
const { MySqlDialect } = require('@sequelize/mysql');
const dotenv = require('dotenv');

const sequelize = new Sequelize({
  dialect: MySqlDialect,
  database: 'reserva',
  user: 'root',
  password: 'C4u3j0s3',
  host: 'localhost',
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