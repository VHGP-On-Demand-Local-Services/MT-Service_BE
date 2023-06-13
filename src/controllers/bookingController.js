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
                return newBookingItem._id
            }));
            const bookingItemsIdsResolved = await bookingItemsIds;
            const totalPrices = await Promise.all(bookingItemsIdsResolved.map(async(bookingItemId) => {
                const bookingItem = await BookingItem.findById(bookingItemId).populate('service', 'expected_price');
                const totalPrice = bookingItem.service.expected_price * bookingItem.quantity;
                return totalPrice;
            }));
            const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

            let booking = new BookingService({
                booking_item: bookingItemsIdsResolved,
                user: req.body.user,
                totalPrice: totalPrice,
                dateBooking: req.body.dateBooking,
                status: req.body.status
            });
            booking = await booking.save();
            if (!booking) {
                return res.status(401).json({ message: 'Cannot Booking Service! Please try again!' });
            }
            res.status(200).json(booking);
        } catch (err) {
            console.log(err)
            res.status(500).json('Server Error!');
        }
    }
};
module.exports = bookingController;