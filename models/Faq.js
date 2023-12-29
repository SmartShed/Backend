const mongoose = require("mongoose");

const FaqSchema = new mongoose.Schema({
  questionEnglish: { type: String, default: "" },
  questionHindi: { type: String, default: "" },
  answerEnglish: { type: String, default: "" },
  answerHindi: { type: String, default: "" },
  positions: [
    {
      type: String,
      enum: ["authority", "supervisor", "worker"],
      required: true,
    },
  ],
});

module.exports = mongoose.model("Faq", FaqSchema);
