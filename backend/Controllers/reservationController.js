// controllers/reservationController.js
const db = require('../Models');
const Reservation = db.Reservation;
const Client = db.Users;
const Restaurant = db.Restaurant;
const Table = db.Table
const { encryptId, decryptId } = require('../lib/encrypt');
exports.deleteReservation = async (req , res) =>{
  const {reservation_id} = req.body;
  
  try {
    const reservation = await Reservation.findByPk(reservation_id);
    await reservation.destroy();
    return res.status(200).json({message : `reserva deletada`});
  }catch(err){
    res.status(500).json({ message: err });
  }
}
exports.decrypt = async (req, res) => {
  const {code} = req.body;
  const decrypt = decryptId(code);
  console.log(decrypt);
}
exports.validateUserEntry = async (req , res) => {
  try{
  const {restaurantId , code} = req.body;

  const restaurant = await Restaurant.findOne({
    where : {id : restaurantId},
    include : [Reservation]
  })
  
  const reservationId = decryptId(code);
  const reservation = await Reservation.findByPk(reservationId);
  console.log(reservation);
  
  if (restaurant.id != reservation.restaurant_id){
    return res.status(404).json({message : `Essa Reserva nao Pertence ao Seu Restaurante`});
  }
  reservation.status = "aberto"
  console.log(reservation.status);
  reservation.save();
  return res.status(200).json({message : `reserva aberta`});
  }
  catch(err){
    console.log(err);
  }


}
exports.showUserReservations = async (req , res) => {
  const {userId} = req.body;
  try {

      const user = await Client.findOne({
      where : {id : userId},
      include : [Reservation]
    })
    const getInfoRestaurant = async (restaurant_id) => {
      const restaurant = await Restaurant.findByPk(restaurant_id);
      return {name : restaurant.name , email : restaurant.email , phone : restaurant.phone , profile : restaurant.profile_picture }; 
    };
    const getTableInfo = async (table_id) => {
      const table = await Table.findByPk(table_id);
      return {table_number : table.table_number , table_capacity : table.table_capacity , table_id : table.id};
    };

    const Reserved_Dates = await Promise.all(
      user.reservations.map(async (element) => {
        const restaurant = await getInfoRestaurant(element.restaurant_id);
        const table = await getTableInfo(element.table_id);
        console.log(encryptId(element.id));
        return {
          qrCode : encryptId(element.id),
          id : element.id,
          date: element.date_reservation,
          table: element.table_id,
          status : element.status,
          table_info : table,
          restaurant: restaurant,
        };
      })
    );
    console.log(Reserved_Dates);
    return res.status(200).json(Reserved_Dates);
  }catch(err){
            console.log(encryptId(err));
        res.status(500).json({ message: err });
  }
}

exports.showReservations = async (req , res) => {
  const {restaurant_id} = req.body;
  try {

    const restaurant = await Restaurant.findOne({
      where : {id : restaurant_id},
      include : [Reservation]
    })
    

    const getInfoUser = async (client_id) => {
      const client = await Client.findByPk(client_id);
      return {name : client.name , email : client.email , phone : client.phone }; 
    };
    const getTableInfo = async (table_id) => {
      const table = await Table.findByPk(table_id);
      return {table_number : table.table_number , table_capacity : table.table_capacity , table_id : table.id};
    };

    const Reserved_Dates = await Promise.all(
      restaurant.reservations.map(async (element) => {
        const client = await getInfoUser(element.client_id);
        const table = await getTableInfo(element.table_id);
        console.log(table);
        return {
          id : element.id,
          date: element.date_reservation,
          table: element.table_id,
          status : element.status,
          table_info : table,
          client: client,
        };
      })
    );

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
    console.log(`dater` , date_reservation.getUTC);
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
