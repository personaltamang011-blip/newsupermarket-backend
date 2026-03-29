require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ CORS (important for frontend connection)
app.use(cors({ origin: "*" }));

// ✅ JSON parser
app.use(express.json());

// ✅ MongoDB Atlas from .env
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.log("❌ MONGO_URI not found in .env");
  process.exit(1);
}

// ✅ Connect DB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch(err => {
    console.log("❌ DB Error:", err);
    process.exit(1);
  });

/* ================= SCHEMA ================= */
const OrderSchema = new mongoose.Schema({
  customer: String,
  phone: String,
  items: [
    {
      name: String,
      price: Number,
      qty: Number
    }
  ],
  total: Number,
  status: {
    type: String,
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model("Order", OrderSchema);

/* ================= ROUTES ================= */

// 🟢 Place Order
app.post("/place-order", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    res.json({ success: true, message: "Order saved!" });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🔵 Get Orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
      
    });
    console.log(order._id)
    

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🟡 Update Status
app.put("/order/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" } // ✅ updated fix (no warning)
    );

    // ❗ STOP if not found
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }

    // ✅ ONLY ONE RESPONSE
    return res.json({
      success: true,
      message: "Status updated",
      data: updatedOrder
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
// 🔴 Delete Order
app.delete("/order/:id", async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }

    return res.json({
      success: true,
      message: "Order deleted"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});