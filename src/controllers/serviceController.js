const Service = require('../models/service');

const serviceController = {
    createService: async(req, res) => {
        try {
            const { icon_name, name, expected_price } = req.body;

            function validateName(name) {
                const re = /^[a-zA-Z ]*$/;
                return re.test(name);
            }

            if (!validateName(name)) {
                return res.status(400).json({ message: 'Invalid name!' });
            }

            if (!/^\d+$/.test(expected_price)) {
                return res.status(400).json({ message: 'Expected price can only contain numbers!' });
            }

            if (!name || !icon_name || !expected_price) {
                return res.status(400).json({ message: 'Please provide all required information!' });
            }
            const existService = await Service.findOne({
                name: req.body.name
            });
            if (existService) {
                return res.status(400).json({ message: 'Service alredy Existing !' })
            }
            const newService = new Service({
                icon_name: icon_name,
                name: name,
                expected_price: expected_price
            });

            const service = await newService.save();
            res.status(200).json(service);
        } catch (err) {
            res.status(500).json({ message: 'Server Error!' });
        }
    }
};

module.exports = serviceController;