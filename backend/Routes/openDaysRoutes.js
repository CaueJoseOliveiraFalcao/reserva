//importing modules
const express = require('express')
const openDaysController = require('../Controllers/openDaysController')
const restaurantAuth = require('../Middlewares/restaurantAuth')
const { showDays , change_open_days } = openDaysController

const router = express.Router()


router.get('/get-user-days' , restaurantAuth.verify_token_each , showDays);
router.get('/get-user-days-free' , showDays);
router.post('/change-open-days' ,restaurantAuth.verify_token_each , change_open_days)

module.exports = router;