const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNo: { type: String },
  address: { type: String },
  position: {
    type: String,
    enum: ["authority", "supervisor", "worker"],
    required: true,
  },
  section: {
    type: String,
  },
  password: { type: String, required: true },
  isGoogle: { type: Boolean, default: false },
  forms: [{ type: mongoose.Types.ObjectId, ref: "Form" }],
});

module.exports = mongoose.model("User", userSchema);




