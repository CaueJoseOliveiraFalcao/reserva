// routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const reservationController = require('../Controllers/reservationController');

router.post('/create', reservationController.createReservation);

module.exports = router;
