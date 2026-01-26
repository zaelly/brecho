const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Configurações Iniciais
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

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

// Como o disco é temporário, o ideal é enviar para o Cloudinary aqui.
app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: 0, message: "Ficheiro não enviado" });
  
  const generatedName = `product_${Date.now()}${path.extname(req.file.originalname)}`;
  
  res.json({
    success: 1,
    image_url: `${process.env.VITE_API_URL || ""}/images/${generatedName}`,
    note: "Aviso: O disco da Vercel é temporário. Use Cloudinary para salvar permanentemente."
  });
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

module.exports = app;