const mongoose = require("mongoose");

const subFormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  note: { type: String },
  questions: [{ type: mongoose.Types.ObjectId, ref: "QuestionData" }],
  formID: { type: mongoose.Types.ObjectId, ref: "FormData" },
});

module.exports = mongoose.model("SubFormData", subFormSchema);
