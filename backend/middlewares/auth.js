const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Users = require('../models/User.js')
dotenv.config();

const USER_SECRET = process.env.JWT_SECRET;
const SELLER_SECRET = process.env.JWT_SECRET_SELLER;

// Middleware para autenticação de usuários
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ errors: "Token de autenticação não fornecido." });
  }

  try {
    const data = jwt.verify(token, USER_SECRET);
    const user = await Users.findById(data.user.id);
    if(!user){
      return res.status(400).json({success: false, message: "Usúario não encontrado!"})
    }
    req.user = data.user;
    req.user = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      image: user.image
    };

    next();
  } catch (error) {
    console.error("Erro ao verificar token do usuário:", error);
    return res.status(401).json({ errors: "Token inválido para usuário." });
  }
};

// Middleware para autenticação de vendedores
const  fetchSeller = (req, res, next) => {
  const token = req.header("auth-token-seller");
  if (!token) {
    return res.status(401).json({ errors: "Token de autenticação não fornecido." });
  }

  try {
    const data = jwt.verify(token, SELLER_SECRET);
    req.seller = data.seller;
    next();
  } catch (error) {
    console.error("Erro ao verificar token do vendedor:", error);
    return res.status(401).json({ errors: "Token inválido para vendedor." });
  }
};

module.exports = { fetchUser, fetchSeller };
