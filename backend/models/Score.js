const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  userId: String,
  username: String,
  category: String,
  score: Number,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Score", scoreSchema);