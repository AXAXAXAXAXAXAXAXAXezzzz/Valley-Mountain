const jwt = require("jsonwebtoken");
const { users } = require("../data/store");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_change_me");
    const user = users.find((item) => item._id === decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).json({ message: "Admin access required" });
  next();
};

module.exports = { protect, adminOnly };
