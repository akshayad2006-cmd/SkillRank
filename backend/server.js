const express = require("express");
require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const profileRoutes = require("./routes/profile");
app.use("/api/profile", profileRoutes);
const scoreRoutes = require("./routes/score");
app.use("/api/score", scoreRoutes);
const leaderboardRoutes = require("./routes/leaderboard");
app.use("/api/leaderboard", leaderboardRoutes);
// connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});