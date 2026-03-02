require("dotenv").config();
const express = require("express");
const { Sequelize } = require("sequelize");
const axios = require("axios");
const cors = require("cors");

const orders = [];

const app = express();
app.use(express.json());
app.use(cors());
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  },
);

const OrderModel = require("./models/order");
const Order = OrderModel(sequelize);

sequelize
  .sync()
  .then(() => console.log("Order DB synced"))
  .catch((err) => console.error("Sync error:", err));

/* ================= CREATE ORDER ================= */

app.post("/orders", async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // 1️⃣ Lấy thông tin product
    const productResponse = await axios.get(
      `http://localhost:3002/products/${productId}`
    );

    const product = productResponse.data;

    // 2️⃣ Kiểm tra stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    // 3️⃣ Tính tổng tiền
    const totalPrice = product.price * quantity;

    // 4️⃣ Trừ stock
    await axios.put(
      `http://localhost:3002/products/${productId}/reduce-stock`,
      { quantity }
    );

    // 5️⃣ Tạo order
    const order = await Order.create({
      productId,
      quantity,
      totalPrice,
    });

    res.status(201).json({
      message: "Order created successfully!",
      order,
    });

  } catch (error) {
    console.error("ORDER ERROR:", error);

    res.status(500).json({
      message: "Order failed",
      error: error.response?.data || error.message,
    });
  }
});
/* ================= GET ALL ================= */

app.get("/orders", async (req, res) => {
  const orders = await Order.findAll();
  res.json(orders);
});

app.listen(process.env.PORT, () => {
  console.log(`Order Service running on port ${process.env.PORT}`);
});
