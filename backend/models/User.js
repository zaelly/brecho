const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required : true
  },
  email: {
    type: String,
    unique: true,
    required : true
  },
  password: {
    type: String,
    required : true
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
    match: /^\d{11}$/,
  },
  adress:{
    type: String,
  },
  city:{
    type: String
  }
});

userSchema.index(
  {cpf: 1}, {unique:true, partialFilterExpression: {cpf: {$exist:true, $ne: null}}}
);

module.exports = mongoose.model('Users', userSchema);
