const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const subFormSchema = new Schema({
    subFormID: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    note: { type: String },
    questions: [{ type: String }],
    formID: [{ type: String }],
});

module.exports = mongoose.model("SubFormData", subFormSchema);

