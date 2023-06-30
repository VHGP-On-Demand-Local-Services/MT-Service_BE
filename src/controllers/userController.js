const User = require("../models/User")
const bcrypt = require('bcrypt')
const XRegExp = require('xregexp');

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
            res.status(500).json({ message: 'Lỗi Hệ Thống !' })
        }
    },
    getUser: async(req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(401).json({ message: 'Người dùng không tồn tại !' })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Lỗi Hệ Thống !' })
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
            res.status(500).json({ message: 'Lỗi Hệ Thống !' })
        }
    },
    updateInforUser: async(req, res) => {
        try {
            const { name, apartment, phone } = req.body;

            function validateName(name) {
                const re = /^[a-zA-ZÀ-Ỹà-ỹẠ-Ỵạ-ỵĂăÂâĐđÊêÔôƠơƯư\s]+$/;
                return re.test(name);
            }

            function validateApartment(apartment) {
                const re = /^[a-zA-Z0-9-]*$/;
                return re.test(apartment);
            }
            if (!validateApartment(apartment)) {
                return res.status(401).json({ message: 'Căn Hộ Không Hợp Lệ' });
            }
            if (!validateName(name)) {
                return res.status(400).json({ message: 'Tên Không Hợp Lệ!' });
            }

            const phoneNumber = phone;
            if (!/^\d+$/.test(phoneNumber)) {
                return res.status(400).json({ message: 'Số điện thoại phải là số !' });
            }
            if (phoneNumber.length > 11 || phoneNumber.length < 10) {
                return res.status(400).json({ message: 'Số điện thoại không hợp lệ!! (10-11 số)' });
            }

            const existPhone = await User.findOne({ phone: phoneNumber });

            if (existPhone && existPhone._id.toString() !== req.params.id) {
                return res.status(400).json({ message: 'Số Điện Thoại đã tồn tại !', existingPhone: existPhone.phone });
            }
            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                name: name.trim(),
                phone: phoneNumber,
                apartment: apartment.trim(),
            });

            if (updateUser) {
                const updatedUser = await User.findById(req.params.id);
                return res.status(200).json(updatedUser);
            } else {
                return res.status(401).json({ message: 'Người dùng không tồn tại!' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Lỗi Hệ Thống' });
        }
    },
    changePass: async(req, res) => {
        try {
            const { oldPassword, newPassword, confirmPassword } = req.body;
            const userId = req.params.id;
            if (!oldPassword || !newPassword || !confirmPassword) {
                return res.status(400).json({ message: 'Hãy nhập đủ thông tin các trường bắt buộc !' });
            }
            const user = await User.findById(userId);

            if (!user) {
                return res.status(401).json({ message: 'Người dùng không tồn tại!' });
            }

            const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isOldPasswordValid) {
                return res.status(401).json({ message: 'Mật Khẩu cũ không đúng!' });
            }
            if (oldPassword === newPassword) {
                return res.status(401).json({ message: 'Mật Khẩu Mới không được trùng với mật khẩu đã dùng trước đó !' });
            }
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: "Mật Khẩu mới và xác nhận mật khẩu không đúng !" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            const updatedUser = await User.findByIdAndUpdate(userId, { password: hashedPassword });

            if (updatedUser) {
                const updatedUserInfo = await User.findById(userId);
                return res.status(200).json({ message: 'Đổi mật khẩu thành công !', user: updatedUserInfo });
            } else {
                return res.status(401).json({ message: 'Người dùng không tồn tại !' });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Lỗi Hệ Thống' });
        }
    },
    deleteUser: async(req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            if (user) {
                return res.status(200).json({ message: 'Đã Xóa người dùng thành công. Lý Do: Chuyển Đi nơi khác !!' })
            } else {
                return res.status(401).json({ message: 'Người dùng không tồn tại !' });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Lỗi Hệ Thống' });
        }
    }
}
module.exports = userController;