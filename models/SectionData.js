const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
    sectionID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    logo: { type: String }, // Assuming logo is a file path or URL
    forms: [{ type: Number }],
});



module.exports = mongoose.model('SectionData', sectionSchema);
