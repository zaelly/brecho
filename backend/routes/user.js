const express = require("express");
const router = express.Router();
const Users = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { fetchUser } = require('../middlewares/auth.js');
// const fs = require("fs");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// Endpoints para USUÁRIOS
// -------------------------
// Middleware CORS específico para usuários
router.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://brechobackend.vercel.app'
  ];
  
  console.log('Router User - Origin:', origin);
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, auth-token, auth-token-seller');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    console.log('Preflight USER para:', req.url, 'origin:', origin);
    res.sendStatus(200);
  } else {
    next();
  }
});

router.use(express.json());

const port = process.env.PORT || 4000;
const url = process.env.VITE_API_URL || `http://localhost:${port}`

// const dir = "./upload/images";
// if (!fs.existsSync(dir)) {
//   fs.mkdirSync(dir, { recursive: true });
// }

//Configuração do Multer para o upload de imagens
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
 });

router.use("/images", express.static("upload/images"));

// Endpoint para registrar usuário
router.post('/user/signup', async (req, res) => {
  try {
    // Verifica se já existe usuário com esse email
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({
        success: false,
        errors: "Já existe um usuário com este email!"
      });
    }

    // Criptografa senha
    const hashedPassword = await bcrypt.hash(req.body.password, 8);

    // Cria usuário
    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      cartData: {},
      cpf: req.body.cpf,
      adress: req.body.adress
    });

    await user.save();

    const data = {
      user: {
        id: user._id
      }
    };

    const token = jwt.sign(
      data,
      process.env.JWT_SECRET || 'secret_ecom',
      { expiresIn: "7d" } 
    );

    res.json({
      success: true,
      token
    });

  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    res.status(500).json({
      success: false,
      errors: "Erro interno ao criar o usuário."
    });
  }
});

// Endpoint de login
router.post("/user/login", async (req, res) => {
  try {
    console.log("Tentativa de login:", { email: req.body.email });
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, errors: "Email e senha são obrigatórios" });
    }

    const user = await Users.findOne({ email });
    console.log("Usuário encontrado:", user ? "Sim" : "Não");
    
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Senha correta:", isMatch);
      
      if (isMatch) {
        const data = {
          user: {
            id: user._id
          }
        };
        const token = jwt.sign(data, process.env.JWT_SECRET || 'secret_ecom');
        console.log("Login bem-sucedido para:", email);
        return res.json({ success: true, token });
      } else {
        return res.status(401).json({ success: false, errors: "Senha incorreta" });
      }
    }
    res.status(404).json({ success: false, errors: "Email não encontrado!" });
  } catch (err) {
    console.error("Erro no login do usuário:", err);
    res.status(500).json({ success: false, errors: "Erro interno do servidor" });
  }
});

router.get('/getuserprofile', fetchUser, async(req,res)=>{
  try{
    const getUser = await Users.findById(req.user.id).select("-password");
    res.json({success: true, data: getUser});
  }catch(err){
    console.error("Erro ao buscar informações do perfil!", err);
    res.status(500).json({success: false, message: "Erro ao buscar perfil."})
  }
})

router.post("/updateprofile", fetchUser, async (req, res) => {
  try {
    const { name, email, new_password, image, cpf, adress, city } = req.body;

    const updateFields = {};
      if (name) updateFields.name = name;
      if (email) updateFields.email = email;
      if (adress) updateFields.adress = adress;
      if (image) updateFields.image = image;
      if (cpf) updateFields.cpf = cpf;
      if (city) updateFields.city = city;
      if (new_password) {
        const hashedPassword = await bcrypt.hash(new_password, 8);
        updateFields.password = hashedPassword;
    }

    await Users.findByIdAndUpdate(req.user.id, updateFields);
    res.json({ success: true, message: "Perfil atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

router.post("/uploadprofileimage", fetchUser, 
  upload.single('profile'), (req, res)=>{
  
    const fileName = `profile_${Date.now()}${path.extname(req.file.originalname)}`;
  res.json({
    success:1,
    image_url: `${url}/images/${fileName}`
  })
})

module.exports = router;