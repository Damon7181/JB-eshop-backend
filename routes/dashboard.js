const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");

router.get("/", authMiddleware, (req, res) => {
  res.json({ message: `Welcome to the dashboard, user ${req.user.email}` });
});

module.exports = router;
