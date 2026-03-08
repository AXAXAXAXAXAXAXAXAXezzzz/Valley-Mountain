const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log("Mongo URI not provided. Using in-memory mock store.");
    return;
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
};

module.exports = connectDB;
