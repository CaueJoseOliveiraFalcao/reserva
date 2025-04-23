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
    const formatTime = (time) => {
      return time.length === 5 ? `${time}:00` : time;
    };
    try{
      const user = await Restaurant.findOne({
        where : {
          id : userId
        },
        include : [RestaurantOpeningDay]
      })

      for (const element of user.restaurantOpeningDays){
        const actualDay = element.day_of_week;
        const localDay = days[element.day_of_week];
        console.log(element.day_of_week , days[element.day_of_week] );
        //altera os que ja existem no banco e sao true
        if(localDay){
          if(localDay.isTrue){
            element.open_time = days[element.day_of_week].init
            element.close_time = days[element.day_of_week].end
          }
          //deleta os que tao no banco mais istrue e falso local
          else{
            const day = await RestaurantOpeningDay.findOne({
              where : {
                id : element.id
              }
            })
            await day.destroy();
            day.save();
          }
          element.save();
        }
        //cria novos que sao true e nao existem
        Object.entries(days).forEach(async ([key , value]) => {
          console.log(key, value);
          const diaExistente = user.restaurantOpeningDays.find(item => item.day_of_week == key);
          if(!diaExistente && value.isTrue){
              const newDay = await RestaurantOpeningDay.create({
                restaurant_id : user.id,
                day_of_week : key,
                open_time : formatTime(value.init),
                close_time : formatTime(value.end)
              })
              newDay.save();
          }
        })
      };
      res.status(200).json({message : 'alterado'});
    }catch(error){
      res.status(500).json({message : 'erro interno'})
    }

   }
  
module.exports = {
    showDays,
    change_open_days,
}