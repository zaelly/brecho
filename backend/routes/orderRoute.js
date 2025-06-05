const express = require("express");
const router = express.Router();
const Order = require('../models/Order.js');
const { fetchSeller } = require('../middlewares/auth');
const dotenv = require("dotenv");

// Carregar variáveis de ambiente
dotenv.config();
const cors = require("cors");

// Usar o JSON e CORS para as requisições
router.use(express.json());
router.use(cors());

router.get('/order/allorders', async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10); // Limite seguro

    try {
        const orders = await Order.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ dateOrder: -1 }); // Ordem decrescente por data

        const total = await Order.countDocuments();
        res.json({ success: true, orders, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        res.status(500).json({ success: false, message: "Erro ao buscar pedidos." });
    }
});

router.post('/order/updateOrder', fetchSeller, async (req, res)=>{
    try {
        const { orderId, fieldsToUpdate } = req.body;

        if (!orderId || !fieldsToUpdate) {
            return res.status(400).json({ success: false, message: "Dados incompletos para atualização." });
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId, sellerId: req.seller.id },
            fieldsToUpdate,
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Pedido não encontrado." });
        }

        res.json({ success: true, updatedOrder });
    } catch (error) {
        console.error("Erro ao atualizar pedido status do pedido:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
})

router.get('/order/getOrder', async(req, res)=>{

    const { id } = req.query;
     if (!id) {
        return res.status(400).json({ success: false, message: "ID do pedido não fornecido." });
    }

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Pedido não encontrado." });
        }
        res.json({ success: true, order });
    } catch (err) {
        console.error("Erro ao buscar pedido:", err);
        res.status(500).json({ success: false, message: "Erro ao buscar pedido." });
    }
})

module.exports = router;