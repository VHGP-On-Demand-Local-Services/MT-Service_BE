const middlewareController = require('../controllers/middlewareController')
const serviceController = require('../controllers/serviceController')

const router = require('express').Router()

router.post('/create-service', middlewareController.verifyTokenAdminFunction, serviceController.createService)
router.get('/', middlewareController.verifyToken, serviceController.getAllService)
router.get('/:id', middlewareController.verifyToken, serviceController.getServicebyId)
router.put('/update/:id', middlewareController.verifyTokenAdminFunction, serviceController.updateService)
router.delete('/delete/:id', middlewareController.verifyTokenAdminFunction, serviceController.deleteService)
module.exports = router;