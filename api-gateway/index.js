require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const cors = require('cors');

app.use(cors({
  origin: "http://localhost:3004"
}));

// log để debug
app.use((req, res, next) => {
  console.log("Gateway received:", req.method, req.url);
  next();
});

app.get('/', (req, res) => {
  res.send('Gateway running');
});

// ORDER SERVICE
app.use(
  createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true,
    pathFilter: ['/orders'],
  })
);

// USER SERVICE
app.use(
  createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathFilter: ['/users'],
  })
);

// PRODUCT SERVICE
app.use(
  createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathFilter: ['/products'],
  })
);

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});
