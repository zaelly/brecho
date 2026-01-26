const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const app = express();


const app = require("../app");
module.exports = app;


const dotenv = require("dotenv");
// Carregar variáveis de ambiente
dotenv.config();

const port = process.env.PORT || 4000 ;
const url = process.env.VITE_API_URL || `http://localhost:${port}`
// Middleware
app.use(express.json());
app.use(cors());

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
    image_url: `${url}/images/${req.file.filename}`,
  });
});

// Rota de envio de e-mail
// app.post("/sendemail", async (req, res) => {
//   const { email } = req.body;
  
//   if (!email) {
//     return res.status(400).json({ message: "E-mail é obrigatório" });
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//       tls:{
//          rejectUnauthorized: false
//       }
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Bem-vindo!",
//       text: "Obrigado por se inscrever!",
//     };

//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: "E-mail enviado com sucesso!" });
//   } catch (error) {
//     console.error("❌ Erro ao enviar e-mail:", error);
//     res.status(500).json({ message: "Erro ao enviar e-mail." });
//   }
// });

// Rota inicial
app.get("/", (req, res) => {
  res.send("🚀 API Rodando");
});
