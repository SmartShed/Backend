const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionID: { type: mongoose.Types.ObjectId, ref: "QuestionData" },
  textEnglish: { type: String, required: true },
  textHindi: { type: String, required: true },
  ansType: { type: String, enum: ["string", "number", "boolean"] },
  isAnswered: { type: Boolean, default: false },
  ans: { type: mongoose.Schema.Types.Mixed, default: null },
});

module.exports = mongoose.model("Question", questionSchema);
