const mongoose = require('mongoose');

const authTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const AuthToken = mongoose.model('AuthToken', authTokenSchema);

module.exports = AuthToken;