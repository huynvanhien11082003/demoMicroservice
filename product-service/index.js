require("dotenv").config();
const express = require("express");
const { Sequelize } = require("sequelize");

const app = express();
app.use(express.json());

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql"
  }
);

const ProductModel = require("./models/product");
const Product = ProductModel(sequelize);

sequelize.sync()
  .then(() => console.log("Product DB synced"))
  .catch(err => console.error("Sync error:", err));

/* ================= CRUD ================= */

// CREATE
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL
app.get("/products", async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

// READ BY ID
app.get("/products/:id", async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// UPDATE
app.put('/products/:id/reduce-stock', async (req, res) => {
    const { quantity } = req.body;
    const productId = req.params.id;

    try {
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Not enough stock' });
        }

        product.stock -= quantity;
        await product.save();

        res.json({ message: 'Stock reduced successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error reducing stock', error });
    }
});

// DELETE
app.delete("/products/:id", async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  await product.destroy();
  res.json({ message: "Product deleted" });
});

app.listen(process.env.PORT, () => {
  console.log(`Product Service running on port ${process.env.PORT}`);
});