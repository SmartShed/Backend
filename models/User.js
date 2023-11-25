const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  userID: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNo: { type: String },
  address: { type: String },
  position: {
    type: String,
    enum: ["authority", "supervisor", "worker"],
    required: true,
  },
  password: { type: String, required: true },
  isGoogle: { type: Boolean, default: false },
  forms: [{ type: String }],
});

module.exports = mongoose.model("User", userSchema);
