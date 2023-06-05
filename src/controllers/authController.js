const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let refreshToken = [];

const authController = {
    signupUser: async(req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // Check validate
            function validateName(name) {
                const re = /^[a-zA-Z ]*$/;
                return re.test(name);
            }

            const name = req.body.name;
            if (!validateName(name)) {
                return res.status(400).json({ message: 'Name not Valid !' });
            }

            const phoneNumber = req.body.phone;
            if (!/^\d+$/.test(phoneNumber)) {
                return res.status(400).json({ message: 'Phone number can only contain numbers' });
            }
            if (req.body.phone.length > 11 || req.body.phone.length < 10) {
                return res.status(400).json({ message: 'Phone Invalid!! (10 number)' });
            }
            // Check empty
            const apartment = req.body.apartment
            if (!name || !phoneNumber || !req.body.password || !apartment) {
                return res.status(400).json({ message: 'Please provide all required information' });
            }

            // Check Existing User
            const existingUser = await User.findOne({ phone: req.body.phone });
            if (existingUser) {
                return res.status(400).json({ message: 'User already Existing !' });
            }

            const newUser = await new User({
                name: name,
                phone: phoneNumber,
                password: hashed,
                apartment: apartment,
            });
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (err) {
            console.log(err)
            return res.status(500).json(err);
        }
    },
};

module.exports = authController;