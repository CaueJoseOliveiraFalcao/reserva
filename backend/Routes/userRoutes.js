//importing modules
const express = require('express')
const userController = require('../Controllers/userController')
const { signup, login } = userController
const userAuth = require('../Middlewares/userAuth')

const router = express.Router()


router.post('/signup' , userAuth.verify_client  ,signup);

router.post('/login' , login);

module.exports = router;