const mongoose = require('mongoose')

const booking_itemSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        default: 1
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }
}, { timestamps: true });

booking_itemSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

booking_itemSchema.set('toJSON', {
    virtuals: true
})

module.exports = mongoose.model('BookingItems', booking_itemSchema);