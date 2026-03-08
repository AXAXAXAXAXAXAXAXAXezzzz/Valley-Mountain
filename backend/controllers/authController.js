const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { users } = require("../data/store");

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || "super_secret_change_me", { expiresIn: "7d" });

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: !!user.isAdmin,
});

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });

  const exists = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (exists) return res.status(400).json({ message: "User already exists" });

  const user = {
    _id: `u_${Date.now()}`,
    name,
    email,
    password: await bcrypt.hash(password, 10),
    isAdmin: false,
  };
  users.push(user);

  res.status(201).json({
    token: signToken(user._id),
    user: sanitizeUser(user),
  });
};

const login = async (req, res) => {
  const emailInput = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  // Hard fallback admin credentials for local development.
  if (emailInput === "admin" && password === "admin1") {
    const adminUser = users.find((item) => item._id === "u_admin") || {
      _id: "u_admin",
      name: "Admin",
      email: "admin",
      isAdmin: true,
    };
    return res.json({
      token: signToken(adminUser._id),
      user: sanitizeUser(adminUser),
    });
  }

  const user = users.find((item) => item.email.toLowerCase() === emailInput);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    token: signToken(user._id),
    user: sanitizeUser(user),
  });
};

module.exports = { register, login, sanitizeUser };
