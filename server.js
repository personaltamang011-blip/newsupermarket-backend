require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Enable CORS for all origins (important for frontend on Vercel or any domain)
app.use(cors({ origin: "*" }));

// ✅ Parse JSON body
app.use(express.json());

// ✅ MongoDB Atlas from .env (NO localhost DB)
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.log("❌ MONGO_URI not found in .env");
  process.exit(1);
}

// ✅ Connect to Atlas
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch(err => {
    console.log("❌ DB Error:", err);
    process.exit(1);
  });

// 📦 Schema
const OrderSchema = new mongoose.Schema({
  customer: String,
  phone: String,
  items: Array,
  total: Number,
  status: {
    type: String,
    default: "Pending"
  },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", OrderSchema);

// 🟢 Save order
app.post("/place-order", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    res.json({ success: true, message: "Order saved!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🔵 Get orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🔴 Delete Order
app.delete("/order/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Order deleted"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 🟡 Update Order Status
app.put("/order/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json({
      success: true,
      data: updated
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ✅ Dynamic PORT for Render or local computer
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});