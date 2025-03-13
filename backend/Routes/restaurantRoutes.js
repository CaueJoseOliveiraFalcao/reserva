//importing modules
const express = require('express')
const restaurantController = require('../Controllers/restaurantController')
const { signup, login } = restaurantController
const restaurantAuth = require('../Middlewares/restaurantAuth')

const router = express.Router()


router.post('/signup' , restaurantAuth.verify_restaurant  ,signup);

router.post('/login' , login);

module.exports = router;