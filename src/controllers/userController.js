const User = require("../models/User")

const userController = {
    getAllUser: async(req, res) => {
        try {
            const user = await User.find()
            res.status(200).json(user)
        } catch (err) {
            res.status(200).json({ message: 'Server Error !' })
        }
    },
    getUser: async(req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(401).json({ message: 'User does not exist !' })
            }
        } catch (err) {
            res.status(200).json({ message: 'Server Error!' })
        }
    },
    updateInforUser: async(req, res) => {
        try {
            const { name, apartment, phone } = req.body;

            function validateName(name) {
                const re = /^[a-zA-Z ]*$/;
                return re.test(name);
            }

            function validateApartment(apartment) {
                const re = /^[a-zA-Z0-9-]*$/;
                return re.test(apartment);
            }
            if (!validateApartment(apartment)) {
                return res.status(401).json({ message: 'Invalid apartment' });
            }
            if (!validateName(name)) {
                return res.status(401).json({ message: 'Invalid name' });
            }

            const phoneNumber = phone;
            if (!/^\d+$/.test(phoneNumber)) {
                return res.status(400).json({ message: 'Phone number can only contain numbers' });
            }
            if (phoneNumber.length > 11 || phoneNumber.length < 10) {
                return res.status(400).json({ message: 'Invalid phone number (10-11 digits)' });
            }

            const existPhone = await User.findOne({ phone: phoneNumber });
            //nếu số điện thoại là chính nó thì không cần kiểm tra trùng sdt
            if (existPhone && existPhone._id.toString() !== req.params.id) {
                return res.status(400).json({ message: 'Phone already exists!' });
            }
            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                name: name,
                phone: phoneNumber,
                apartment: apartment,
            });

            if (updateUser) {
                const updatedUser = await User.findById(req.params.id);
                return res.status(200).json(updatedUser);
            } else {
                return res.status(401).json({ message: 'User does not exist!' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Server Error' });
        }
    }



}
module.exports = userController;