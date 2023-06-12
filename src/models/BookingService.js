const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    booking_item: [{
        type: mongoose.Types.ObjectId,
        require: true,
        ref: 'BookingItems'
    }],
    user: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    totalPrice: {
        type: Number
    },
    dateBooking: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "Waiting"
    }
}, { timestamps: true })

bookingSchema.virtual('id').get(function() {
    return this._id.toString();
})

bookingSchema.set('toJSON', {
    virtuals: true
})

module.exports = mongoose.model('BookingService', bookingSchema)