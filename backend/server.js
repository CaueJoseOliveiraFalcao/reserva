//importing modules
const express = require('express')
const sequelize = require('sequelize')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const db = require('./Models')
const userRoutes = require ('./Routes/userRoutes')
const restaurantRoutes = require ('./Routes/restaurantRoutes')
const daysRoutes = require ("./Routes/openDaysRoutes");
const productsRoutes = require("./Routes/productRoutes");
const tableRoutes = require("./Routes/tableRoutes");
const reservationRoutes = require("./Routes/reservationRoutes");
const cors = require('cors');
const multer = require('multer');
const PORT = process.env.PORT || 8000

const app = express();
app.use(cors({
  origin : 'http://localhost:3000',
  methods : ['POST' , 'GET' , 'DELETE' , 'PUT'],
  credentials : true
}))

const upload = multer({dest : 'uploads/'});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

db.sequelize.sync().then(() => {
    console.log('db is working');
  });

app.use('/api/users' , userRoutes);
app.use('/api/restaurant' , restaurantRoutes);
app.use('/api/days' , daysRoutes);
app.use('/api/product' , productsRoutes);
app.use('/api/tables' ,tableRoutes);
app.use('/api/reservations' ,reservationRoutes);

app.listen(PORT , ()=>console.log("Server is on PORT" , PORT));