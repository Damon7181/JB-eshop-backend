// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: String,
  body: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
