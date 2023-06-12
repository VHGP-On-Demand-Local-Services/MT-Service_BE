const middlewareController = require('../controllers/middlewareController');
const userController = require('../controllers/userController');

const router = require('express').Router()

router.get('/', middlewareController.verifyTokenAdminFunction, userController.getAllUser);
router.get('/:id', middlewareController.verifyTokenisAdminandUser, userController.getUser);
router.get('/search', middlewareController.verifyTokenAdminFunction, userController.searchUser)
router.put('/update-info/:id', middlewareController.verifyTokenAdminFunction, userController.updateInforUser)
router.put('/change-pass/:id', middlewareController.verifyTokenUser, userController.changePass)
router.delete('/delete-user/:id', middlewareController.verifyTokenAdminFunction, userController.deleteUser)
module.exports = router;