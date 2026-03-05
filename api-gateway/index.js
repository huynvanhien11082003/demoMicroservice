require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:3004" }));

app.use((req, res, next) => {
  console.log("Gateway received:", req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("Gateway running");
});

// PRODUCT
app.use(createProxyMiddleware({
  target: "http://localhost:3002",
  changeOrigin: true,
  pathFilter: ["/products"],
  logLevel: "debug"
}));

// USER
// USER
app.use(createProxyMiddleware({
  target: "http://localhost:3001",
  changeOrigin: true,
  pathFilter: ["/users", "/login", "/register"],
  logLevel: "debug"
}));

// ORDER
app.use(createProxyMiddleware({
  target: "http://localhost:3003",
  changeOrigin: true,
  pathFilter: ["/orders"]
}));

app.listen(3000, () => {
  console.log("API Gateway running on port 3000");
});