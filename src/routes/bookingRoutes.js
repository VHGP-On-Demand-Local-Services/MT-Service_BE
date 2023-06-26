const middlewareController = require('../controllers/middlewareController')
const bookingController = require('../controllers/bookingController')

const router = require('express').Router()
router.post('/create-booking', middlewareController.verifyToken, bookingController.createBooking);
router.get('/', middlewareController.verifyTokenAdminFunction, bookingController.getAllBooking);
router.get('/:id', middlewareController.verifyTokenisAdminandUser, bookingController.getBookingById);

module.exports = router