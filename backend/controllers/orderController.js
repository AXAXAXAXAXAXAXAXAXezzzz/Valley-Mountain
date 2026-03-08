const { orders } = require("../data/store");

const getOrders = (req, res) => {
  if (req.user.isAdmin) return res.json(orders);
  const myOrders = orders.filter((order) => order.userId === req.user._id);
  return res.json(myOrders);
};

const createOrder = (req, res) => {
  const order = {
    _id: `o_${Date.now()}`,
    userId: req.user._id,
    customer: req.body.customer || {},
    items: req.body.items || [],
    totalAmount: Number(req.body.totalAmount || 0),
    paymentMethod: req.body.customer?.paymentMethod || "card",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  orders.unshift(order);
  res.status(201).json(order);
};

module.exports = { getOrders, createOrder };
