const express = require("express");
const router = express.Router();
const Score = require("../models/Score");

router.get("/", async (req, res) => {
  try {
    const scores = await Score.find()
      .sort({ score: -1 })
      .limit(10);

    // add rank
    const ranked = scores.map((s, i) => ({
      rank: i + 1,
      username: s.username,
      score: s.score,
      category: s.category
    }));

    res.json(ranked);

  } catch (err) {
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
});

module.exports = router;