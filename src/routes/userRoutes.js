const middlewareController = require('../controllers/middlewareController');
const userController = require('../controllers/userController');

const router = require('express').Router()

router.get('/', middlewareController.verifyTokenAdminFunction, userController.getAllUser);
router.get('/:id', middlewareController.verifyTokenisAdminandUser, userController.getUser);

module.exports = router;