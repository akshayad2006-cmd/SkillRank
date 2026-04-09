const express = require("express");
const router = express.Router();
const Score = require("../models/Score");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
// SAVE SCORE WITH REAL USER
router.post("/save", authMiddleware, async (req, res) => {
  const token = req.headers["authorization"];

  try {
    const decoded = jwt.verify(token, "secretkey");

    const { category, score, total } = req.body;

    const newScore = new Score({
      userId: decoded.id,
      username: decoded.username,
      category,
      score,
      total
    });

    await newScore.save();

    res.json({ message: "Score saved" });

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// GET USER STATS
router.get("/stats", authMiddleware,async (req, res) => {
  const token = req.headers["authorization"];

  try {
    const decoded = jwt.verify(token, "secretkey");

    const scores = await Score.find({ userId: decoded.id });

    let totalQuizzes = scores.length;

    let highest = 0;
    let sum = 0;

    scores.forEach(s => {
      let percent = (s.score / s.total) * 100;
      if (percent > highest) highest = percent;
      sum += percent;
    });

    let average = totalQuizzes ? (sum / totalQuizzes).toFixed(1) : 0;

    res.json({
      totalQuizzes,
      highest: highest.toFixed(1),
      average
    });

  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});
router.get("/recent", authMiddleware,async (req, res) => {
  try {
    const data = await Score.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3);

    res.json(data);
  } catch {
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;