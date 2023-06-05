const authController = require('../controllers/authController');
const router = require('express').Router();

router.post('/signup', authController.signupUser);

module.exports = router;