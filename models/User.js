const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    userID: { type: String, required: true },
    name: { type: String, required: true },
    phoneNo: { type: String },
    address: { type: String },
    role: { type: String, enum: ['authority', 'supervisor', 'worker'], required: true },
    password: { type: String, required: true },
    forms: [{ type: Schema.Types.ObjectId, ref: 'Form' }],
});

module.exports = mongoose.model('User', userSchema);