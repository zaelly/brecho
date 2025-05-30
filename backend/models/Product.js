
const mongoose = require('mongoose');
//tabela para criar produtos
const productSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  image:{
    type: String,
    required: true,
  },
  category:{
    type: String,
    required: true,
  },
  new_price:{
    type: Number,
    required: true,
  },
  old_price:{
    type: Number,
  },
  date:{
    type: Date,
    default: Date.now,
  },
  avaliable:{
    type: Boolean,
    default: true,
  },
  sellerId:{
    type: String,
    required: true,
  },
  unit: {
    type: Number,
    required: true,
    min: 1
  },
  enable: {
    type: Boolean,
    default: false,
    required: true,
  },
  inOffer: {
    type: Boolean,
    default: false,
    required: true,
  }
});

module.exports = mongoose.model('Product', productSchema);
