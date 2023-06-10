const middlewareController = require('../controllers/middlewareController')
const serviceController = require('../controllers/serviceController')

const router = require('express').Router()

router.post('/create-service', middlewareController.verifyTokenAdminFunction, serviceController.createService)


module.exports = router;