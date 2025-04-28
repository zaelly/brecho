
const uri = "mongodb+srv://root:zaellybarbosa2020@cluster0.vqh9nvr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

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
    required: true,
  },
  date:{
    type: Date,
    default: Date.now,
  },
  avaliable:{
    type: Boolean,
    default: true,
  }
});

app.post('/addproduct', async (req,res)=>{

  let products = await Product.find({});
  let id;
  if(products.length>0){
    let last_product_array = products.slice(-1);
    let las_product = last_product_array[0];
    id = las_product.id+1;
  }else{
    id = 1;
  }
  const product = new Product({
    id:id,
    name:req.body.name,
    image:req.body.image,
    category:req.body.category,
    new_price:req.body.new_price,
    old_price:req.body.old_price,
  })
  console.log(product);
  await product.save()
  console.log("Salvo");
  res.json({
    success:true,
    name:req.body.name,
  })
})

//Criando api para deletar produtos

app.post('/removeproduct', async(req,res)=>{
  await Product.findOneAndDelete({id:req.body.id})
  console.log("removido")

  res.json({
    success: true,
    name:req.body.name
  })
})

// criando api para pegar todos produtos

app.get('/allproducts', async(req, res)=>{
  let products = await Product.find({});

  console.log("Todos produtos achados")
  res.send(products)
})

app.listen(port, (err) => {
  if (err) {
    console.error(`Erro ao iniciar o servidor: ${err}`);
  } else {
    console.log(`Servidor rodando na porta ${port}`);
  }
});


