const express = require("express");
const { getTickets, createTicket, updateTicket } = require("../controllers/supportController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getTickets);
router.post("/", protect, createTicket);
router.patch("/:id", protect, adminOnly, updateTicket);

module.exports = router;
