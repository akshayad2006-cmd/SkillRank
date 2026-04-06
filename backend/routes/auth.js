const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 🔴 VALIDATION (IMPORTANT)
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields (username, email, password) are required"
      });
    }

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });

  } catch (error) {
    console.log("🔥 Signup Error:", error);   // ⭐ VERY IMPORTANT
    res.status(500).json({ message: "Server error" });
  }
});
// LOGIN
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // create token
    const token = jwt.sign(
  {
    id: user._id,
    username: user.username,
    email: user.email
  },
  "secretkey",
  { expiresIn: "1h" }
);

    res.json({ message: "Login successful", token });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// middleware to verify token
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const verified = jwt.verify(token, "secretkey");
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// PROTECTED DASHBOARD
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      message: "Welcome to dashboard",
      username: req.user.username,
      email: req.user.email
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;