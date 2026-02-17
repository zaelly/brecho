const express = require("express");
const router = express.Router();
const Seller = require('../models/Seller.js');
const { fetchSeller, fetchUser } = require('../middlewares/auth.js');
const jwt = require("jsonwebtoken");
const Product = require('../models/Product.js');
const cors = require("cors")
const multer = require("multer");
const bcrypt = require('bcryptjs');
const cloudinary = require("../config/cloudinary");

// Usar o JSON e
//
router.use(express.json());
router.use(cors());

// -------------------------
// Endpoints para VENDEDORES
// -------------------------

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

// Rota para upload de avatar do vendedor
router.post("/upload", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: 0, message: "Nenhum arquivo enviado" });
    }
    const result = await uploadToCloudinary(req.file, 'sellers/avatars');
    res.json({
      success: 1,
      image_url: result.secure_url,
    });
  } catch (error) {
    console.error("Erro no upload do avatar:", error);
    res.status(500).json({ success: 0, message: "Erro ao fazer upload da imagem" });
  }
});


// Rota de signup para vendedor
router.post("/seller/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let check = await Seller.findOne({ email });
    if (check) {
      return res.status(400).json({ success: false, errors: "Email já cadastrado!" });
    }

const seller = new Seller({
      name,
      email,
      password
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
      const isMatch = await seller.comparePassword(password);
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

//tras uma imagem carregada pelo vendedor no perfil
router.post("/uploadprofileimage", fetchSeller, upload.single('profile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: 0, message: "Nenhum arquivo enviado" });
    }
    const result = await uploadToCloudinary(req.file, 'sellers/profiles');
    await Seller.findByIdAndUpdate(req.seller.id, { image: result.secure_url });
    res.json({
      success: 1,
      image_url: result.secure_url
    });
  } catch (error) {
    console.error("Erro no upload de perfil do vendedor:", error);
    res.status(500).json({ success: 0, message: "Erro ao fazer upload da imagem" });
  }
})

//perfil vendedor
router.post("/updateprofile", fetchSeller, async (req, res) => {
  try {
    const { 
      name, email, new_password, 
      image, shopDescription, gateways 
    } = req.body;

    const updateFields = {};
      if (name) updateFields.name = name;
      if (email) updateFields.email = email;
      if (shopDescription) updateFields.shopDescription = shopDescription;
      if (image) updateFields.image = image;
      if (gateways) updateFields.gateways = gateways;
if (new_password) {
        updateFields.password = new_password;
    }

    await Seller.findByIdAndUpdate(req.seller.id, updateFields);
    res.json({ success: true, message: "Perfil do vendedor atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar perfil do vendedor:", err);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

//trazer dados do vendedor no admin seller
router.get("/getsellerprofile", fetchSeller, async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller.id).select("-password");
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

// Avaliar vendedor (usuario logado)
router.post("/rateseller", fetchUser, async (req, res) => {
  try {
    const { sellerId, rating, comment } = req.body;

    if (!sellerId || !rating) {
      return res.status(400).json({ success: false, message: "Vendedor e nota sao obrigatorios" });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ success: false, message: "Vendedor nao encontrado" });
    }

    // verificar se usuario ja avaliou
    const alreadyRated = seller.ratings && seller.ratings.find(r => r.userId === req.user.id);
    if (alreadyRated) {
      // atualizar avaliacao existente
      alreadyRated.rating = rating;
      alreadyRated.comment = comment;
      alreadyRated.date = Date.now();
    } else {
      // nova avaliacao
      if (!seller.ratings) seller.ratings = [];
      seller.ratings.push({
        userId: req.user.id,
        userName: req.body.userName || 'Usuario',
        rating: rating,
        comment: comment || '',
      });
    }

    await seller.save();
    res.json({ success: true, message: "Avaliacao enviada!" });
  } catch (err) {
    console.error("Erro ao avaliar vendedor:", err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

// Buscar avaliacoes do vendedor
router.get("/getratings/:sellerId", async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.sellerId).select("ratings");
    if (!seller) {
      return res.status(404).json({ success: false, message: "Vendedor nao encontrado" });
    }

    const ratings = seller.ratings || [];
    const average = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0;

    res.json({ success: true, ratings, average, total: ratings.length });
  } catch (err) {
    console.error("Erro ao buscar avaliacoes:", err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
});

module.exports = router;