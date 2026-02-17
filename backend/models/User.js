const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  image: {
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
    match: /^\d{11}$/,
  },
  adress:{
    type: String,
  },
  city:{
    type: String
  },
  favorites:{
    type: [String],
    default: [],
  },
  cep:{
    type: String
  },
});

userSchema.index(
  {cpf: 1}, {unique:true, partialFilterExpression: {cpf: {$exist:true, $ne: null}}}
);

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Users', userSchema);
