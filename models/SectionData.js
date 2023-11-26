const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  forms: [{ type: mongoose.Types.ObjectId, ref: "FormData" }],
});

module.exports = mongoose.model("SectionData", sectionSchema);
