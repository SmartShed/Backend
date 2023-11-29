const mongoose = require("mongoose");

const subFormSchema = new mongoose.Schema({
  titleHindi: { type: String, default: "" },
  titleEnglish: { type: String, default: "" },
  note: { type: String },
  questions: [{ type: mongoose.Types.ObjectId, ref: "QuestionData" }],
  formID: { type: mongoose.Types.ObjectId, ref: "FormData" },
});

module.exports = mongoose.model("SubFormData", subFormSchema);
