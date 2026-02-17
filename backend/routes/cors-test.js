const express = require("express");
const cors = require("cors");

const router = express.Router();

// Middleware CORS específico para sellers
router.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5174',
    'https://brechoadmin.vercel.app',
    'http://localhost:5173',
    'https://brechobackend.vercel.app'
  ];
  
  console.log('Router Seller - Origin:', origin);
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, auth-token, auth-token-seller');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    console.log('Preflight SELLER para:', req.url, 'origin:', origin);
    res.sendStatus(200);
  } else {
    next();
  }
});

// CORS adicional
router.use(cors({
  origin: [
    'http://localhost:5174',
    'https://brechoadmin.vercel.app',
    'http://localhost:5173',
    'https://brechobackend.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'auth-token', 'auth-token-seller'],
  credentials: true
}));

router.use(express.json());

module.exports = router;