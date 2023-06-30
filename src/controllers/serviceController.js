const Service = require('../models/Service');

const serviceController = {
    createService: async(req, res) => {
        try {
            const { icon_name, name, expected_price } = req.body;

            function validateName(name) {
                const re = /^[a-zA-ZÀ-Ỹà-ỹẠ-Ỵạ-ỵĂăÂâĐđÊêÔôƠơƯư\s]+$/;
                return re.test(name);
            }

            if (!validateName(name)) {
                return res.status(400).json({ message: 'Tên Không Hợp Lệ!' });
            }

            if (!/^\d{1,3}(,\d{3})*(\.\d+)?$/.test(expected_price) && !/^\d+$/.test(expected_price)) {
                return res.status(400).json({ message: 'Tiền bạn nhập không hợp lệ!' });
            }

            if (!name.trim() || !icon_name.trim() || !expected_price) {
                return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin !' });
            }
            const existService = await Service.findOne({
                name: req.body.name.trim()
            });
            if (existService) {
                return res.status(400).json({ message: 'Dịch Vụ này đã tồn tại !' })
            }
            const newService = new Service({
                icon_name: icon_name.trim(),
                name: name.trim(),
                expected_price: expected_price
            });

            const service = await newService.save();
            res.status(200).json(service);
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Lỗi Hệ Thống' });
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
            res.status(500).json({ message: 'Lỗi Hệ Thống' });
        }
    },
    getServicebyId: async(req, res) => {
        try {
            const serviceId = req.params.id;
            // Kiểm tra nếu serviceId là 'search'
            if (serviceId === 'search') {
                // Gọi hàm searchService từ đối tượng serviceController
                return serviceController.searchService(req, res);
            }

            const service = await Service.findById(serviceId);

            if (!service) {
                return res.status(404).json({ message: 'Dịch Vụ Không Tồn Tại!' });
            }

            res.status(200).json(service);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Lỗi Hệ Thống' });
        }
    },
    searchService: async(req, res) => {
        try {
            const keyword = req.query.keyword; // Thay đổi tại đây
            const nameRegex = new RegExp(keyword, 'i');

            const services = await Service.find({ name: nameRegex });

            res.status(200).json({ services });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi Hệ Thống' });
        }
    },
    updateService: async(req, res) => {
        try {
            const { icon_name, name, expected_price } = req.body

            function validateName(name) {
                const re = /^[a-zA-ZÀ-Ỹà-ỹẠ-Ỵạ-ỵĂăÂâĐđÊêÔôƠơƯư\s]+$/;
                return re.test(name);
            }

            if (!validateName(name)) {
                return res.status(400).json({ message: 'Tên Dịch Vụ Không Hợp Lệ!' });
            }
            if (!/^\d{1,3}(,\d{3})*(\.\d+)?$/.test(expected_price) && !/^\d+$/.test(expected_price)) {
                return res.status(400).json({ message: 'Tiền bạn nhập không hợp lệ!' });
            }

            if (!name.trim() || !icon_name.trim() || !expected_price) {
                return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin !' });
            }
            const existService = await Service.findOne({
                name: req.body.name.trim()
            });
            if (existService && existService._id.toString() !== req.params.id) {
                return res.status(400).json({ message: 'Dịch Vụ Đã Tồn Tại !' })
            }

            const updateService = await Service.findByIdAndUpdate(req.params.id, {
                icon_name: icon_name.trim(),
                name: name.trim(),
                expected_price: expected_price
            })
            if (updateService) {
                const updateService = await Service.findById(req.params.id);
                return res.status(200).json(updateService);
            } else {
                return res.status(401).json({ message: 'Dịch Vụ Không Tồn Tại !' });
            }
        } catch (err) {
            res.status(500).json({ message: 'Lỗi Hệ Thống !' });
        }
    },
    deleteService: async(req, res) => {
        try {
            const service = await Service.findByIdAndDelete(req.params.id)
            if (service) {
                return res.status(200).json({ message: 'Xóa Dịch Vụ Thành Công !' })
            } else {
                return res.status(401).json({ message: 'Dịch Vụ Không Tồn Tại !' });
            }
        } catch (err) {
            res.status(500).json({ message: 'Lỗi Hệ Thống' });
        }
    }
};

module.exports = serviceController;