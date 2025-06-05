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