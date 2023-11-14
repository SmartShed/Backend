const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const questionSchema = mongoose.Schema({
    questionID: { type: String, required: true },
    questionText: { type: String, required: true },
    ansType: { type: String, enum: ['string', 'numeric'], required: true },
});

module.exports = mongoose.model('QuestionData', questionSchema);