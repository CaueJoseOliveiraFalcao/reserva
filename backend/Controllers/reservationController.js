// controllers/reservationController.js
const db = require('../Models');
const Reservation = db.Reservation;
const Client = db.Users;
const Restaurant = db.Restaurant;


exports.showReservations = async (req , res) => {
  const {restaurant_id} = req.body;
  try {

    const restaurant = await Restaurant.findOne({
      where : {id : restaurant_id},
      include : [Reservation]
    })
    
    console.log(restaurant.reservations);
    const Reserved_Dates = []
    restaurant.reservations.forEach(element => {
      Reserved_Dates.push({date : element.date_reservation , table : element.table_id});
    });
    return res.status(200).json(Reserved_Dates);
  }catch(err){
        res.status(500).json({ message: err });
  }
}
exports.createReservation = async (req, res) => {
  try {
    const {
      client_id,
      restaurant_id,
      table_id,
      date_reservation,
      begin,
      end,
      status,
    } = req.body;
    console.log(`dater` , date_reservation);
    // Validações básicas
    if (!client_id || !restaurant_id || !table_id || !date_reservation || !begin || !end) {
      return res.status(400).json({ message: "Dados incompletos." });
    }
    const user = await Client.findOne({
        where : {id : client_id},
        include : [Reservation]
    })
    const verifyWeek = (dbDate , rsDate) => {
      const newR = new Date(rsDate);
      const dbDatee = new Date(dbDate);
      const diference = Math.abs(newR - dbDatee) / (1000 * 60 * 60 * 24);
      return diference < 7;

    }
 
    for (const element of user.reservations) {
      if (element.restaurant_id == restaurant_id) {
        const verify = verifyWeek(element.date_reservation, date_reservation);
        if (verify) {
          return res.status(401).json({
            message: "Você já tem uma reserva nesse restaurante com menos de 7 dias de diferença.",
          });
        }
      }
    }

    const novaReserva = await Reservation.create({
      client_id,
      restaurant_id,
      table_id,
      date_reservation,
      begin,
      end,
      status,
    });

    return res.status(201).json(novaReserva);
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    res.status(500).json({ message: "Erro interno ao criar reserva." });
  }
};
