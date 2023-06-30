const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let refeshTokens = [];

const authController = {
    signupUser: async(req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            // Check validate
            function validateName(name) {
                const re = /^[a-zA-ZÀ-Ỹà-ỹẠ-Ỵạ-ỵĂăÂâĐđÊêÔôƠơƯư\s]+$/;
                return re.test(name);
            }
            const name = req.body.name.trim();
            if (!validateName(name)) {
                return res.status(400).json({ message: 'Tên Chủ Căn Hộ Không Hợp Lệ!' });
            }

            const phoneNumber = req.body.phone;
            if (!/^\d+$/.test(phoneNumber)) {
                return res.status(400).json({ message: 'Số điện thoại phải là số !' });
            }
            if (req.body.phone.length > 11 || req.body.phone.length < 10) {
                return res.status(400).json({ message: 'Số điện thoại không hợp lệ!! (10-11 số)' });
            }
            // Check empty
            const apartment = req.body.apartment.trim()
            if (!name.trim() || !phoneNumber || !req.body.password.trim() || !apartment.trim()) {
                return res.status(400).json({ message: 'Hãy nhập đủ thông tin  !' });
            }

            function validateApartment(apartment) {
                const re = /^[a-zA-Z0-9-]*$/;
                return re.test(apartment);
            }
            if (!validateApartment(apartment)) {
                return res.status(401).json({ message: 'Căn Hộ Không Hợp Lệ' });
            }
            // Check Existing User
            const existingUser = await User.findOne({ phone: req.body.phone });
            if (existingUser) {
                return res.status(400).json({ message: 'Số điện thoại đăng ký đã tồn tại !' });
            }

            const newUser = new User({
                name: name.trim(),
                phone: phoneNumber,
                password: hashed,
                apartment: apartment.trim(),
            });
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: 'Lỗi Hệ Thống, vui lòng cập nhật ứng dụng!' });
        }
    },

    //ACCESSTOKEN
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.isAdmin,
        }, process.env.ACCESS_KEY, { expiresIn: '3h' })
    },
    //Refesh Token
    generateRefeshToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.isAdmin,
        }, process.env.REFRESH_KEY, { expiresIn: '365d' });
    },

    //Login
    loginUser: async(req, res) => {
        try {
            const user = await User.findOne({
                phone: req.body.phone
            });
            if (!user) {
                res.status(401).json({ message: 'Số điện thoại hoặc mật khẩu không đúng !' })
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword) {
                res.status(401).json({ message: 'Số điện thoại hoặc mật khẩu không hợp lệ !' })
            }
            if (user && validPassword) {

                const token = authController.generateAccessToken(user);
                const refeshToken = authController.generateRefeshToken(user)
                refeshTokens.push(refeshToken);
                //Luu cookie
                res.cookie("refeshToken", refeshToken, {
                    httpOnly: true,
                    //secure: false,
                    path: '/',
                    sameSite: 'strict',
                });
                const { password, ...other } = user._doc;
                res.status(200).json({...other, token })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    },
    //RequestToken
    requestRefeshToken: async(req, res) => {
        //Take refesh token from user
        const refeshToken = req.cookies.refeshToken;
        if (!refeshToken)
            return res.status(401).json({ message: 'You are not authenticated !' });
        if (!refeshTokens.includes(refeshToken)) {
            return res.status(403).json("Refesh Token is not valid !")
        }
        jwt.verify(refeshToken, process.env.REFESH_KEY, (err, user) => {
            if (err) {
                console.log(err)
            }
            refeshTokens = refeshTokens.filter((token) => token !== refeshToken)
                //create new access and refesh token
            const newAccessToken = authController.generateAccessToken(user);
            const newrefeshToken = authController.generateRefeshToken(user);

            refeshTokens.push(newrefeshToken);
            res.cookie("refeshToken", newrefeshToken, {
                httpOnly: true,
                //secure: false,
                path: '/',
                sameSite: 'strict',
            });
            res.status(200).json({ token: newAccessToken })
        })

    },
    userLogout: async(req, res) => {
        res.clearCookie('refeshToken')
        refeshTokens = refeshTokens.filter((token) => token !== req.cookies.refeshToken)
        res.status(200).json({ message: 'Đăng Xuất Thành Công !' })
    }
};

module.exports = authController;