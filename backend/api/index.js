const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const path = require("path");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Import error handler
const errorHandler = require("../middleware/errorHandler");

// Configurações Iniciais
dotenv.config();
const app = express();

// Middleware para OPTIONS requests (preflight)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    'https://brechobackend.vercel.app',
    'https://brechoadmin.vercel.app'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, auth-token, auth-token-seller');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    console.log('Preflight request para:', req.url, 'origin:', origin);
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware JSON
app.use(express.json());

// CORS adicional
app.use(require('cors')({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    'https://brechobackend.vercel.app',
    'https://brechoadmin.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'auth-token', 'auth-token-seller'],
  credentials: true
}));

// Conexão com o MongoDB 
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado ao MongoDB");
  } catch (err) {
    console.error("❌ Erro ao conectar no MongoDB:", err);
  }
};

// Configuração do Multer (Uso de Memória)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

// Middleware para garantir conexão DB em cada requisição
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Upload para o Cloudinary
app.post("/upload", upload.single("product"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: 0, message: "Ficheiro não enviado" });
    }

    // Converter buffer para base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // Upload para o Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "brecho/products",
      resource_type: "auto",
      transformation: [
        { quality: "auto", fetch_format: "auto" }
      ]
    });

    res.json({
      success: 1,
      image_url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.error("Erro ao fazer upload para Cloudinary:", error);
    res.status(500).json({ 
      success: 0, 
      message: "Erro ao fazer upload da imagem" 
    });
  }
});

// Rota para deletar imagem do Cloudinary
app.delete("/upload/:public_id", async (req, res) => {
  try {
    const { public_id } = req.params;
    
    const result = await cloudinary.uploader.destroy(public_id);
    
    res.json({
      success: 1,
      message: "Imagem deletada com sucesso",
      result
    });

  } catch (error) {
    console.error("Erro ao deletar imagem do Cloudinary:", error);
    res.status(500).json({ 
      success: 0, 
      message: "Erro ao deletar imagem" 
    });
  }
});

// Rota de envio de e-mail 
app.post("/sendemail", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "E-mail é obrigatório" });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      tls: { rejectUnauthorized: false }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Bem-vindo!",
      text: "Obrigado por se inscrever!",
    });
    res.status(200).json({ message: "E-mail enviado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar e-mail." });
  }
});

// Rota inicial
app.get("/", (req, res) => res.send("🚀 Backend Brechó Ativo"));

// Importação e Uso das Rotas Existentes
const userRoutes = require('../routes/user');
const sellerRoutes = require('../routes/seller');
const cartRoutes = require('../routes/cartRoute');
const productRoutes = require('../routes/products');
const orderRoutes = require('../routes/orderRoute');
const chatRoutes = require('../routes/chatRoute');

app.use('/api/users', userRoutes); 
app.use('/api/products', productRoutes); 
app.use('/api/cart', cartRoutes);        
app.use('/api/sellers', sellerRoutes);   
app.use('/api/order', orderRoutes);
app.use('/api/chat', chatRoutes);

// Error handling middleware (deve ser por último)
app.use(errorHandler);

module.exports = app;