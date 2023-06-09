const express = require('express');
const BookingItem = require('../models/BookingItems');
const BookingService = require('../models/BookingService');
const bookingController = {
    createBooking: async(req, res) => {
        try {
            const bookingItemsIds = await Promise.all(req.body.bookingItems.map(async(bookingItem) => {
                let newBookingItem = new BookingItem({
                    quantity: bookingItem.quantity,
                    service: bookingItem.service,
                    status_duff: bookingItem.status_duff,
                });
                newBookingItem = await newBookingItem.save();
                return newBookingItem._id;
            }));

            const bookingItemsIdsResolved = await bookingItemsIds;

            const totalPrices = await Promise.all(bookingItemsIdsResolved.map(async(bookingItemId) => {
                const bookingItem = await BookingItem.findById(bookingItemId).populate('service', 'expected_price');
                const totalPrice = bookingItem.service.expected_price * bookingItem.quantity;
                return totalPrice;
            }));

            const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

            const dateBooking = new Date(req.body.dateBooking);
            const currentDate = new Date();

            if (dateBooking <= currentDate) {
                return res.status(400).json({ message: 'Ngày nhận đặt phải lớn hơn ngày hiện tại.' });
            }

            const existingBookings = await BookingService.find({
                user: req.body.user,
                dateBooking: {
                    $gte: new Date(dateBooking.getTime() - 30 * 60 * 1000), // Giảm 30 phút từ ngày đặt
                    $lt: new Date(dateBooking.getTime() + 30 * 60 * 1000), // Tăng 30 phút từ ngày đặt
                },
            });

            if (existingBookings.length > 0) {
                return res.status(400).json({ message: 'Bạn đã đặt một dịch vụ khác trong khoảng thời gian này.' });
            }

            let booking = new BookingService({
                booking_item: bookingItemsIdsResolved,
                user: req.body.user,
                totalPrice: totalPrice,
                dateBooking: req.body.dateBooking,
                status: req.body.status,
            });

            booking = await booking.save();

            if (!booking) {
                return res.status(401).json({ message: 'Không thể đặt dịch vụ! Vui lòng thử lại.' });
            }

            res.status(200).json(booking);
        } catch (err) {
            console.log(err);
            res.status(500).json('Lỗi máy chủ!');
        }
    },

    getAllBooking: async(req, res) => {
        try {
            const bookingList = await BookingService.find()
                .populate({
                    path: 'user',
                    select: 'name phone apartment',
                })
                .populate({
                    path: 'booking_item',
                    select: 'status_duff',
                    populate: {
                        path: 'service',
                        select: 'name',
                    },
                })
                .sort({ dateBooking: -1 });

            if (bookingList.length === 0) {
                return res.status(404).json({ message: 'Đơn Hàng không tồn tại!' });
            }

            res.status(200).json(bookingList);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getBookingById: async(req, res) => {
        try {
            const bookingId = req.params.id;
            const booking = await BookingService.findById(bookingId)
                .populate({
                    path: 'booking_item',
                    populate: {
                        path: 'service',
                        select: 'name expected_price',
                    },
                })
                .populate('user', 'name phone apartment');

            if (!booking) {
                return res.status(404).json({ message: 'Đơn Hàng không tồn tại!' });
            }

            res.status(200).json(booking);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getBookingUserId: async(req, res) => {
        try {
            const userBooking = await BookingService.find({
                user: req.params.userId
            }).populate({
                path: 'booking_item',
                populate: {
                    path: 'service',
                    populate: 'name expected_price'
                }
            }).sort({ dateBooking: -1 });

            if (userBooking.length === 0) {
                return res.status(404).json({ message: 'Không có lịch hẹn từ người dùng này!' });
            }
            res.status(200).json(userBooking);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateBookingStatus: async(req, res) => {
        try {
            const booking = await BookingService.findByIdAndUpdate(
                req.params.id, {
                    status: req.body.status
                }, { new: true }
            )
            if (booking) {
                const bookingUpdateStatus = await BookingService.findById(req.params.id)
                    .populate({
                        path: 'booking_item',
                        populate: {
                            path: 'service',
                            select: 'name expected_price'
                        },
                    })
                    .populate('user', 'name phone apartment');
                return res.status(200).json(bookingUpdateStatus)
            } else {
                return res.status(401).json({ message: 'Đơn Hàng không thể cập nhật!' })
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteBooking: async(req, res) => {
        try {
            const booking = await BookingService.findByIdAndRemove(req.params.id);
            if (booking) {
                await Promise.all(
                    booking.booking_item.map(async(bookingItem) => {
                        await BookingItem.findByIdAndRemove(bookingItem);
                    })
                );
                return res.status(200).json({ message: 'Hủy thành công!' });
            } else {
                return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


};
module.exports = bookingController;