const { supportTickets } = require("../data/store");

const getTickets = (req, res) => {
  if (req.user?.isAdmin) return res.json([...supportTickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  const own = supportTickets.filter((item) => item.userId === req.user._id);
  res.json([...own].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
};

const createTicket = (req, res) => {
  const { subject = "", message = "", image = "" } = req.body;
  if (!subject.trim() || !message.trim()) return res.status(400).json({ message: "Subject and message are required" });

  const ticket = {
    _id: `t_${Date.now()}`,
    userId: req.user._id,
    userName: req.user.name,
    userEmail: req.user.email,
    subject: subject.trim(),
    message: message.trim(),
    image: String(image || "").trim(),
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  supportTickets.unshift(ticket);
  res.status(201).json(ticket);
};

const updateTicket = (req, res) => {
  const index = supportTickets.findIndex((item) => item._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Ticket not found" });

  supportTickets[index] = {
    ...supportTickets[index],
    status: req.body.status || supportTickets[index].status,
    updatedAt: new Date().toISOString(),
  };

  res.json(supportTickets[index]);
};

module.exports = { getTickets, createTicket, updateTicket };
