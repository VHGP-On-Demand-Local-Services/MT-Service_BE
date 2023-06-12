const User = require("../models/User")
const bcrypt = require('bcrypt')
const userController = {
    getAllUser: async(req, res) => {
        try {
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 10

            const startIndex = (page - 1) * limit
            const endIndex = page * limit

            const users = await User.find().skip(startIndex).limit(limit);
            const totalUser = await User.countDocuments()

            const pagination = {}

            if (endIndex < totalUser) {
                pagination.next = {
                    page: page + 1,
                    limit: limit
                };
            }
            if (startIndex > 0) {
                pagination.prev = {
                    page: page - 1,
                    limit: limit
                };
            }
            res.status(200).json({
                pagination,
                users
            });
        } catch (err) {
            res.status(500).json({ message: 'Server Error !' })
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
            console.log(err)
            res.status(500).json({ message: 'Server Error!' })
        }
    },
    searchUser: async(req, res) => {
        try {
            const keyword = req.query;

            const apartmentRegex = new RegExp(keyword, "i");
            const phoneRegex = new RegExp(keyword, "i");

            const users = await User.find({
                $or: [
                    { phone: phoneRegex },
                    { apartment: apartmentRegex },
                ],
            });

            res.status(200).json({ users });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Server Error!' });
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
    },
    changePass: async(req, res) => {
        try {
            const { oldPassword, newPassword, confirmPassword } = req.body;
            const userId = req.params.id;

            const user = await User.findById(userId);

            if (!user) {
                return res.status(401).json({ message: 'User does not exist!' });
            }

            const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isOldPasswordValid) {
                return res.status(401).json({ message: 'Invalid old password!' });
            }
            if (oldPassword === newPassword) {
                return res.status(401).json({ message: 'The new password cannot be the same as the old password. Retry!' });
            }
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: "New password and confirm password don't match!" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            const updatedUser = await User.findByIdAndUpdate(userId, { password: hashedPassword });

            if (updatedUser) {
                const updatedUserInfo = await User.findById(userId);
                return res.status(200).json({ message: 'Password changed successfully', user: updatedUserInfo });
            } else {
                return res.status(401).json({ message: 'User does not exist!' });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Server Error' });
        }
    },
    deleteUser: async(req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            if (user) {
                return res.status(200).json({ message: 'Delete Successfully !!' })
            } else {
                return res.status(401).json({ message: 'User does not exist !!' })
            }
        } catch (err) {
            res.status(500).json({ message: 'Server Error !' })
        }
    }
}
module.exports = userController;