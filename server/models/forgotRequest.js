const mongoose = require("mongoose");

const forgotRequestSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: String,
  requestedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "approved", "declined", "used"], default: "pending" }
});

module.exports = mongoose.model("ForgotRequest", forgotRequestSchema);