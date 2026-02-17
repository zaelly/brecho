const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const cloudinary = require("./config/cloudinary");
const app = express();
const dotenv = require("dotenv");
// Carregar variáveis de ambiente
dotenv.config();
const server = require('http').createServer(app)
const { Server } = require('socket.io')

const port = process.env.PORT || 4000 ;
const url = process.env.VITE_API_URL || `http://localhost:${port}`
// Middleware
app.use(express.json());
app.use(cors());

// Socket.io configuracao
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// usuarios conectados
const onlineUsers = {};

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // quando usuario entra no chat
  socket.on('join', (userId) => {
    onlineUsers[userId] = socket.id;
    console.log('Usuario entrou:', userId);
  });

  // quando envia mensagem
  socket.on('sendMessage', (data) => {
    const { sender, receiver, content, chat } = data;
    console.log('Mensagem recebida:', data);

    // enviar para o destinatario se estiver online
    if (onlineUsers[receiver]) {
      io.to(onlineUsers[receiver]).emit('receiveMessage', {
        sender,
        content,
        chat,
        time: new Date().toLocaleTimeString()
      });
    }
  });

  // quando desconecta
  socket.on('disconnect', () => {
    for (const [userId, socketId] of Object.entries(onlineUsers)) {
      if (socketId === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    console.log('Usuario desconectou:', socket.id);
  });
});

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
    image_url: `${url}/images/${req.file.filename}`,
  });
});

// Rota de envio de e-mail
app.post("/sendemail", async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: "E-mail é obrigatório" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls:{
         rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Bem-vindo!",
      text: "Obrigado por se inscrever!",
    };

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
const orderRoutes = require('./routes/orderRoute');
const chatRoutes = require('./routes/chatRoute');
const uploadRoutes = require('./routes/upload');

// Usar as rotas no aplicativo
app.use('/api/users', userRoutes); 
app.use('/api/products', productRoutes); 
app.use('/api/cart', cartRoutes);        
app.use('/api/sellers', sellerRoutes);   
app.use('/api/order', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

// Inicia o servidor
server.listen(port, (err) => {
  if (err) {
    console.error(`❌ Erro ao iniciar o servidor: ${err}`);
    process.exit(1);
  } else {
    console.log(`✅ Servidor rodando na porta ${port}`);
  }
});
