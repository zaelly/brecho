const express = require("express");
const router = express.Router();
const Order = require('../models/Order.js');
const Product = require('../models/Product.js');
const Users = require('../models/User.js');
const { fetchSeller, fetchUser } = require('../middlewares/auth');
const nodemailer = require("nodemailer");
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

// Buscar pedidos do usuario logado
router.get('/order/myorders', fetchUser, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .sort({ dateOrder: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error('Erro ao buscar pedidos do usuario:', error);
        res.status(500).json({ success: false, message: "Erro ao buscar pedidos." });
    }
});

// Criar pedido
router.post('/order/create', fetchUser, async (req, res) => {
    try {
        const { items, totalAmount, paymentForm, address, city, sellerId } = req.body;

        const orderId = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

        const order = new Order({
            name: req.body.userName || 'Cliente',
            image: items[0]?.thumbnail || '',
            orderId: orderId,
            userId: req.user.id,
            sellerId: sellerId || '',
            items: items,
            totalAmount: totalAmount,
            paymentForm: paymentForm,
            statusOrder: 'Processando',
            address: address,
            city: city,
            toReceive: totalAmount,
        });

        await order.save();

        // diminuir estoque dos produtos
        for (const item of items) {
            if (item.productId) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { unit: -item.quantity }
                });
            }
        }

        // enviar email de confirmacao do pedido
        try {
            const user = await Users.findById(req.user.id);
            if (user && user.email) {
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                    tls: { rejectUnauthorized: false }
                });

                const itemsList = items.map(i => `- ${i.name} (Tam: ${i.size}, Qtd: ${i.quantity}) - R$${(i.price * i.quantity).toFixed(2)}`).join('\n');

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: `Pedido Confirmado - ${orderId}`,
                    text: `Ola ${user.name}!\n\nSeu pedido foi confirmado com sucesso!\n\nPedido: ${orderId}\n\nItens:\n${itemsList}\n\nTotal: R$${totalAmount.toFixed(2)}\nEndereco: ${address}, ${city}\n\nObrigado por comprar no Reverto Brecho!\nJuntos pela moda circular e sustentabilidade.`,
                };

                await transporter.sendMail(mailOptions);
                console.log("Email de confirmacao enviado para:", user.email);
            }
        } catch (emailErr) {
            console.error("Erro ao enviar email (pedido ja foi criado):", emailErr);
        }

        res.json({ success: true, message: "Pedido criado com sucesso!", order });
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        res.status(500).json({ success: false, message: "Erro ao criar pedido." });
    }
});

module.exports = router;