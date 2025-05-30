const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const dotenv = require("dotenv");

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro ao conectar no MongoDB:", err));

// Criar diretório para upload de imagens se não existir
const dir = "./upload/images";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Configuração do Multer para o upload de imagens
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
 });

// Rota para upload de imagens
app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// Rota de envio de e-mail
app.post("/sendemail", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "E-mail é obrigatório" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Bem-vindo!",
    text: "Obrigado por se inscrever!",
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
    res.status(500).json({ message: "Erro ao enviar e-mail." });
  }
});

// Rota inicial
app.get("/", (req, res) => {
  res.send("🚀 API Rodando");
});

const userRoutes = require('./routes/user');
const sellerRoutes = require('./routes/seller');
const cartRoutes = require('./routes/cartRoute');
const productRoutes = require('./routes/products');

// Usar as rotas no aplicativo
app.use('/api/users', userRoutes); 
app.use('/api/products', productRoutes); 
app.use('/api/cart', cartRoutes);        
app.use('/api/sellers', sellerRoutes);   

// Inicia o servidor
app.listen(port, (err) => {
  if (err) {
    console.error(`❌ Erro ao iniciar o servidor: ${err}`);
    process.exit(1);
  } else {
    console.log(`✅ Servidor rodando na porta ${port}`);
  }
});