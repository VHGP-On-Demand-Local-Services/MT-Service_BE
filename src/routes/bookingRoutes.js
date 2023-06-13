const middlewareController = require('../controllers/middlewareController')
const bookingController = require('../controllers/bookingController')

const router = require('express').Router()
router.post('/create-booking', middlewareController.verifyToken, bookingController.createBooking);

module.exports = router