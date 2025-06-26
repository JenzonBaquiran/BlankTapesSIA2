const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "staff", "customer"], default: "customer" },
  email: { type: String },
  status: { type: String, default: "active" },
  created: { type: String },
  lastLogin: { type: String }
});

module.exports = mongoose.model("User", userSchema);