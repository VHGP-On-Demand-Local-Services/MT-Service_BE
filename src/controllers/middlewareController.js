const jwt = require('jsonwebtoken');

const middlewareController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.ACCESS_KEY, (err, user) => {
                if (err) {
                    res.status(403).json({ message: 'Token is not valid !' })
                }
                req.user = user;
                next();
            })
        } else {
            res.status(401).json({ message: "You are not authenticatied !" })
        }
    },
    verifyTokenUser: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id = req.params.id) {
                next();
            } else {
                res.status(403).json({ message: 'You are not allowed to update other !' })
            }
        })
    },
    verifyTokenAdminFunction: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.isAdmin) {
                next()
            } else {
                res.status(403).json({ message: 'You can not perform this function !' })
            }
        })
    },
    verifyTokenisAdminandUser: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id == req.params.id || req.user.isAdmin) {
                next();
            } else {
                res.status(403).json({ message: 'You are not allowed to delete other !' })
            }
        })
    },
};
module.exports = middlewareController;