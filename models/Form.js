const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const formSchema = mongoose.Schema({
  formID: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  questions: [{ type: String }],
  sectionID: [{ type: String }],
  submittedCount: { type: Number, default: 0 },
  lockStatus: { type: Boolean, default: false },
  access: [{ type: String }],
  createdBy: { type: String },
  submittedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  history: [
    {
      editedBy: { type: String },
      editedAt: { type: Date, default: Date.now },
      changes: [
        {
          questionID: { type: String },
          oldValue: { type: String },
          newValue: { type: String },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Form", formSchema);
