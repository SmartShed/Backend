const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  textEnglish: { type: String, required: true },
  textHindi: { type: String, required: true },
  ansType: { type: String, enum: ["string", "number", "boolean"] },
  isSubForm: { type: Boolean, default: false },
  formID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FormData",
    required: false,
  },
  subFormID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubFormData",
    required: false,
  },
});

module.exports = mongoose.model("QuestionData", questionSchema);
