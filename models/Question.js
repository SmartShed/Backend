const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionID: { type: mongoose.Types.ObjectId, ref: "QuestionData" },
  englishText: { type: String },
  hindiText: { type: String },
  ansType: { type: String, enum: ["string", "number", "boolean"] },
  isAnswered: { type: Boolean, default: false },
  // ans: { type: Union[(String, Number, Boolean)] },
  ans: { type: mongoose.Schema.Types.Mixed, default: null },
});

module.exports = mongoose.model("Question", questionSchema);
