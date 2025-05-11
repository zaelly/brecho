
const uri = "mongodb+srv://root:zaellybarbosa2020@cluster0.vqh9nvr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

app.use(express.json());
app.use(cors());

//data connection mongodb

mongoose.connect(uri)
.then(() => console.log("Conectado ao MongoDB com sucesso"))
.catch((err) => console.error("Erro ao conectar no MongoDB:", err));

//criar API

app.get("/", (req, res)=>{
  res.send(`Express App rodando`)
})

//imagem storage engine
const storage = multer.diskStorage({
  destination: './upload/images',
  filename:(req, file,cb)=>{
    return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({storage:storage})
const fs = require("fs");
const { error } = require("console");

const dir = "./upload/images";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

//criar endpoint upload para imagens
app.use("/images", express.static("upload/images"))

app.post("/upload", upload.single('product'), (req, res)=>{
  res.json({
    success:1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  })
})


//tabela para criar produtos
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
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
  unit:{
    type: Number,
    required: true,
  }
});

// -------------------------
// Endpoints para VENDEDORES
// -------------------------

//model vendedor
const Seller = mongoose.model("Seller", {
  name:{
    type: String,
  },
  email:{
    type: String,
    unique: true,
  },
  password:{
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
  image:{
    type: String,
  }
});


// Rota de signup para vendedor
app.post("/seller/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let check = await Seller.findOne({ email });
    if (check) {
      return res.status(400).json({ success: false, errors: "Email já cadastrado!" });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 8);

    const seller = new Seller({
      name,
      email,
      password: hashedPassword
    });

    await seller.save();

    const data = {
      seller: {
        id: seller._id
      }
    };

    const token = jwt.sign(data, "secret_seller");
    res.json({ success: true, token });
  } catch (err) {
    console.error("Erro no signup do vendedor:", err);
    res.status(500).json({ success: false, errors: "Erro interno do servidor" });
  }
});

// Rota de login para vendedor
app.post("/seller/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });
    if (seller) {
      const isMatch = await bcrypt.compare(password, seller.password);
      if (isMatch) {
        const data = {
          seller: {
            id: seller._id
          }
        };
        const token = jwt.sign(data, "secret_seller");
        return res.json({ success: true, token });
      }
    }
    res.status(401).json({ success: false, errors: "Credenciais inválidas" });
  } catch (err) {
    console.error("Erro no login do vendedor:", err);
    res.status(500).json({ success: false, errors: "Erro interno do servidor" });
  }
});

// autenticação do vendedor
const fetchSeller = async (req, res, next) => {
  const token = req.header("auth-token");
  console.log("Token recebido:", token);
  if (!token) return res.status(400).json({ errors: "Token necessário" });

  try {
    const data = jwt.verify(token, "secret_seller");
    req.seller = data.seller;
    next();
  } catch (err) {
    console.error("Erro na verificação do token do vendedor:", err);
    return res.status(401).json({ errors: "Token inválido" });
  }
};

//tras uma imagem carregada pelo usuario no perfil
app.post("/uploadprofileimage", fetchSeller, upload.single('profile'), (req, res)=>{
  res.json({
    success:1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  })
})

