const express = require("express");
const router = express.Router();
const Product = require('../models/Product.js');
const { fetchSeller, fetchUser } = require('../middlewares/auth');
const dotenv = require("dotenv");
// const fs = require("fs");
const multer = require("multer");
const path = require("path");
// Carregar variáveis de ambiente
dotenv.config();
const cors = require("cors");

// Usar o JSON e CORS para as requisições
router.use(express.json());
router.use(cors());

// upload de imagens
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

const uploadMiddleware = upload.fields([{name:"thumbnail", maxCount:1}, {name:"gallery", maxCount:5}]);

function handleMulterError(err, req, res, next) {
  if (err) return res.status(400).json({ success: false, message: "Erro no upload de arquivos!" });
  next();
}

router.use("/images", express.static("upload/images"));
 
// Rota para upload de imagens
router.post("/upload-product", uploadMiddleware, handleMulterError, (req, res) => {
  if (!req.files || !req.files.thumbnail) {
    return res.status(400).json({ success: false, message: "Thumbnail obrigatória!" });
  }

  const thumbFile = req.files.thumbnail[0];
  const galleryFiles = req.files.gallery || [];

  const thumbName = `thumb_${Date.now()}${path.extname(thumbFile.originalname)}`;
  const galleryNames = galleryFiles.map((f, i) => `gal_${i}_${Date.now()}${path.extname(f.originalname)}`);

  res.json({
    success: true,
    thumbnail: thumbName,
    gallery: galleryNames,
  });
});

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
  try {
    let products = await Product.find({});

    const productWithUrl = products.map((product)=>{
      const p = product.toObject();
      const protocol = req.protocol;
      const host = req.get("host")
      const baseUrl = `${protocol}://${host}/images/`

      p.thumbnail = p.thumbnail ? baseUrl + p.thumbnail : null;
      p.gallery = p.gallery.map((m)=> baseUrl + m);

      return p;
    })

    res.json(productWithUrl);
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
    current_price, enable, inOffer, gallery, thumbnail
  } = req.body;

  console.log(req.body, "dados do produto recebidos no backend")

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
      gallery: gallery || [],
      thumbnail: thumbnail,
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

    console.log(product, "produto a ser salvo")

    await product.save();

    res.json({
      success: true,
      name: name,
    });

  } catch (err) {
    console.error("Erro ao adicionar produto:", err);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

router.get('/seller/getproduct:productId', async (req, res) =>{
  let product = await Product.findById({_id: data._id})

  if(!product){
    return res.json({success:false, message:"Produto não encontrado!"});
  }

  res.json(product)
})

router.put("/seller/editproduct", fetchSeller, async (req, res) => {
  try{
    const requiredFields = [
      'name', 'unit', 'category', 'descriptionProduct', 
      'conditions', 'marca', 'size', 'new_price', 'old_price',
      'current_price', 'thumbnail', 'gallery', 'enable', 'inOffer',
    ];

    const data = req.body;
    const updateFields = {};

    for(const field of requiredFields) {
      if(data[field] === undefined || data[field] === null){
        return res.status(400).json({success:false, message: `faltando ${field} na lista`})
      }

      updateFields[field] = data[field]
    };
  
    const updated = await Product.findOneAndUpdate(
      {_id: data._id, sellerId: req.seller.id}, 
      updateFields, 
      {new: true}
    );
    if(!updated){
      return res.status(404).json({ success: false, message: "Produto não encontrado ou permissão negada." });
    }

    res.json({ success: true, message: "Produto atualizado com sucesso." })

    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
      res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
})

//Criando api para deletar produtos
router.delete('/seller/removeproduct', fetchSeller, async (req, res) => {
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