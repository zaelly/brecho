const express = require("express");
const router = express.Router();
const Users = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// Endpoints para USUÁRIOS
// -------------------------
// Usar o JSON e CORS para as requisições
const cors = require("cors");
router.use(express.json());
router.use(cors());

// Endpoint para registrar usuário
router.post('/signup', async (req, res) => {
  try {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({ success: false, errors: "Já existe um usuário com este email!" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 8);

    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      cartData: {}  // Inicializando o carrinho como vazio
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
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
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

module.exports = router;