app.post('/seller/addproduct', fetchSeller, async (req,res)=>{
  try {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
      let last_product = products[products.length - 1];
      id = last_product.id + 1;
    } else {
      id = 1;
    }
    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
      sellerId: req.seller.id,
      unit: req.body.unit
    });
    await product.save();
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (err) {
    console.error("Erro ao adicionar produto:", err);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

//Criando api para deletar produtos
app.post('/seller/removeproduct', fetchSeller, async(req,res)=>{
  try {
    const product = await Product.findOne({ id: req.body.id });
    if (!product) {
      return res.status(404).json({ success: false, message: "Produto não encontrado" });
    }
    // Verifica se o produto pertence ao vendedor logado
    if (product.sellerId !== req.seller.id) {
      return res.status(403).json({ success: false, message: "Você não tem permissão para remover este produto" });
    }
    await Product.deleteOne({ id: req.body.id });
    res.json({ success: true, message: "Produto removido com sucesso" });
  } catch (err) {
    console.error("Erro ao remover produto:", err);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

// criando api para pegar todos produtos
app.get('/seller/allproducts', fetchSeller, async(req, res)=>{
  let products = await Product.find({ sellerId: req.seller.id });

  console.log("Todos produtos achados")
  res.send(products);
})

//perfil vendedor
app.post("/updateprofile", fetchSeller, async (req, res) => {
  try {
    const { name, email, new_password, image, description } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (description) updateFields.description = description;
    if (image) updateFields.image = image;
    if (new_password) {
      const hashedPassword = await bcrypt.hash(new_password, 8);
      updateFields.password = hashedPassword;
    }

    await Seller.findByIdAndUpdate(req.seller.id, updateFields);
    res.json({ success: true, message: "Perfil do vendedor atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar perfil do vendedor:", err);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

//trazer dados do vendedor
app.get("/getsellerprofile", fetchSeller, async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller.id).select("-password");
    res.json({ success: true, data: seller });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro ao buscar perfil." });
  }
});


// -------------------------
// Endpoints para USUARIOS
// -------------------------

//criando esquema para user model
const Users = mongoose.model('Users',{
  name:{
    type: String,
  },
  email:{
    type: String,
    unique: true,
  },
  password:{
    type: String,
  },
  cartData:{
    type: Object,
  },
  date:{
    type: Date,
    default: Date.now,
  }
})

//criando middleware para pegar usuarios
const fetchUser = async(req,res,next)=>{
  const token = req.header('auth-token');
  if(!token){
    res.status(400).send({errors:"Por favor autentique usando um token válido."})
  }else{
    try {
      const data = jwt.verify(token, 'secret_ecom');
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({errors:"Por favor autentique usando um token válido."})
    }
  }
}

//Criando ponto final para registro de usuario
app.post('/signup', async(req, res)=>{
  let check = await Users.findOne({email:req.body.email});
  if(check){
    return res.status(400).json({success:false, errors:"Já existe um usuário com este email!"});
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 8);

  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    cartData: cart,
  })

  await user.save();

  const data = {
    user:{
      id:user.id
    }
  }

  const token = jwt.sign(data, 'secret_ecom');
  res.json({success:true, token});
})

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const data = {
          user: {
            id: user._id
          }
        };
        const token = jwt.sign(data, "secret_ecom");
        return res.json({ success: true, token });
      } else {
        return res.status(401).json({ success: false, errors: "Senha incorreta" });
      }
    }
    res.status(404).json({ success: false, errors: "Email incorreto!" });
  } catch (err) {
    console.error("Erro no login do usuário:", err);
    res.status(500).json({ success: false, errors: "Erro interno do servidor" });
  }
});

//criando ponto para dados para novas coleções
app.get('/newcollections', async(req, res)=>{
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("NewCollections fetched");
  res.send(newcollection);
})

//criando ponto para popular para mulheres
app.get('/popularinwomen', async(req,res)=>{
  let products = await Product.find({category:"Feminino"});
  let popular_in_women = products.slice(0,4);
  console.log("popular para as mulheres fetched");
  res.send(popular_in_women);
})

// criando api para pegar todos produtos publicos
app.get('/allproducts', async(req, res)=>{
  try{
    let products = await Product.find({});

    console.log("Todos produtos achados")
    res.send(products);
  }catch(err){
    console.error("Erro ao buscar produtos", err)
    res.status(500).json({success:false, message:"Erro ao buscar produtos"})
  }
})


//add produto ao carrinho
app.post('/addtocart', fetchUser, async(req, res)=>{
  console.log("add", req.body.itemId);

  let userData = await Users.findOne({_id:req.user.id});
  userData.cartData[req.body.itemId] +=1;

  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
  res.send("Adicionado!")
})

//removendo produto do carrinho
app.post('/removefromcart', fetchUser, async(req,res)=>{
  console.log("removido", req.body.itemId);
  let userData = await Users.findOne({_id:req.user.id});

  if(userData.cartData[req.body.itemId] > 0)
  userData.cartData[req.body.itemId] -=1;

  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
  res.send("Removido!")
})

//trazer os produtos do carrinho
app.post('/getcart', fetchUser, async(req,res)=>{
  let userData = await Users.findOne({_id:req.user.id});
  res.json(userData.cartData);
})

//perfil usuario

//manda email do usuario
app.post('/sendemail', async(req,res)=>{
  const {email} = req.body;
  if(!email){
    return res.status(400).json({ message: 'E-mail é obrigatório' });
  }

  //Configura transportador SMTP com Gmail
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'zazabarbosa2@gmail.com',
      pass: 'vjyh aagk rpvd oelh',  
    },
  });

  const mailOptions = {
    from: 'zazabarbosa2@gmail.com',
    to: email,
    subject: 'Bem-vindo!',
    text: 'Obrigado por se inscrever!',
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ message: 'Erro ao enviar e-mail.' });
  }
})

//cria endpoint para unidade de produtos 
//cria endpoint para verificar se o produto esta habilitado, se nao tiver o produto nao é mostrado no front

app.listen(port, (err) => {
  if (err) {
    console.error(`Erro ao iniciar o servidor: ${err}`);
  } else {
    console.log(`Servidor rodando na porta ${port}`);
  }
});


