const { reviews } = require("../data/store");

const getReviews = (req, res) => {
  const { productId } = req.query;
  const list = productId ? reviews.filter((item) => item.productId === productId) : reviews;
  res.json([...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
};

const createReview = (req, res) => {
  const { productId, productName, rating = 5, message = "", image = "" } = req.body;
  if (!productId) return res.status(400).json({ message: "productId is required" });

  const review = {
    _id: `r_${Date.now()}`,
    productId,
    productName: productName || "",
    userId: req.user._id,
    userName: req.user.name,
    userEmail: req.user.email,
    rating: Math.max(1, Math.min(5, Number(rating || 5))),
    message: String(message || "").trim(),
    image: String(image || "").trim(),
    createdAt: new Date().toISOString(),
  };

  reviews.unshift(review);
  res.status(201).json(review);
};

const deleteReview = (req, res) => {
  const index = reviews.findIndex((item) => item._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Review not found" });
  const [removed] = reviews.splice(index, 1);
  res.json({ message: "Review removed", review: removed });
};

module.exports = { getReviews, createReview, deleteReview };
