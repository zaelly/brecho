const express = require('express');
const router = express.Router();
const { fetchUser, fetchSeller } = require('../middlewares/auth.js');
const Users = require('../models/User.js');
const Chat = require('../models/Chat.js');
const Message = require('../models/Message.js');
const cors = require("cors");
const mongoose = require("mongoose");

// Usar o JSON e CORS para as requisições
router.use(express.json());
router.use(cors());

// -------------------------
// Endpoints para CHAT
// -------------------------

const port = process.env.PORT || 4000;
const url = process.env.VITE_API_URL || `http://localhost:${port}`;

// Rota para acessar ou criar um chat entre dois usuários
// router.post("/chat/access", fetchUser, async (req, res) => {

//     try {
//         // Pega o userId do corpo da requisição
        
//         // verifica se existe um chat entre os dois usuários e se não existir cria um novo
       
//         // popular os dados do usuário que mandou a última mensagem
        
//     }catch (error) {
//         res.status(500).json({ success: false, errors: error.message });
//     }

// });

// Rota cria as mensagens do chat
router.post("/saveMessage", async (req, res) => {
    try{
        const { chat, sender, content } = req.body;
        
        if(!chat){
            return res.status(400).json(
                { 
                    success: false, 
                    errors: "Parâmetros insuficientes para salvar a mensagem" 
                });
        }
      
        const newMessage = new Message({
            chat,
            sender,
            content
        });

        await newMessage.save();
        
        res.status(200).json({ success: true, data: newMessage });
        console.log(newMessage, "Mensagem salva com sucesso");

    }catch(error){
        res.status(500).json({ success: false, errors: error.message });
    }
})

router.get("/getMessages", async (req, res) => {
    try{
        const { chat } = req.query;

        let chatMessages = await Message.find({chat: chat}).sort({ createdAt: 1 });
        let messages = chatMessages.map(msg => ({
            content: msg.content,
            sender: msg.sender,
            createdAt: msg.createdAt
        }));

        res.status(200).json({ success: true, data: messages });
        console.log(messages, "Mensagens recuperadas com sucesso");

    }catch(error){
        res.status(500).json({ success: false, errors: error.message });
    }
})

// Rota para buscar todos os chats do usuário logado
// router.get("/chat", fetchUser, async (req, res) => {
//     try {
      
//         // popular os dados do usuário que mandou a última mensagem
      
//     }
//     catch (error) {
//         res.status(500).json({ success: false, errors: error.message });
//     }
// });

// Rota para buscar um chat específico pelo ID
// router.get("/chat/:chatId", fetchUser, async (req, res) => {
//     try {
      
//     } catch (error) {
//         res.status(500).json({ success: false, errors: error.message });
//     }   
// });

// Buscar todas as conversas do vendedor (agrupadas por cliente)
router.get("/sellerConversations", fetchSeller, async (req, res) => {
    try {
        const sellerId = req.seller.id;

        // buscar todas mensagens onde chat = sellerId
        const messages = await Message.find({ chat: sellerId }).sort({ createdAt: -1 });

        if (!messages || messages.length === 0) {
            return res.json({ success: true, conversations: [] });
        }

        // agrupar por sender (clientes que enviaram msg)
        // cada sender que NAO e o vendedor = uma conversa
        const conversationMap = {};

        for (const msg of messages) {
            const senderId = String(msg.sender);

            // se o sender e o proprio vendedor, a conversa e com quem?
            // precisamos achar o "outro" participante
            // como chat = sellerId, todas as msgs estao no mesmo "chat"
            // entao agrupamos por sender diferente do vendedor
            if (senderId === sellerId) continue;

            if (!conversationMap[senderId]) {
                conversationMap[senderId] = {
                    oderId: senderId,
                    lastMessage: msg.content,
                    lastMessageTime: msg.createdAt,
                    unread: 0,
                };
            }
        }

        // tambem incluir conversas onde o vendedor respondeu
        // pegar todos os senders unicos (que nao sao o vendedor)
        const allSenders = await Message.distinct('sender', { chat: sellerId });
        const clientIds = allSenders.filter(id => String(id) !== sellerId);

        const conversations = [];

        for (const clientId of clientIds) {
            // pegar ultima mensagem dessa conversa
            const lastMsg = await Message.findOne({
                chat: sellerId,
                $or: [{ sender: clientId }, { sender: sellerId }]
            }).sort({ createdAt: -1 });

            // buscar dados do cliente
            let clientData = { name: 'Usuario', image: '' };
            try {
                const user = await Users.findById(clientId).select('name image');
                if (user) {
                    clientData = { name: user.name, image: user.image || '' };
                }
            } catch(e) {
                // usuario nao encontrado, usar padrao
            }

            // contar mensagens do cliente (nao lidas - simplificado)
            const msgCount = await Message.countDocuments({
                chat: sellerId,
                sender: clientId,
            });

            conversations.push({
                clientId: String(clientId),
                clientName: clientData.name,
                clientImage: clientData.image,
                lastMessage: lastMsg ? lastMsg.content : '',
                lastMessageTime: lastMsg ? lastMsg.createdAt : null,
                messageCount: msgCount,
            });
        }

        // ordenar por ultima mensagem (mais recente primeiro)
        conversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

        res.json({ success: true, conversations });

    } catch(error) {
        console.error("Erro ao buscar conversas do vendedor:", error);
        res.status(500).json({ success: false, errors: error.message });
    }
});

// Buscar mensagens entre vendedor e um cliente especifico
router.get("/sellerMessages", fetchSeller, async (req, res) => {
    try {
        const sellerId = req.seller.id;
        const { clientId } = req.query;

        if (!clientId) {
            return res.status(400).json({ success: false, message: "clientId obrigatorio" });
        }

        // buscar todas mensagens do chat do vendedor, filtradas por sender = cliente OU sender = vendedor
        const messages = await Message.find({
            chat: sellerId,
            $or: [
                { sender: clientId },
                { sender: sellerId }
            ]
        }).sort({ createdAt: 1 });

        const data = messages.map(msg => ({
            content: msg.content,
            sender: String(msg.sender),
            createdAt: msg.createdAt,
        }));

        res.json({ success: true, data });

    } catch(error) {
        console.error("Erro ao buscar mensagens do vendedor:", error);
        res.status(500).json({ success: false, errors: error.message });
    }
});

module.exports = router;