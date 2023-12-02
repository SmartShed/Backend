const mongoose = require("mongoose");

const subFormSchema = new mongoose.Schema({
    subFormID: { type: mongoose.Types.ObjectId, ref: "SubFormData" },
    titleHindi: { type: String, default: "" },
    titleEnglish: { type: String, default: "" },
    note: { type: String },
    questions: [{ type: mongoose.Types.ObjectId, ref: "Question" }],
    formID: { type: mongoose.Types.ObjectId, ref: "FormData" },
});

module.exports = mongoose.model("SubForm", subFormSchema);
