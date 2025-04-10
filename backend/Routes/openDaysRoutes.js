//importing modules
const express = require('express')
const openDaysController = require('../Controllers/openDaysController')
const restaurantAuth = require('../Middlewares/restaurantAuth')
const { showDays } = openDaysController

const router = express.Router()


router.get('/get-user-days' , restaurantAuth.verify_token_each , showDays);

module.exports = router;