const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// 🟢 Get all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch notifications", error: err.message });
  }
});

// 🟢 Get the latest notification (used for polling)
router.get("/latest", async (req, res) => {
  try {
    const latest = await Notification.findOne().sort({ createdAt: -1 });
    res.json(latest || {});
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Failed to fetch latest notification",
        error: err.message,
      });
  }
});

// 🟢 Create/save a new notification
router.post("/", async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required" });
  }

  try {
    const notification = new Notification({ title, body });
    const saved = await notification.save();
    res.status(201).json(saved);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to save notification", error: err.message });
  }
});

module.exports = router;
