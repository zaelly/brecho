const express = require("express");
const router = express.Router();
const Users = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { fetchUser } = require('../middlewares/auth.js');
const multer = require("multer");
const cors = require("cors");
const cloudinary = require("../config/cloudinary");
const nodemailer = require("nodemailer");

// guardar codigos de recuperacao temporariamente
const resetCodes = {};

// Endpoints para USUÁRIOS
// -------------------------
// Usar o JSON e CORS para as requisições
router.use(express.json());
router.use(cors());

// Multer com memória para upload via Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Função auxiliar para upload no Cloudinary
async function uploadToCloudinary(file, folder) {
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURI = `data:${file.mimetype};base64,${b64}`;
  const result = await cloudinary.uploader.upload(dataURI, {
    folder: `brecho-reverto/${folder}`,
    resource_type: "auto",
    transformation: [{ quality: "auto", fetch_format: "auto" }]
  });
  return result;
}

// Endpoint para registrar usuário
router.post('/user/signup', async (req, res) => {
  try {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({ success: false, errors: "Já existe um usuário com este email!" });
    }

const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: {},  
      cpf: req.body.cpf,
      cep: req.body.cep,
      adress: req.body.adress
    });

    await user.save();

    const data = {
      user: {
        id: user._id
      }
    };

    const token = jwt.sign(data, process.env.JWT_SECRET || 'secret_ecom');
    res.json({ success: true, token });
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    res.status(500).json({ success: false, errors: "Erro interno ao criar o usuário." });
  }
});

// Endpoint de login
router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (user) {
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        const data = {
          user: {
            id: user._id
          }
        };
        const token = jwt.sign(data, process.env.JWT_SECRET || 'secret_ecom');
        return res.json({ success: true, token });
      } else {
        return res.status(401).json({ success: false, errors: "Senha incorreta" });
      }
    }
    res.status(404).json({ success: false, errors: "Email incorreto!" });
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
      if (cep) updateFields.city = cep;
      if (new_password) {
        updateFields.password = new_password;
    }

    await Users.findByIdAndUpdate(req.user.id, updateFields);
    res.json({ success: true, message: "Perfil atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

router.post("/uploadprofileimage", fetchUser,
  upload.single('profile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: 0, message: "Nenhum arquivo enviado" });
    }
    const result = await uploadToCloudinary(req.file, 'users/profiles');
    await Users.findByIdAndUpdate(req.user.id, { image: result.secure_url });
    res.json({
      success: 1,
      image_url: result.secure_url
    });
  } catch (error) {
    console.error("Erro no upload de perfil do usuário:", error);
    res.status(500).json({ success: 0, message: "Erro ao fazer upload da imagem" });
  }
})

// Solicitar recuperacao de senha - envia codigo por email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "Email nao encontrado" });
    }

    // gerar codigo de 6 digitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // salvar codigo com expiracao de 10 minutos
    resetCodes[email] = {
      code: code,
      expires: Date.now() + 10 * 60 * 1000,
    };

    // enviar email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Codigo de Recuperacao - Reverto Brecho",
      text: `Ola!\n\nSeu codigo de recuperacao de senha e: ${code}\n\nEsse codigo expira em 10 minutos.\n\nSe voce nao solicitou a recuperacao, ignore este email.`,
    });

    res.json({ success: true, message: "Codigo enviado para seu email!" });
  } catch (err) {
    console.error("Erro ao enviar codigo:", err);
    res.status(500).json({ success: false, message: "Erro ao enviar codigo" });
  }
});

// Resetar senha com codigo
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const stored = resetCodes[email];
    if (!stored) {
      return res.status(400).json({ success: false, message: "Nenhum codigo solicitado para este email" });
    }

    if (Date.now() > stored.expires) {
      delete resetCodes[email];
      return res.status(400).json({ success: false, message: "Codigo expirado. Solicite um novo." });
    }

    if (stored.code !== code) {
      return res.status(400).json({ success: false, message: "Codigo incorreto" });
    }

    // atualizar senha
    const user = await Users.findOne({ email });
    user.password = newPassword;
    await user.save();

    // limpar codigo
    delete resetCodes[email];

    res.json({ success: true, message: "Senha alterada com sucesso!" });
  } catch (err) {
    console.error("Erro ao resetar senha:", err);
    res.status(500).json({ success: false, message: "Erro ao resetar senha" });
  }
});

// Adicionar produto aos favoritos
router.post('/addfavorite', fetchUser, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await Users.findById(req.user.id);

    if (user.favorites.includes(productId)) {
      return res.json({ success: false, message: "Produto ja esta nos favoritos" });
    }

    user.favorites.push(productId);
    await user.save();
    res.json({ success: true, message: "Adicionado aos favoritos!" });
  } catch (err) {
    console.error("Erro ao adicionar favorito:", err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

// Remover produto dos favoritos
router.post('/removefavorite', fetchUser, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await Users.findById(req.user.id);

    user.favorites = user.favorites.filter(id => id !== productId);
    await user.save();
    res.json({ success: true, message: "Removido dos favoritos!" });
  } catch (err) {
    console.error("Erro ao remover favorito:", err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

// Buscar favoritos do usuario
router.get('/getfavorites', fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    res.json({ success: true, favorites: user.favorites || [] });
  } catch (err) {
    console.error("Erro ao buscar favoritos:", err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

module.exports = router;