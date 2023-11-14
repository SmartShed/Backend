const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formSchema = mongoose.Schema({
    formID: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [{ type: String }],
    sectionID: [{ type: String }],
});

module.exports = mongoose.model('FormData', formSchema);