const bcrypt = require("bcrypt");
const db = require("../Models");
const { use } = require("../Routes/userRoutes");
const { where } = require("sequelize");


const RestaurantOpeningDay = db.RestaurantOpeningDay;
const Restaurant = db.Restaurant;


const showDays = async (req, res) => {
    console.log(req.query.userId);
    const userId = req.query.userId;
    try {
      const restaurant = await Restaurant.findOne({
        where: { id: userId },
        include: [RestaurantOpeningDay]
      });
      console.log(restaurant.restaurantOpeningDays);
      if (!restaurant) {
        return res.status(404).json({ message: 'usuário não encontrado' });
      }
      res.json(restaurant);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Erro ao buscar os dias' });
    }
  };
  
module.exports = {
    showDays,
}