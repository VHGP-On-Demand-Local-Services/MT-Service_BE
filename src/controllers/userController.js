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

}
module.exports = userController;