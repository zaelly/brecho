const express = require("express");
const router = express.Router();
const Product = require('../models/Product.js');
const { fetchSeller, fetchUser } = require('../middlewares/auth');
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
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
    return res.status(500).json({success:false, message: err.message});
  } else if(err){
    return res.status(500).json({success:false, message: err.message});
  } else if(req.files.gallery){
    return res.status(500).json({success:false, message: err.message});
  }

  console.log("Upload realizado com sucesso!");

  next();
}

router.use("/images", express.static("upload/images"));
 
// Rota para upload de imagens
router.post("/upload-product", uploadMiddleware, handleMulterError,
  (req,res) =>{
    const thumbnail = req.files.thumbnail[0]
    const gallery = req.files.gallery;

    // tratar erros, caso nao tenha feito o upload do arquivo exibir mensagem
    if(!thumbnail){
      return res.status(400).json({success: false, message: "Thumbnail não adicionada!"})
    }

    if(!gallery){
      return res.status(400).json({success: false, message: "Imagens não adicionadas!"})
    }

    // fazer loop para trazer todas as imagens que estao dentro do array de objetos
    gallery.forEach(e => {
      const fileName = e.filename
      console.log(fileName)
    });

    res.json({
      thumbnail: thumbnail?.filename,
      gallery: gallery,
    })
  }
)

// Endpoint para novas coleções
router.get('/newcollections', async (req, res) => {
  try {
    let products = await Product.find({});
    let newCollection = products.slice(1).slice(-8);
    res.json(newCollection);
  } catch (err) {
    console.error("Erro ao buscar novas coleções:", err);
    res.status(500).json({ success: false, message: "Erro ao buscar novas coleções." });
  }
});

// Endpoint para produtos populares para mulheres
router.get('/popularinwomen', async (req, res) => {
  try {
    let products = await Product.find({ category: "Feminina" });
    let popularInWomen = products.slice(0, 4);
    res.json(popularInWomen);
  } catch (err) {
    console.error("Erro ao buscar produtos populares para mulheres:", err);
    res.status(500).json({ success: false, message: "Erro ao buscar produtos populares." });
  }
});

// Endpoint para pegar todos os produtos
router.get('/allproducts', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    let products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    res.status(500).json({ success: false, message: "Erro ao buscar produtos." });
  }
});

router.post('/seller/addproduct', fetchSeller,
  async (req,res)=>{

   const {
    name, unit, category, descriptionProduct, 
    conditions, marca, size, new_price, old_price, 
    current_price, enable, inOffer
  } = req.body;

  const {gallery, thumbnail} = req.files;

  const tamanho = Array.isArray(size) ? size: [];
  const unidade = Number(unit);

  if(!name || !category || !descriptionProduct){
    return res.status(400).json({success: false, message: "Campos em branco!"})
  }

  if(!unidade){
    return res.status(400).json({success: false, message: "Unidade precisa ser maior que 0!"})
  }

  try {
    const product = new Product({
      name:name,
      gallery: gallery?.map(f => f.filename) || [],
      thumbnail: thumbnail?.filename,
      current_price: current_price ? Number(current_price) : undefined,
      new_price: new_price ? Number(new_price) : undefined,
      old_price: old_price ? Number(old_price) : undefined,
      sellerId: req.seller.id,
      unit: unidade,
      size: tamanho,
      enable: enable === "true" || enable === true,
      inOffer: inOffer === 'true' || inOffer === true,
      descriptionProduct: descriptionProduct,
      conditions: conditions,
      marca: marca,
      category: category
    });

    await product.save();

    res.json({
      success: true,
      name: name,
    });

    console.log(product, "produto")
  } catch (err) {
    console.error("Erro ao adicionar produto:", err);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

//Criando api para deletar produtos
router.post('/seller/removeproduct', fetchSeller, async (req, res) => {
  try {
    const product = await Product.findById(req.body.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Produto não encontrado" });
    }

    // Verifica se o produto pertence ao vendedor logado
    if (product.sellerId.toString() !== req.seller.id) {
      return res.status(403).json({ success: false, message: "Você não tem permissão para remover este produto" });
    }

    await product.deleteOne();
    res.json({ success: true, message: "Produto removido com sucesso" });
  } catch (err) {
    console.error("Erro ao remover produto:", err);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

// criando api para pegar todos produtos
router.get('/seller/allproducts', fetchSeller, async(req, res)=>{
  let products = await Product.find({ sellerId: req.seller.id });

  res.json(products);
})

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Erro interno do servidor." });
});

//comentarios/avaliações
router.post('/addreviews', fetchUser, async(req,res)=>{
  const {name, productId, rating, comment } = req.body;

  const review = {
    name: req.user.name || `Usuário-${req.user.id.slice(0,3)}`,
    userId: req.user.id,
    rating: rating || 1,
    comment,
    date: new Date()
  };

  console.log(review)

  try{
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $push: { reviews: review } },
      { new: true }
    );
    res.json({ success: true, product: updatedProduct });
  }catch(err){
    console.error('erro ao salvar avaliação!', err)
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
})

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