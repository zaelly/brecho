const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'auth-token', 'auth-token-seller'],
  credentials: true
}));

app.use(express.json());

// Senha criptografada para "senha123"
const testPassword = '$2a$08$Y.dJN9yPY8M9AVh2lCNQOeW7Bw4Kx/8vqJW.F.RnT8M5S5P8Q5HG';

// === ROTAS DE USUÁRIO ===

// Cadastro de usuário
app.post('/api/users/user/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 8);
    
    // Simulando salvamento no banco
    console.log(`Usuário criado: ${username} - ${email}`);
    
    const token = jwt.sign({ user: { id: 'test_user_' + Date.now() } }, 'secret_ecom');
    
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, errors: "Erro no cadastro" });
  }
});

// Login de usuário
app.post('/api/users/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Simulando busca no banco
    if (email === 'test@example.com' && password === 'senha123') {
      const token = jwt.sign({ user: { id: 'test_user_id' } }, 'secret_ecom');
      res.json({ success: true, token });
    } else if (email && password) {
      // Aceita qualquer email/senha para teste
      const token = jwt.sign({ user: { id: 'user_' + Date.now() } }, 'secret_ecom');
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, errors: "Email ou senha incorretos" });
    }
  } catch (error) {
    res.status(500).json({ success: false, errors: "Erro no login" });
  }
});

// === ROTAS DE VENDEDOR ===

// Cadastro de vendedor
app.post('/api/sellers/seller/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 8);
    
    console.log(`Vendedor criado: ${name} - ${email}`);
    
    const token = jwt.sign({ seller: { id: 'test_seller_' + Date.now() } }, 'secret_seller');
    
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, errors: "Erro no cadastro" });
  }
});

// Login de vendedor
app.post('/api/sellers/seller/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email && password) {
      // Aceita qualquer email/senha para teste
      const token = jwt.sign({ seller: { id: 'seller_' + Date.now() } }, 'secret_seller');
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, errors: "Email ou senha incorretos" });
    }
  } catch (error) {
    res.status(500).json({ success: false, errors: "Erro no login" });
  }
});

// Rotas de perfil (simuladas)
app.get('/api/users/getuserprofile', (req, res) => {
  res.json({
    success: true,
    data: {
      _id: 'test_user_id',
      name: 'Test User',
      email: 'test@example.com'
    }
  });
});

app.get('/api/sellers/getsellerprofile', (req, res) => {
  res.json({
    success: true,
    data: {
      _id: 'test_seller_id',
      name: 'Test Seller',
      email: 'seller@example.com',
      shopDescription: 'Loja de teste',
      image: ''
    }
  });
});

app.get('/api/products/seller/allproducts', (req, res) => {
  res.json([
    {
      _id: '1',
      name: 'Produto Teste 1',
      price: 50,
      category: 'Teste'
    },
    {
      _id: '2', 
      name: 'Produto Teste 2',
      price: 75,
      category: 'Teste'
    }
  ]);
});

app.get('/', (req, res) => {
  res.send('🚀 Servidor de Teste Brechó Rodando na porta 4001');
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`✅ Servidor de TESTE rodando na porta ${PORT}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📝 Para teste de login/cadastro sem MongoDB`);
});

module.exports = app;