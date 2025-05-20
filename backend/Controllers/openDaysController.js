const bcrypt = require("bcryptjs");
const db = require("../Models");
const { use } = require("../Routes/userRoutes");
const { where } = require("sequelize");


const RestaurantOpeningDay = db.RestaurantOpeningDay;
const Restaurant = db.Restaurant;


const showDays = async (req, res) => {
    const userId = req.query.userId;
    console.log(req.query);
    console.log(userId);
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
  const change_open_days = async (req, res) => {
    const { userId, days } = req.body;
  
    const formatTime = (time) => time.length === 5 ? `${time}:00` : time;
  
    try {
      const user = await Restaurant.findOne({
        where: { id: userId },
        include: [RestaurantOpeningDay]
      });
  
      if (user.restaurantOpeningDays) {
        for (const element of user.restaurantOpeningDays) {
          const actualDay = element.day_of_week;
          const localDay = days[actualDay];
  
          if (localDay) {
            if (localDay.isTrue) {
              element.open_time = formatTime(localDay.init);
              element.close_time = formatTime(localDay.end);
              await element.save();
            } else {
              await element.destroy();
            }
          }
        }
  
        // Agora, cria os novos que ainda não existem
        for (const [key, value] of Object.entries(days)) {
          const diaExistente = user.restaurantOpeningDays.find(item => item.day_of_week == key);
          if (!diaExistente && value.isTrue) {
            await RestaurantOpeningDay.create({
              restaurant_id: user.id,
              day_of_week: key,
              open_time: formatTime(value.init),
              close_time: formatTime(value.end)
            });
          }
        }
      } else {
        for (const [key, value] of Object.entries(days)) {
          if (value.isTrue) {
            await RestaurantOpeningDay.create({
              restaurant_id: user.id,
              day_of_week: key,
              open_time: formatTime(value.init),
              close_time: formatTime(value.end)
            });
          }
        }
      }
  
      res.status(200).json({ message: "Horários atualizados com sucesso!" });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar horários", error });
    }
  };
  
  
module.exports = {
    showDays,
    change_open_days,
}