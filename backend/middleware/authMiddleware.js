const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const verified = jwt.verify(token, "secretkey");
    req.user = verified;   // ⭐ IMPORTANT
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;