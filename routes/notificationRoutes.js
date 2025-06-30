// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

router.get("/", async (req, res) => {
  const notifications = await Notification.find().sort({ timestamp: -1 });
  res.json(notifications);
});

module.exports = router;
