const authController = require('../controllers/authController');
const router = require('express').Router();
const middlewareController = require('../controllers/middlewareController')
router.post('/signup', middlewareController.verifyTokenAdminFunction, authController.signupUser);
router.post('/login', authController.loginUser);
router.post('/logout', middlewareController.verifyToken, authController.userLogout);
module.exports = router;