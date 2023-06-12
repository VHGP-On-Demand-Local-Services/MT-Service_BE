const Service = require('../models/Service');

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
    },
    getAllService: async(req, res) => {
        try {
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 6

            const startIndex = (page - 1) * limit
            const endIndex = page * limit

            const services = await Service.find().skip(startIndex).limit(limit)
            const totalService = await Service.countDocuments()

            const pagination = {}

            if (endIndex < totalService) {
                pagination.next = {
                    page: page + 1,
                    limit: limit
                }
            }
            if (startIndex > 0) {
                page.prev = {
                    page: page - 1,
                    limit: limit
                }
            }
            res.status(200).json({
                pagination,
                services
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Server Error !' })
        }
    },
    getServicebyId: async(req, res) => {
        try {
            const service = await Service.findById(req.params.id);
            if (service) {
                return res.status(200).json(service)
            } else {
                return res.status(400).json({ message: 'Service does not Exist !' })
            }
        } catch (err) {
            res.status(500).json({ message: 'Server Error !' })
        }
    },
    updateService: async(req, res) => {
        try {
            const { icon_name, name, expected_price } = req.body

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
            if (existService && existService._id.toString() !== req.params.id) {
                return res.status(400).json({ message: 'Service alredy Existing !' })
            }

            const updateService = await Service.findByIdAndUpdate(req.params.id, {
                icon_name: icon_name,
                name: name,
                expected_price: expected_price
            })
            if (updateService) {
                const updateService = await Service.findById(req.params.id);
                return res.status(200).json(updateService);
            } else {
                return res.status(401).json({ message: 'User does not exist!' });
            }
        } catch (err) {
            res.status(500).json({ message: 'Server Error !' })
        }
    },
    deleteService: async(req, res) => {
        try {
            const service = await Service.findByIdAndDelete(req.params.id)
            if (service) {
                return res.status(200).json({ message: 'Delete Successfully !' })
            } else {
                return res.status(401).json({ message: 'Service does not exists !' })
            }
        } catch (err) {
            res.status(500).json({ message: 'Server Error !' })
        }
    }
};

module.exports = serviceController;