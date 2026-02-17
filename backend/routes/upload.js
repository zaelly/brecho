const express = require("express");
const router = express.Router();
const Users = require('../models/User.js');
const Seller = require('../models/Seller.js');
const { fetchUser, fetchSeller } = require('../middlewares/auth.js');
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

// Configuração do Multer para upload em memória
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Middleware CORS para rotas de upload
router.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://brechobackend.vercel.app',
    'https://brechoadmin.vercel.app'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, auth-token, auth-token-seller');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

router.use(express.json());

// Função para upload para Cloudinary
async function uploadToCloudinary(file, folder) {
  const b64 = Buffer.from(file.buffer).toString("base64");
  let dataURI = `data:${file.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: `brecho-reverto/${folder}`,
    resource_type: "auto",
    transformation: [
      { quality: "auto", fetch_format: "auto" }
    ]
  });

  return result;
}

// Upload de imagem de perfil do usuário
router.post("/upload-profile-image", fetchUser, upload.single('profile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: 0, 
        message: "Arquivo não enviado" 
      });
    }

    const result = await uploadToCloudinary(req.file, 'users/profiles');

    // Atualizar imagem do usuário no banco
    await Users.findByIdAndUpdate(req.user.id, {
      image: result.secure_url
    });

    res.json({
      success: 1,
      image_url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.error("Erro no upload de imagem de perfil:", error);
    res.status(500).json({ 
      success: 0, 
      message: "Erro ao fazer upload da imagem de perfil" 
    });
  }
});

// Upload de imagem de perfil do vendedor
router.post("/upload-seller-image", fetchSeller, upload.single('profile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: 0, 
        message: "Arquivo não enviado" 
      });
    }

    const result = await uploadToCloudinary(req.file, 'sellers/profiles');

    // Atualizar imagem do vendedor no banco
    await Seller.findByIdAndUpdate(req.seller.id, {
      image: result.secure_url
    });

    res.json({
      success: 1,
      image_url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.error("Erro no upload de imagem de perfil vendedor:", error);
    res.status(500).json({ 
      success: 0, 
      message: "Erro ao fazer upload da imagem de perfil do vendedor" 
    });
  }
});

// Upload de arquivos de produto diretamente para Cloudinary
const uploadProductFiles = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'gallery', maxCount: 5 }
]);

router.post("/upload-product-files", uploadProductFiles, async (req, res) => {
  try {
    let thumbnailUrl = null;
    let galleryUrls = [];

    if (req.files?.thumbnail) {
      const result = await uploadToCloudinary(req.files.thumbnail[0], 'products/thumbnails');
      thumbnailUrl = result.secure_url;
    }

    if (req.files?.gallery) {
      const uploadPromises = req.files.gallery.map(file =>
        uploadToCloudinary(file, 'products/gallery')
      );
      const results = await Promise.all(uploadPromises);
      galleryUrls = results.map(r => r.secure_url);
    }

    res.json({
      success: true,
      thumbnail: thumbnailUrl,
      gallery: galleryUrls
    });

  } catch (error) {
    console.error("Erro no upload de arquivos do produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao fazer upload das imagens do produto"
    });
  }
});

// Upload de produto simplificado (aceita URLs já processadas)
router.post("/upload-product", async (req, res) => {
  try {
    let thumbnailUrl = null;
    let galleryUrls = [];

    // Receber URLs já processadas do frontend
    if (req.body.thumbnail) {
      thumbnailUrl = req.body.thumbnail;
    }

    if (req.body.gallery) {
      galleryUrls = Array.isArray(req.body.gallery) ? req.body.gallery : [req.body.gallery];
    }

    // Validações
    if (!thumbnailUrl) {
      return res.status(400).json({ 
        success: false, 
        message: "Thumbnail obrigatória!" 
      });
    }

    if (!galleryUrls || galleryUrls.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Gallery obrigatória!" 
      });
    }

    console.log('Upload de produto recebido:', { thumbnailUrl, galleryUrls });

    res.json({
      success: true,
      thumbnail: thumbnailUrl,
      gallery: galleryUrls
    });

  } catch (error) {
    console.error("Erro no upload de produto:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao processar upload do produto" 
    });
  }
});

module.exports = router;