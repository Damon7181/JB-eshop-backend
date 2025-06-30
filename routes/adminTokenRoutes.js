// routes/adminTokenRoutes.js
const express = require("express");
const router = express.Router();
const AdminToken = require("../models/AdminToken.js");

router.post("/", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Token is required" });

  try {
    const exists = await AdminToken.findOne({ token });
    if (exists)
      return res.status(200).json({ message: "Token already exists" });

    const saved = await new AdminToken({ token }).save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error saving token", error: err.message });
  }
});

module.exports = router;
