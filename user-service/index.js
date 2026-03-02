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

const UserModel = require("./models/user");
const User = UserModel(sequelize);

// Sync database
sequelize.sync()
  .then(() => console.log("Database synced"))
  .catch(err => console.error("Sync error:", err));

/* ================= CRUD ================= */

// CREATE
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL
app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// READ BY ID
app.get("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// UPDATE
app.put("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.update(req.body);
  res.json(user);
});

// DELETE
app.delete("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.destroy();
  res.json({ message: "User deleted" });
});

app.listen(process.env.PORT, () => {
  console.log(`User Service running on port ${process.env.PORT}`);
});