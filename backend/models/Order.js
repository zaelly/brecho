const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name:{
    type: String,
    required: true,
    },
    image:{
        type: String,
        required: true,
    },
    orderId:{
        type: String,
        required: true,
    },
    userId:{
        type: String,
    },
    sellerId:{
        type: String,
    },
    items:[{
        productId: String,
        name: String,
        size: String,
        quantity: Number,
        price: Number,
        thumbnail: String,
    }],
    totalAmount:{
        type: Number,
    },
    address:{
        type: String,
    },
    city:{
        type: String,
    },
    dateOrder: {
        type: Date,
        default: Date.now
    },
    paymentForm: {
        type: Number,
        required: true,
    },
    statusOrder: {
        enum: ['Processando', 'Em andamento', 
            'Sendo preparado', 'Enviado',
            'Finalizado', 'Cancelado'
        ],
    },
    toReceive: {
        type: Number
    }
})

module.exports = mongoose.model('Order', orderSchema);