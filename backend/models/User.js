const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  cartData: {
    type: Object,
    default: {},
  },
  date: {
    type: Date,
    default: Date.now,
  },
  cpf: {
    type: String,
    unique: true, 
    match: /^\d{11}$/
  },
  adress:{
    type: String,
  },
  city:{
    type: String
  }
});

module.exports = mongoose.model('Users', userSchema);
