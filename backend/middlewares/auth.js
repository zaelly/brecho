const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const USER_SECRET = process.env.JWT_SECRET;
const SELLER_SECRET = process.env.JWT_SECRET_SELLER;

// Middleware para autenticação de usuários
const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ errors: "Token de autenticação não fornecido." });
  }

  try {
    const data = jwt.verify(token, USER_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    console.error("Erro ao verificar token do usuário:", error);
    return res.status(401).json({ errors: "Token inválido para usuário." });
  }
};

// Middleware para autenticação de vendedores
const fetchSeller = (req, res, next) => {
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
