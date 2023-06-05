const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    phone: {
        type: Number,
        unique: true,
        require: true
    },
    password: {
        type: String,
    },
    apartment: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })
userSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true
})
module.exports = mongoose.model("User", userSchema)