const express = require('express');
const router = express.Router();
const { fetchUser } = require('../middlewares/auth.js');
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

module.exports = router;