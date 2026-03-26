const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Use MongoDB Atlas (NOT localhost)
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch(err => {
    console.log("❌ DB Error:", err);
    process.exit(1);
  });

// Schema
const OrderSchema = new mongoose.Schema({
  customer: String,
  phone: String,
  items: Array,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", OrderSchema);

// Save order
app.post("/place-order", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    res.json({ success: true, message: "Order saved!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Dynamic PORT (required for Render)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});