const express = require("express");
const router = express.Router();
const Seller = require('../models/Seller.js');
const { fetchSeller } = require('../middlewares/auth.js');
const jwt = require("jsonwebtoken");
const Product = require('../models/Product.js');

const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const fs = require("fs");

// Usar o JSON e CORS para as requisições
router.use(express.json());
router.use(cors());

// -------------------------
// Endpoints para VENDEDORES
// -------------------------
const port = process.env.PORT || 4000;
const url = process.env.VITE_API_URL || `http://localhost:${port}`;

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
router.use("/images", express.static("upload/images"));

// Rota de signup para vendedor
router.post("/seller/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let check = await Seller.findOne({ email });
    if (check) {
      return res.status(400).json({ success: false, errors: "Email já cadastrado!" });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 8);

    const seller = new Seller({
      name,
      email,
      password: hashedPassword
    });

    await seller.save();

    const data = {
      seller: {
        id: seller._id
      }
    };

    const token = jwt.sign(data, process.env.JWT_SECRET_SELLER);
    res.json({ success: true, token });
  } catch (err) {
    console.error("Erro no signup do vendedor:", err);
    res.status(500).json({ success: false, errors: "Erro interno do servidor" });
  }
});

// Rota de login para vendedor
router.post("/seller/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });
    if (seller) {
      const isMatch = await bcrypt.compare(password, seller.password);
      if (isMatch) {
        const data = {
          seller: {
            id: seller._id
          }
        };
        const token = jwt.sign(data, process.env.JWT_SECRET_SELLER)
        return res.json({ success: true, token });
      }
    }
    res.status(401).json({ success: false, errors: "Credenciais inválidas" });
  } catch (err) {
    console.error("Erro no login do vendedor:", err);
    res.status(500).json({ success: false, errors: "Erro interno do servidor" });
  }
});

//tras uma imagem carregada pelo usuario no perfil
router.post("/uploadprofileimage", fetchSeller, 
  upload.single('profile'), (req, res)=>{
  res.json({
    success:1,
    image_url: `${url}/images/${req.file.filename}`
  })
})

//perfil vendedor
router.post("/updateprofile", fetchSeller, async (req, res) => {
  try {
    const { name, email, new_password, image, shopDescription, gateways } = req.body;

    const updateFields = {};
      if (name) updateFields.name = name;
      if (email) updateFields.email = email;
      if (shopDescription) updateFields.shopDescription = shopDescription;
      if (image) updateFields.image = image;
      if (gateways) updateFields.gateways = gateways;
      if (new_password) {
        const hashedPassword = await bcrypt.hash(new_password, 8);
        updateFields.password = hashedPassword;
    }

    await Seller.findByIdAndUpdate(req.seller.id, updateFields);
    res.json({ success: true, message: "Perfil do vendedor atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar perfil do vendedor:", err);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

//trazer dados do vendedor no admin seller
router.get("/getsellerprofile:id", fetchSeller, async (req, res) => {
  try {
    const seller = await Seller.findById(req.req.id).select("-password");
    if(!seller){
      return res.status(404).json({ success: false, message: "Vendedor não encontrado." });
    }
    res.json({ success: true, data: seller });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro ao buscar perfil." });
  }
});

//tras dados do vendedor pro client
router.get("/getseller/:id", async (req, res) => {
  try {
    const sellerId = req.params.id;
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ success: false, message: "Vendedor não encontrado." });
    }

    const products = await Product.find({ sellerId: seller._id });

    res.json({
      success: true,
      data: {
        _id: seller._id,
        name: seller.name,
        image: seller.image,
        shopDescription: seller.shopDescription,
        products,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao buscar perfil." });
  }
});

// traz metodos de pagamentos
router.get("/getgatewaysseller", fetchSeller, async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller.id).select("gateways");
    res.json({ success: true, data: seller.gateways });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro ao buscar gateways." });
  }
});

// atualiza metodos de pagamentos
router.post("/updategateways", fetchSeller, async (req, res) => {
  try {
    const { gateways } = req.body;
    await Seller.findByIdAndUpdate(req.seller.id, { gateways });
    res.json({ success: true, message: "Gateway atualizado com sucesso." });
  }
  catch (err) {
    console.error("Erro ao atualizar gateways:", err);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

// checkout

router.post("/checkout", fetchSeller, async (req, res) => {
  try{

    const { orderId, paymentMethod, amount } = req.body;

    if(!orderId || !paymentMethod || !amount){
      return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios." });
    }

    // tras os gateways do vendedor
    const seller = await Seller.findById(req.seller.id).select("gateways");
    if(!seller){
      return res.status(404).json({ success: false, message: "Vendedor não encontrado." });
    }

  }catch(err){
    console.error("Erro no checkout:", err);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

module.exports = router;