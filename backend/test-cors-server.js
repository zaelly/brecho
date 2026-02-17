// Arquivo temporário para teste CORS
const express = require("express");
const cors = require("cors");
const app = express();

// CORS simplificado para teste
app.use(cors({
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

app.use(express.json());

// Rota de teste
app.get('/api/test-cors', (req, res) => {
  console.log('Test CORS - Origin:', req.headers.origin);
  res.json({ 
    message: 'CORS funcionando!', 
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Rota de produtos simulada
app.get('/api/products/seller/allproducts', (req, res) => {
  console.log('Simulando rota de produtos - Origin:', req.headers.origin);
  res.json([{ 
    id: 1, 
    name: 'Produto Teste', 
    sellerId: 'test_seller_id'
  }]);
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Servidor CORS teste rodando na porta ${PORT}`);
});