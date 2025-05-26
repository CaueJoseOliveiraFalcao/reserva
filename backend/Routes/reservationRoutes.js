// routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const reservationController = require('../Controllers/reservationController');

router.post('/create', reservationController.createReservation);
router.post('/show' , reservationController.showReservations);
module.exports = router;
