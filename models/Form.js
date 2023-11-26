const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  formID: { type: mongoose.Types.ObjectId, ref: "FormData" },
  title: { type: String, required: true },
  description: { type: String },
  questions: [{ type: mongoose.Types.ObjectId, ref: "Question" }],
  submittedCount: { type: Number, default: 0 },
  lockStatus: { type: Boolean, default: false },
  access: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
  submittedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  history: [
    {
      editedBy: { type: mongoose.Types.ObjectId, ref: "User" },
      editedAt: { type: Date, default: Date.now },
      changes: [
        {
          questionID: { type: mongoose.Types.ObjectId, ref: "Question" },
          oldValue: { type: String },
          newValue: { type: String },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Form", formSchema);
