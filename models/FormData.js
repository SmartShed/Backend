const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subForms: [{ type: mongoose.Types.ObjectId, ref: "SubFormData" }],
  questions: [{ type: mongoose.Types.ObjectId, ref: "QuestionData" }],
  sectionID: { type: mongoose.Types.ObjectId, ref: "SectionData" },
});

module.exports = mongoose.model("FormData", formSchema);
