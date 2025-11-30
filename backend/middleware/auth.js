const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authRequired = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header)
    return res.status(401).json({ message: "No token provided" });

  const token = header.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden" });
    }
    next();
  };
};

// Aliases for compatibility
const auth = authRequired;
const adminAuth = (req, res, next) => requireRole(['admin'])(req, res, next);

module.exports = { authRequired, auth, requireRole, adminAuth };