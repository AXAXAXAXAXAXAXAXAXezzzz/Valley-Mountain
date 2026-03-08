const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/products", require("./routes/productRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/users", require("./routes/usersRoutes"));
app.use("/orders", require("./routes/orderRoutes"));
app.use("/upload", require("./routes/uploadRoutes"));
app.use("/reviews", require("./routes/reviewRoutes"));
app.use("/support", require("./routes/supportRoutes"));

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "VELOR API is running" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
