const express = require("express");
const router = express.Router();
const Product = require('../models/Product.js');
const { fetchSeller, fetchUser } = require('../middlewares/auth');
const dotenv = require("dotenv");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Carregar variáveis de ambiente
dotenv.config();
const cors = require("cors");

// Usar o JSON e CORS para as requisições
router.use(express.json());
router.use(cors());

// upload de imagens
const dir = "./upload/images";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Configuração do Multer para o upload de imagens
const storage = multer.diskStorage({
  destination: dir,
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

const uploadMiddleware = upload.fields([{name:"thumbnail", maxCount:1}, {name:"gallery", maxCount:5}]);

function handleMulterError(err, req, res, next) {
  if(err instanceof multer.MulterError){
    return res.status(400).json({success:false, message: "erro ao enviar seu arquivo!"});
  } else if(err){
    return res.status(400).json({success:false, message: "erro ao enviar seu arquivo!"});
  } else if(req.files.gallery.length === 0 || req.files.gallery === undefined){
    return res.status(400).json({success:false, message: "Nenhum arquivo enviado!"});
  }

  next();
}

router.use("/images", express.static("upload/images"));
 
// Rota para upload de imagens (simplificada para testar)
router.post("/upload-product", 
  async (req,res) => {    
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
        return res.status(400).json({ success: false, message: "Thumbnail obrigatória!" });
      }

      if (!galleryUrls || galleryUrls.length === 0) {
        return res.status(400).json({ success: false, message: "Gallery obrigatória!" });
      }

      console.log('Upload recebido:', { thumbnailUrl, galleryUrls });

      res.json({
        success: true,
        thumbnail: thumbnailUrl,
        gallery: galleryUrls
      });

    } catch (error) {
      console.error('Erro no upload:', error);
      res.status(500).json({ 
        success: false, 
        message: "Erro ao processar upload" 
      });
    }
  }
);

// Função auxiliar para upload para Cloudinary
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

// -------------------------
// Rotas do Vendedor (Seller)
// -------------------------

// Listar todos os produtos (rota pública para clientes)
router.get('/allproducts', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Listar todos os produtos do vendedor autenticado
router.get('/seller/allproducts', fetchSeller, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.seller.id });
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos do vendedor:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Novas coleções (produtos recentes)
router.get('/newcollections', async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ date: -1 })
      .limit(8);
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar novas coleções:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Popular em mulheres (produtos em oferta)
router.get('/popularinwomen', async (req, res) => {
  try {
    const products = await Product.find({ inOffer: true })
      .limit(8);
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos populares:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Adicionar produto do vendedor
router.post('/seller/addproduct', fetchSeller, async (req, res) => {
  try {
    const {
      name, thumbnail, gallery, category,
      current_price, new_price, old_price,
      unit, size, enable, inOffer,
      descriptionProduct, conditions, marca
    } = req.body;

    const product = new Product({
      name,
      thumbnail,
      gallery,
      category,
      current_price,
      new_price,
      old_price,
      unit,
      size,
      enable,
      inOffer,
      descriptionProduct,
      conditions,
      marca,
      sellerId: req.seller.id
    });

    await product.save();
    res.json({ success: true, message: 'Produto adicionado com sucesso!', product });
  } catch (error) {
    console.error('Erro ao adicionar produto:', error.message || error);
    const message = error.name === 'ValidationError'
      ? Object.values(error.errors).map(e => e.message).join(', ')
      : 'Erro interno do servidor';
    res.status(500).json({ success: false, message });
  }
});

// Editar produto do vendedor
router.post('/seller/editproduct', fetchSeller, async (req, res) => {
  try {
    const { id, name, thumbnail, gallery, category,
      current_price, new_price, old_price,
      unit, size, enable, inOffer,
      descriptionProduct, conditions, marca } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (thumbnail !== undefined) updateFields.thumbnail = thumbnail;
    if (gallery !== undefined) updateFields.gallery = gallery;
    if (category !== undefined) updateFields.category = category;
    if (current_price !== undefined) updateFields.current_price = current_price;
    if (new_price !== undefined) updateFields.new_price = new_price;
    if (old_price !== undefined) updateFields.old_price = old_price;
    if (unit !== undefined) updateFields.unit = unit;
    if (size !== undefined) updateFields.size = size;
    if (enable !== undefined) updateFields.enable = enable;
    if (inOffer !== undefined) updateFields.inOffer = inOffer;
    if (descriptionProduct !== undefined) updateFields.descriptionProduct = descriptionProduct;
    if (conditions !== undefined) updateFields.conditions = conditions;
    if (marca !== undefined) updateFields.marca = marca;

    const product = await Product.findOneAndUpdate(
      { _id: id, sellerId: req.seller.id },
      updateFields,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto nao encontrado' });
    }

    res.json({ success: true, message: 'Produto editado com sucesso!', product });
  } catch (error) {
    console.error('Erro ao editar produto:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Buscar produto por ID para edicao
router.get('/seller/getproduct/:id', fetchSeller, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, sellerId: req.seller.id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto nao encontrado' });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// Remover produto do vendedor
router.post('/seller/removeproduct', fetchSeller, async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findOneAndDelete({ _id: id, sellerId: req.seller.id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado' });
    }
    res.json({ success: true, message: 'Produto removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});

// -------------------------
// Rotas de Avaliações
// -------------------------

router.get('/getreviews/:productId', async(req,res)=>{
  try {

    const product = await Product.findById(req.params.productId)

    if(!product || !product.reviews){
      return res.json([])
    }

    res.json(product.reviews || []);
  } catch (error) {
    console.error('Erro ao buscar avaliações!', error);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
})

router.post('/updatereview', fetchUser, async(req,res)=>{
  try{
    const {rating, comment, reviewId, productId} = req.body

    const product = await Product.findById(productId)
    if(!product){
      return res.status(400).json({success: false, message: "Produto não encontrado!"})
    }

    const review = product.reviews.id(reviewId)
    if(!review){
      return res.status(400).json({success: false, message: "Review não encontrada!"})
    }

    if (review.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "Você não pode editar esta review" });
    }

    // atualiza comentario e estrelas
    review.comment = comment;
    review.rating = rating;

    await product.save()
    return res.json({success: true, message: "Review editada com sucesso!", product})
  }catch(error){
    console.error('Edição falhou!:', error);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
})

router.post('/removefromreview', fetchUser, async(req,res)=>{
  try {
      const {productId, reviewId} = req.body;

      const product = await Product.findById(productId)

      if(!product){
        return res.status(400).json({success: false, message: "Produto não encontrado!"})
      }

      const review = product.reviews.id(reviewId)
      if(!review){
        return res.status(400).json({success: false, message: "Review não encontrada!"})
      }

      if (review.userId.toString() !== req.user.id.toString()) {
        return res.status(403).json({ success: false, message: "Você não pode excluir esta review" });
      }
      review.deleteOne();

      product.reviews = product.reviews.filter((e)=> e.rating != null)

      await product.save()
      res.json({ success: true, product});

    } catch (err) {
      console.error("Erro ao remover review:", err);
      res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
})

module.exports = router;