const express = require("express");
const { getUsers, createUser, deleteUser } = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, getUsers);
router.post("/", protect, adminOnly, createUser);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
