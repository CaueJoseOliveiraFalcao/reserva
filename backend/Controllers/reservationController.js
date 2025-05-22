// controllers/reservationController.js
const db = require('../Models');
const Reservation = db.Reservation;

exports.createReservation = async (req, res) => {
    console.log(`JORGE RAM`)
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

    // Validações básicas
    if (!client_id || !restaurant_id || !table_id || !date_reservation || !begin || !end) {
      return res.status(400).json({ message: "Dados incompletos." });
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
