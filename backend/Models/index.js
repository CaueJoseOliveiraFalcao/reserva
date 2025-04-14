const { Sequelize, DataTypes } = require('@sequelize/core');
const { MySqlDialect } = require('@sequelize/mysql');
const dotenv = require('dotenv');
dotenv.config();
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

// Carregar modelos
db.Users = require("./userModel")(sequelize, DataTypes);
db.Restaurant = require("./restaurantModel")(sequelize, DataTypes);
db.RestaurantOpeningDay = require("./RestaurantOpeningDay")(sequelize, DataTypes);

// Definir associações
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


module.exports = db;