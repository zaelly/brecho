const express = require("express");
const router = express.Router();
const Users = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { fetchUser } = require('../middlewares/auth.js');

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
      cartData: {},  // Inicializando o carrinho como vazio
      cpf: req.body.cpf,
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

router.get('users/getuserprofile', fetchUser, async(req,res)=>{
  try{
    const getUser = await User.findById(req.user.id).select("-password");
    res.json({success: true, data: getUser});
  }catch(err){
    console.error("Erro ao buscar informações do perfil!", err);
    res.status(500).json({success: false, message: "Erro ao buscar perfil."})
  }
})

router.post("/updateprofile", fetchUser, async (req, res) => {
  try {
    const { name, email, new_password, image, cpf, adress } = req.body;

    const updateFields = {};
      if (name) updateFields.name = name;
      if (email) updateFields.email = email;
      if (adress) updateFields.adress = adress;
      if (image) updateFields.image = image;
      if (cpf) updateFields.cpf = cpf;
      if (new_password) {
        const hashedPassword = await bcrypt.hash(new_password, 8);
        updateFields.password = hashedPassword;
    }

    await Seller.findByIdAndUpdate(req.seller.id, updateFields);
    res.json({ success: true, message: "Perfil atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

router.post("/uploadprofileimage", fetchUser, 
  upload.single('profile'), (req, res)=>{
  res.json({
    success:1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  })
})

module.exports = router;