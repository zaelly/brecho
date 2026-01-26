const express = require("express");
const cors = require("cors");
const connectDB = require("./lib/mongoose");

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res.send("🚀 API rodando na Vercel");
});

const userRoutes = require('../routes/user');
const sellerRoutes = require('../routes/seller');
const cartRoutes = require('../routes/cartRoute');
const productRoutes = require('../routes/products');
const orderRoutes = require('../routes/orderRoute');
const chatRoutes = require('../routes/chatRoute');

// rotas
app.use('/api/users', userRoutes); 
app.use('/api/products', productRoutes); 
app.use('/api/cart', cartRoutes);        
app.use('/api/sellers', sellerRoutes);   
app.use('/api/order', orderRoutes);
app.use('/api/chat', chatRoutes);

module.exports = app;
