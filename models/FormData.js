const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formSchema = mongoose.Schema({
    formID: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    sectionID: [{ type: Schema.Types.ObjectId, ref: 'Section' }],
});

module.exports = mongoose.model('FormData', formSchema);