
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
  current_price:{
    type: Number,
    required: function () { return !this.inOffer; }
  },
  new_price:{
    type: Number,
    required: function () { return this.inOffer; }
  },
  old_price:{
    type: Number,
    required: function () { return this.inOffer; }
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
  size:{
    type: [String],
    default: [],
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
  },
  descriptionProduct:{
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Product', productSchema);
