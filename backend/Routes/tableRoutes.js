const express = require('express');
const restaurantAuth = require(`../Middlewares/restaurantAuth`);
const tableController = require (`../Controllers/tableController`);
const {index ,show, create , update ,destroy} = tableController;


const router = express.Router();

router.get('/get-all-tables-restaurant' , restaurantAuth.verify_token_each , index);
router.get('/get-user-tables-restaurant' , restaurantAuth.verify_token_each , show);
router.post('/create-table' , restaurantAuth.verify_token_each , create);
router.post('/edit-table' , restaurantAuth.verify_token_each , update);
router.post('/remove-table' , restaurantAuth.verify_token_each , destroy);

module.exports = router; 