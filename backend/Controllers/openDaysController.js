const bcrypt = require("bcrypt");
const db = require("../Models");
const { use } = require("../Routes/userRoutes");
const { where } = require("sequelize");


const RestaurantOpeningDay = db.RestaurantOpeningDay;
const Restaurant = db.Restaurant;


const showDays = async (req, res) => {
    const userId = req.query.userId;
    try {
      const restaurant = await Restaurant.findOne({
        where: { id: userId },
        include: [RestaurantOpeningDay]
      });
      if (!restaurant) {
        return res.status(404).json({ message: 'usuário não encontrado' });
      }
      res.status(200).json(restaurant);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Erro ao buscar os dias' });
    }
  };
  const change_open_days = async(req , res) => {
    const {userId , days} = req.body;
    try{
      const user = await Restaurant.findOne({
        where : {
          id : userId
        },
        include : [RestaurantOpeningDay]
      })

      user.restaurantOpeningDays.forEach(element => {
        const actualDay = element.day_of_week;
        console.log(element.day_of_week , days[element.day_of_week] );

        if(days[element.day_of_week]){
          element.open_time = days[element.day_of_week].init
          element.close_time = days[element.day_of_week].end

          console.log(element);
          element.save();
        }
      });
    }catch(error){
      res.status(500).json({message : 'erro interno'})
    }

   }
  
module.exports = {
    showDays,
    change_open_days,
}