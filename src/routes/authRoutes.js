const authController = require('../controllers/authController');
const router = require('express').Router();

router.post('/signup', authController.signupUser);
router.post('/login', authController.loginUser)

module.exports = router;