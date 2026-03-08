const { products } = require("../data/store");

const makeProductCode = () => `VM-${Date.now().toString().slice(-8)}`;
const toNumberOr = (value, fallback) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const getProducts = (req, res) => {
  res.json(products);
};

const getProductById = (req, res) => {
  const product = products.find((item) => item._id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

const createProduct = (req, res) => {
  const payload = req.body;
  const product = {
    _id: `p_${Date.now()}`,
    productCode: payload.productCode || makeProductCode(),
    name: payload.name,
    category: payload.category,
    price: toNumberOr(payload.price, 0),
    logistics: toNumberOr(payload.logistics, 2),
    description: payload.description || "",
    images: payload.images || [],
    colors: payload.colors || [],
    sizes: payload.sizes || [],
    stock: toNumberOr(payload.stock, 0),
    isNew: !!payload.isNew,
    featured: !!payload.featured,
    popularity: toNumberOr(payload.popularity, 50),
    createdAt: new Date().toISOString(),
  };

  products.unshift(product);
  res.status(201).json(product);
};

const updateProduct = (req, res) => {
  const index = products.findIndex((item) => item._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });
  products[index] = {
    ...products[index],
    ...req.body,
    price: toNumberOr(req.body.price, products[index].price),
    logistics: toNumberOr(req.body.logistics, products[index].logistics ?? 2),
    stock: toNumberOr(req.body.stock, products[index].stock),
    popularity: toNumberOr(req.body.popularity, products[index].popularity ?? 50),
    _id: products[index]._id,
    productCode: req.body.productCode || products[index].productCode || makeProductCode(),
  };
  res.json(products[index]);
};

const deleteProduct = (req, res) => {
  const index = products.findIndex((item) => item._id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });
  const removed = products.splice(index, 1)[0];
  res.json({ message: "Product deleted", product: removed });
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
