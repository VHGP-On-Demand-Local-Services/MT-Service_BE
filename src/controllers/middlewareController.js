const jwt = require('jsonwebtoken');

const middlewareController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.ACCESS_KEY, (err, user) => {
                if (err) {
                    res.status(403).json({ message: 'Mã Xác Thực Không Hợp Lệ !' })
                }
                req.user = user;
                next();
            })
        } else {
            res.status(401).json({ message: "Bạn phải đăng nhập để tiếp tục !" })
        }
    },
    verifyTokenUser: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id == req.params.id) {
                next();
            } else {
                res.status(403).json({ message: 'Bạn Không Thể Thực Hiện Chức Năng Này !' })
            }
        })
    },
    verifyTokenAdminFunction: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.admin) {
                next()
            } else {
                res.status(403).json({ message: 'Bạn Không Thể Thực Hiện Chức Năng Này !' })
            }
        })
    },
    verifyTokenisAdminandUser: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id == req.params.id || req.user.admin) {
                next();
            } else {
                res.status(403).json({ message: 'Bạn Không Thể Thực Hiện Chức Năng Này !' })
            }
        })
    },
};
module.exports = middlewareController;