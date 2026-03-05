require("dotenv").config();
const express = require("express");
const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

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

const UserModel = require("./models/user");
const User = UserModel(sequelize);

// Sync database
sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Sync error:", err));

/* ================= CRUD ================= */

// CREATE
app.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
    });

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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ message: "Wrong password" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, "SECRET_KEY", {
    expiresIn: "1h",
  });

  res.json({
    message: "Login success",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

/* ================= REGISTER ================= */

app.post("/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      message: "Register failed",
      error: error.message
    });

  }

});

app.listen(process.env.PORT, () => {
  console.log(`User Service running on port ${process.env.PORT}`);
});


