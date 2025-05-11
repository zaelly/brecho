import './AddProduct.css'
import { useState } from 'react';

const AddProduct = () => {

  const [image, setImage] = useState(false)
  const [productDetails, setProductDetails] = useState({
    name:"",
    image:"",
    category: "Feminino",
    new_price: "",
    old_price: "",
    unit: "",
    sellerId: "",
  })

  const handleImage = (e)=>{
    setImage(e.target.files[0]);
  }
  const handleChange = (e) =>{
    setProductDetails({...productDetails, [e.target.name]:e.target.value})
  }

  const successHandle = ()=>{
    alert("Produto Adicionado!");
    setProductDetails({
      name:"",
      image:"",
      category: "Feminino",
      new_price: "",
      old_price: "",
      sellerId: "",
      unit: ""
    })
  }

  const Add_product = async ()=>{
    console.log(productDetails);
    let responseData;
    let product = productDetails;

    let formData =  new FormData();
    formData.append('product', image);

    await fetch('http://localhost:4000/upload',{
      method:'POST',
      headers:{
        Accept:'application/json',
      },
      body: formData,
    }).then((resp) => resp.json())
    .then((data)=>{responseData=data})

    if(responseData.success){
      product.image = responseData.image_url;

      await fetch('http://localhost:4000/seller/addproduct' ,{
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json',
          'auth-token': localStorage.getItem('auth-token'), // ou onde você salva o token do vendedor
        },
        body: JSON.stringify(product),
      }).then((resp)=>resp.json()).then((data)=>{
        data.success ? successHandle() : alert("Adição de produto falhou!")
      })
    }
  }

  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Titulo do Produto</p>
        <input required value={productDetails.name} onChange={handleChange} type="text" name="name" placeholder='Digite aqui' />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Preço Antigo</p>
          <input value={productDetails.old_price} onChange={handleChange} type="number" name="old_price" placeholder='Digite o valor aqui' />
        </div>
        <div className="addproduct-itemfield">
          <p>Novo Preço</p>
          <input value={productDetails.new_price} onChange={handleChange} required type="number" name="new_price" placeholder='Digite o valor aqui' />
        </div>
        <div className="addproduct-itemfield">
          <p>Quantidade</p>
          <input required value={productDetails.unit} onChange={handleChange} type="number" name="unit" placeholder='Ex.: 100' />
        </div>
        <div className="addproduct-itemfield check">
             <p>Habilitado</p>
            <input onChange={handleChange} value={productDetails.enable} type="checkbox" name="enable" required/>
        </div>
      </div>
      <div className="add-product-itemfield">
        <p>Categoria do Produto</p>
        <select value={productDetails.category} onChange={handleChange} name="category" className='add-product-selector'>
          <option value="Feminino">Feminino</option>
          <option value="Masculino">Masculino</option>
          <option value="kid">Kid</option>
          <option value="Unissex">Unissex</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          {image ? (
            <img src={URL.createObjectURL(image)} className="addproduct-thumbnail-img" />
          ):(
            <i className="fa-solid fa-cloud-arrow-up cloud-arrow"></i>
          )}
        </label>
        <input onChange={handleImage} type="file" name="image" id="file-input" hidden />
      </div>
      <button onClick={()=>{Add_product()}} className='addproduct-btn'>Adicionar</button>
    </div>
  )
}

export default AddProduct