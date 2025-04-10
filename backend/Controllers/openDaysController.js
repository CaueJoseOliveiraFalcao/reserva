const bcrypt = require("bcrypt");
const db = require("../Models");
const { use } = require("../Routes/userRoutes");
const { where } = require("sequelize");

const Open = db.RestaurantOpeningDay;
const Restaurant = db.restaurant;


const showDays = async (req , res) => {
    console.log(req);
    const userId = req.body.userId;
    const restaurant = await Restaurant.findOne({
        where : {
            id : userId
        }
    })

    console.log(restaurant);
} 

module.exports = {
    showDays,
}