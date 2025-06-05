const express = require("express");
const router = express.Router();
const Product = require('../models/Product.js');
const { fetchSeller } = require('../middlewares/auth');
const dotenv = require("dotenv");

// Carregar variáveis de ambiente
dotenv.config();
const cors = require("cors");

// Usar o JSON e CORS para as requisições
router.use(express.json());
router.use(cors());


//          //
//   site   //
//          //

// Endpoint para novas coleções
router.get('/newcollections', async (req, res) => {
  try {
    let products = await Product.find({});
    let newCollection = products.slice(1).slice(-8);
    console.log("Novas coleções fetchadas");
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
    console.log("Produtos populares para mulheres fetchados");
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
    console.log("Todos produtos encontrados");
    res.json(products);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    res.status(500).json({ success: false, message: "Erro ao buscar produtos." });
  }
});

 //                 //
//   adm seller   //
//               //


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
  let products = await Product.find({ sellerId: req.seller.id });

  console.log("Todos produtos achados")
  res.json(products);
})

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Erro interno do servidor." });
});

module.exports = router;