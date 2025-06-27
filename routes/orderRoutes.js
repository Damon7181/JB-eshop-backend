const express = require("express");
const Order = require("../models/Order.js");
const admin = require("../firebase-admin-config.js"); // 👈 import admin

const router = express.Router();

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new order
router.post("/", async (req, res) => {
  const {
    customerName,
    customerEmail,
    deliveryAddress,
    products,
    totalAmount,
  } = req.body;

  if (
    !customerName ||
    !customerEmail ||
    !deliveryAddress ||
    !products ||
    !totalAmount
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newOrder = new Order({
    customerName,
    customerEmail,
    deliveryAddress,
    products,
    totalAmount,
  });

  try {
    const savedOrder = await newOrder.save();

    // 🔔 Send Push Notification to Admin
    const message = {
      notification: {
        title: "New Order Received",
        body: `Order from ${customerName}`,
      },
      token: "ADMIN_DEVICE_FCM_TOKEN_HERE", // 🔁 Replace with actual token
    };

    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("Push notification sent:", response);
      })
      .catch((err) => {
        console.error("Push notification failed:", err);
      });

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
