const express = require("express");
const router = express.Router();
const Score = require("../models/Score");

// GET LEADERBOARD
router.get("/", async (req, res) => {
  try {
    const data = await Score.find().sort({ score: -1 }).limit(10);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
});

module.exports = router;