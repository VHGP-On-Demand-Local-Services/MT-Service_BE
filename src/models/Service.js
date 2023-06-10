const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    icon_name: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    expected_price: {
        type: Number,
        require: true
    },
}, { timestamps: true })
serviceSchema.virtual('id').get(function() {
    return this._id.toHexString();
})
serviceSchema.set('toJSON', {
    virtuals: true
})
module.exports = mongoose.model("Service", serviceSchema)