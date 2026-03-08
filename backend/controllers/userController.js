const bcrypt = require("bcryptjs");
const { users } = require("../data/store");
const { sanitizeUser } = require("./authController");

const getProfile = (req, res) => {
  res.json(sanitizeUser(req.user));
};

const getUsers = (req, res) => {
  res.json(users.map(sanitizeUser));
};

const createUser = async (req, res) => {
  const { name, email, password, isAdmin = false } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });

  const normalized = String(email).trim().toLowerCase();
  const exists = users.find((user) => user.email.toLowerCase() === normalized);
  if (exists) return res.status(400).json({ message: "User already exists" });

  const user = {
    _id: `u_${Date.now()}`,
    name: String(name).trim(),
    email: normalized,
    password: await bcrypt.hash(String(password), 10),
    isAdmin: !!isAdmin,
  };
  users.push(user);
  res.status(201).json(sanitizeUser(user));
};

const deleteUser = (req, res) => {
  const index = users.findIndex((user) => user._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "User not found" });
  if (users[index]._id === "u_admin") return res.status(400).json({ message: "Default admin cannot be deleted" });
  const [removed] = users.splice(index, 1);
  res.json({ message: "User removed", user: sanitizeUser(removed) });
};

module.exports = { getProfile, getUsers, createUser, deleteUser };
