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
        const { chat, clientId } = req.query;

        let filter = { chat: chat };

        // Se clientId for informado, filtrar apenas mensagens entre o cliente e o vendedor
        if (clientId) {
            filter.$or = [
                { sender: clientId },
                { sender: chat }
            ];
        }

        let chatMessages = await Message.find(filter).sort({ createdAt: 1 });
        let messages = chatMessages.map(msg => ({
            content: msg.content,
            sender: msg.sender,
            createdAt: msg.createdAt
        }));

        res.status(200).json({ success: true, data: messages });

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

            // contar mensagens nao lidas do cliente
            const msgCount = await Message.countDocuments({
                chat: sellerId,
                sender: clientId,
                read: false,
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

        // marcar mensagens do cliente como lidas
        await Message.updateMany(
            { chat: sellerId, sender: clientId, read: false },
            { read: true }
        );

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

// Buscar todas as conversas do cliente (agrupadas por vendedor)
router.get("/clientConversations", fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;

        // buscar todos os chats distintos onde o usuario enviou ou recebeu mensagens
        // O cliente envia msgs com sender=userId e chat=sellerId
        // O vendedor responde com sender=sellerId e chat=sellerId
        // Entao o "chat" field = sellerId
        const chatsAsSender = await Message.distinct('chat', { sender: userId });

        // tambem buscar chats onde o vendedor respondeu para este cliente
        // Mensagens do vendedor: sender=sellerId, chat=sellerId, mas precisamos saber quais sao para este cliente
        // Na arquitetura atual, todas as msgs de um chat ficam com chat=sellerId
        // Entao os chats que o cliente participa sao os que ele mandou msg
        const sellerIds = chatsAsSender.map(id => String(id));

        const Seller = require('../models/Seller.js');
        const conversations = [];

        for (const sellerId of sellerIds) {
            // buscar ultima mensagem entre cliente e vendedor
            const lastMsg = await Message.findOne({
                chat: sellerId,
                $or: [{ sender: userId }, { sender: sellerId }]
            }).sort({ createdAt: -1 });

            // buscar dados do vendedor
            let sellerData = { name: 'Vendedor', image: '' };
            try {
                const seller = await Seller.findById(sellerId).select('name image');
                if (seller) {
                    sellerData = { name: seller.name, image: seller.image || '' };
                }
            } catch(e) {}

            // contar mensagens nao lidas (do vendedor para o cliente)
            const unreadCount = await Message.countDocuments({
                chat: sellerId,
                sender: sellerId,
                read: false,
            });

            conversations.push({
                sellerId: sellerId,
                sellerName: sellerData.name,
                sellerImage: sellerData.image,
                lastMessage: lastMsg ? lastMsg.content : '',
                lastMessageTime: lastMsg ? lastMsg.createdAt : null,
                messageCount: unreadCount,
            });
        }

        conversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

        res.json({ success: true, conversations });

    } catch(error) {
        console.error("Erro ao buscar conversas do cliente:", error);
        res.status(500).json({ success: false, errors: error.message });
    }
});

// Buscar mensagens entre cliente e um vendedor especifico
router.get("/clientMessages", fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { sellerId } = req.query;

        if (!sellerId) {
            return res.status(400).json({ success: false, message: "sellerId obrigatorio" });
        }

        const messages = await Message.find({
            chat: sellerId,
            $or: [
                { sender: userId },
                { sender: sellerId }
            ]
        }).sort({ createdAt: 1 });

        // marcar mensagens do vendedor como lidas
        await Message.updateMany(
            { chat: sellerId, sender: sellerId, read: false },
            { read: true }
        );

        const data = messages.map(msg => ({
            content: msg.content,
            sender: String(msg.sender),
            createdAt: msg.createdAt,
        }));

        res.json({ success: true, data });

    } catch(error) {
        console.error("Erro ao buscar mensagens do cliente:", error);
        res.status(500).json({ success: false, errors: error.message });
    }
});

module.exports = router;