const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String,
  },
  shopDescription:{
    type: String
  }
});

module.exports = mongoose.model('Seller', sellerSchema);
