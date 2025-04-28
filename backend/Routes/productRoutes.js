const express = require('express');
const restaurantAuth = require(`../Middlewares/restaurantAuth`);
const productsController = require (`../Controllers/productsController`);
const {show , create , edit ,destroy} = productsController;


const router = express.Router();

router.get('/get-store-products' , restaurantAuth.verify_token_each , show);
router.post('/create-product' , restaurantAuth.verify_token_each , create);
router.post('/edit-product' , restaurantAuth.verify_token_each , edit);
router.post('/remove-product' , restaurantAuth.verify_token_each , destroy);

module.exports = router;