const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  englishText: { type: String },
  hindiText: { type: String },
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
