const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    /* The `expireAt` field in the `OtpSchema` is used to set an expiration time for the OTP (One-Time
    Password) document in the MongoDB collection. */
    expireAt: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('Otp', OtpSchema);