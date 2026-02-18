// routes/cartRouter.js
const express = require("express");
const router = express.Router();
const Users = require("../models/User");
const { fetchUser } = require("../middlewares/auth");

router.post('/addtocart', fetchUser, async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const qty = Math.max(1, parseInt(quantity) || 1);
    if (!itemId || !size) return res.status(400).json({ success: false, message: "itemId e size são obrigatórios." });

    let user = await Users.findById(req.user.id);
    let cart = { ...user.cartData };

    if (!cart[itemId]) {
      cart[itemId] = {};
    }

    cart[itemId][size] = (cart[itemId][size] || 0) + qty;

    await Users.findByIdAndUpdate(req.user.id, { cartData: cart });
    res.json({ success: true, message: "Produto adicionado ao carrinho!" });
  } catch (err) {
    console.error("Erro ao adicionar ao carrinho:", err);
    res.status(500).json({ success: false, message: "Erro ao adicionar produto ao carrinho." });
  }
});

router.post('/removefromcart', fetchUser, async (req, res) => {
  try {
    const { itemId, size } = req.body;
    if (!itemId || !size) return res.status(400).json({ success: false, message: "itemId e size são obrigatórios." });

    let user = await Users.findById(req.user.id);
    let cart = { ...user.cartData };

    if (cart[itemId][size]) {
      if (cart[itemId][size] > 1) {
        cart[itemId][size] -= 1;
      } else {
        delete cart[itemId][size];
      }

      if (Object.keys(cart[itemId]).length === 0) {
        delete cart[itemId];
      }
    }

    await Users.findByIdAndUpdate(req.user.id, { cartData: cart });
    res.json({ success: true, message: "Produto removido do carrinho!" });
  } catch (err) {
    console.error("Erro ao remover do carrinho:", err);
    res.status(500).json({ success: false, message: "Erro ao remover produto do carrinho." });
  }
});

router.post('/getcart', fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    res.json({ success: true, cart: user.cartData });
  } catch (err) {
    console.error("Erro ao buscar produtos do carrinho:", err);
    res.status(500).json({ success: false, message: "Erro ao buscar produtos do carrinho." });
  }
});

module.exports = router;
