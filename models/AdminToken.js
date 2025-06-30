const mongoose = require("mongoose");

const adminTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AdminToken", adminTokenSchema);
