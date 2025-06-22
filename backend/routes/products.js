const express = require("express");
const router = express.Router();
const Product = require('../models/Product.js');
const { fetchSeller, fetchUser } = require('../middlewares/auth');
const dotenv = require("dotenv");

// Carregar variáveis de ambiente
dotenv.config();
const cors = require("cors");

// Usar o JSON e CORS para as requisições
router.use(express.json());
router.use(cors());

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
    let products = await Product.find({ category: "Feminino" });
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

router.post('/seller/addproduct', fetchSeller, async (req,res)=>{
  try {
    const product = new Product({
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      current_price: req.body.current_price ? Number(req.body.current_price) : undefined,
      new_price: req.body.new_price ? Number(req.body.new_price) : undefined,
      old_price: req.body.old_price ? Number(req.body.old_price) : undefined,
      sellerId: req.seller.id,
      unit: Number(req.body.unit),
      size: Array.isArray(req.body.size) ? req.body.size : [],
      enable: req.body.enable === 'true' || req.body.enable === true,
      inOffer: req.body.inOffer === 'true' || req.body.inOffer === true,
      descriptionProduct: req.body.descriptionProduct
    });
    await product.save();
    res.json({
      success: true,
      name: req.body.name,
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
  let products = await Product.find({ sellerId: req.seller.id }).lean();

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
    name: req.body.name,
    userId: req.user.id,
    rating,
    comment,
    date: new Date()
  };

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
    const {rating, comment} = req.body
    const updateReview = {}

    if(rating) updateReview.rating = rating;
    if(comment) updateReview.comment = comment;

    await Product.findByIdAndUpdate(req.user.id, updateReview)
    res.json({success: true, message: 'Avaliação editada com sucesso!'})
  }catch(error){
    console.error('Edição falhou!:', error);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
})

router.post('/removefromreview', fetchUser, async(req,res)=>{
  try {
      const product = await Product.findById(req,body.productId)

      if (!product) {
        return res.status(404).json({ success: false, message: "Produto não encontrado" });
      }

      const updateReview = product.reviews.filter(review => review.userId.toString() !== req.user.id)

      product.reviews = updateReview;

      await product.save();
      res.json({ success: true, message: "Review removido com sucesso" });
    } catch (err) {
      console.error("Erro ao remover review:", err);
      res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
})

module.exports = router;