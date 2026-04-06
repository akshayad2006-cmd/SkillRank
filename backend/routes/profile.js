const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Score = require("../models/Score");

router.get("/", async (req, res) => {
  const token = req.headers["authorization"];

  try {
    const decoded = jwt.verify(token, "secretkey");

    const scores = await Score.find({ userId: decoded.id });

    res.json({
      username: decoded.username,
      email: decoded.email,
      attempts: scores.length
    });

  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;