// const express = require("express");
// const Order = require("../models/Order.js");
// const admin = require("../firebase-admin-config.js");
// const AdminToken = require("../models/AdminToken");

// const router = express.Router();

// // GET all orders
// router.get("/", async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // POST new order
// router.post("/", async (req, res) => {
//   const {
//     customerName,
//     customerEmail,
//     deliveryAddress,
//     products,
//     totalAmount,
//   } = req.body;

//   if (
//     !customerName ||
//     !customerEmail ||
//     !deliveryAddress ||
//     !products ||
//     !totalAmount
//   ) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   const newOrder = new Order({
//     customerName,
//     customerEmail,
//     deliveryAddress,
//     products,
//     totalAmount,
//   });

//   try {
//     // const savedOrder = await newOrder.save();

//     // // 🔔 Send Push Notification to Admin
//     // const message = {
//     //   notification: {
//     //     title: "New Order Received",
//     //     body: `Order from ${customerName}`,
//     //   },
//     //   token: "eyLlQFw9zzGMVs--lgTP_R:APA91bF9EytcKHHEzPWQL2mthI7jocmVXpDjaevAkWSqKvzciWWJTxwMP3HzLOK8T2xsJ4vsE5lhukrMkyUmkMP4wLR_pSnuBaxa_xgSVydbOLLnIkX2LeE", // 🔁 Replace with actual token
//     // };

//     // admin
//     //   .messaging()
//     //   .send(message)
//     //   .then((response) => {
//     //     console.log("Push notification sent:", response);
//     //   })
//     //   .catch((err) => {
//     //     console.error("Push notification failed:", err);
//     //   });
//     const savedOrder = await newOrder.save();

//     const tokens = await AdminToken.find();

//     const notifications = tokens.map((t) => ({
//       notification: {
//         title: "New Order Received",
//         body: `Order from ${customerName}`,
//       },
//       token: t.token,
//     }));

//     for (const message of notifications) {
//       admin
//         .messaging()
//         .send(message)
//         .then((response) => {
//           console.log("✅ Notification sent:", response);
//         })
//         .catch((err) => {
//           console.error("❌ Failed to send notification:", err);
//         });
//     }

//     res.status(201).json(savedOrder);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
//   await Notification.create({
//     title: "New Order Received",
//     body: `Order from ${customerName}`,
//   });
// });

module.exports = router;

const express = require("express");
const Order = require("../models/Order.js");
const admin = require("../firebase-admin-config.js");
const AdminToken = require("../models/AdminToken");
const Notification = require("../models/Notification.js"); // ✅ Needed to save notifications in DB

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

  try {
    const newOrder = new Order({
      customerName,
      customerEmail,
      deliveryAddress,
      products,
      totalAmount,
    });

    const savedOrder = await newOrder.save();

    // 🔥 Push Notification to FCM Admin Tokens
    const tokens = await AdminToken.find();

    const messages = tokens.map((t) => ({
      notification: {
        title: "New Order Received",
        body: `Order from ${customerName}`,
      },
      token: t.token,
    }));

    for (const msg of messages) {
      admin
        .messaging()
        .send(msg)
        .then((response) => {
          console.log("✅ Push notification sent:", response);
        })
        .catch((err) => {
          console.error("❌ Push notification failed:", err);
        });
    }

    // 🧠 Save notification in MongoDB
    await Notification.create({
      title: "New Order Received",
      body: `Order from ${customerName}`,
    });

    // ⚡ Emit real-time event via Socket.IO to admin dashboard
    const io = req.app.locals.io;
    if (io) {
      io.emit("new-order", {
        title: "New Order Received",
        body: `Order from ${customerName}`,
        orderId: savedOrder._id,
      });
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
