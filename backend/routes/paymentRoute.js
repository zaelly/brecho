const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller.js');
const { fetchSeller } = require('../middlewares/auth.js');
const cors = require('cors');

router.use(express.json());
router.use(cors());

// Criar cobrança PIX via AbacatePay
router.post('/pix/create', fetchSeller, async (req, res) => {
  try {
    const { amount, description, customer } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valor é obrigatório e deve ser maior que zero.' });
    }

    const seller = await Seller.findById(req.seller.id).select('gateways');
    if (!seller || !seller.gateways || seller.gateways.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Configure sua chave AbacatePay no perfil antes de cobrar.'
      });
    }

    const apiKey = seller.gateways.trim();

    const body = {
      amount: Math.round(amount * 100), // converter para centavos
      description: description ? description.substring(0, 37) : 'Compra na loja',
      expiresIn: 3600, // 1 hora
    };

    if (customer && customer.name && customer.cellphone && customer.email && customer.taxId) {
      body.customer = customer;
    }

    const response = await fetch('https://api.abacatepay.com/v1/pixQrCode/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro AbacatePay:', data);
      return res.status(response.status).json({
        success: false,
        message: data.error || 'Erro ao criar cobrança PIX. Verifique sua chave AbacatePay.'
      });
    }

    res.json({ success: true, data: data.data });
  } catch (error) {
    console.error('Erro ao criar PIX:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
});

// Verificar status de um PIX
router.get('/pix/check/:pixId', fetchSeller, async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller.id).select('gateways');
    if (!seller || !seller.gateways || seller.gateways.trim() === '') {
      return res.status(400).json({ success: false, message: 'Gateway não configurado.' });
    }

    const apiKey = seller.gateways.trim();
    const { pixId } = req.params;

    const response = await fetch(`https://api.abacatepay.com/v1/pixQrCode/${pixId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ success: false, message: 'Erro ao verificar PIX.' });
    }

    res.json({ success: true, data: data.data });
  } catch (error) {
    console.error('Erro ao verificar PIX:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
});

module.exports = router;
