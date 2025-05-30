import './AddProduct.css'
import { useEffect, useState } from 'react';

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
    enable: false,
    inOffer: false,
  })

  const handleImage = (e)=>{
    setImage(e.target.files[0]);
  }
  const handleChange = (e) =>{
    const {name, value, type, checked} = e.target;

    setProductDetails((prev) =>({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  useEffect(()=>{
    const sellerId = localStorage.getItem('seller-id');
    if (sellerId) {
      setProductDetails(prev => ({ ...prev, sellerId }));
    }
  },[productDetails.sellerId])

  const successHandle = ()=>{
    alert("Produto Adicionado!");
    setProductDetails({
      name:"",
      image:"",
      category: "Feminino",
      new_price: "",
      old_price: "",
      sellerId: "",
      unit: "",
      enable: false,
      inOffer: false
    })
  }

  let offer = productDetails.inOffer;

  const Add_product = async ()=>{
    console.log(productDetails);
    let responseData;
    let product = { ...productDetails };

    let formData =  new FormData();
    product.new_price = Number(product.new_price);
    product.old_price = product.old_price ? Number(product.old_price) : undefined;
    product.unit = Number(product.unit);
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

      await fetch('http://localhost:4000/api/products/seller/addproduct' ,{
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
        <input 
          required 
          value={productDetails.name} 
          onChange={handleChange} 
          type="text" 
          name="name" 
          placeholder='Digite aqui' 
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Preço</p>
          {/* se a offer for true entao tem oferta e o value passa a ser old_price
          se for false entao nao tem oferta e o value passa a ser o new_price*/}
          <input 
            value={offer ? (productDetails.old_price || '') : (productDetails.new_price || '')} 
            onChange={handleChange} 
            type="number" 
            name={offer ? "old_price" : "new_price"}
            placeholder='Digite o valor aqui' 
          />
        </div>
        {offer && (
          <div className="addproduct-itemfield">
            <p>Preço de Oferta</p>
            <input value={(productDetails.new_price || '')} 
              onChange={handleChange} 
              required 
              type="number" 
              name="new_price"
              placeholder='Digite o valor aqui' 
            />
          </div>
        )}
        <div className="addproduct-itemfield">
          <p>Quantidade</p>
          <input 
            required 
            value={productDetails.unit} 
            onChange={handleChange} 
            type="number" 
            name="unit" 
            placeholder='Ex.: 100' 
          />
        </div>
        <div className="addproduct-itemfield check">      
          <p className="warning">
            Se o produto não estiver habilitado ele não é mostrado!
          </p>      
          <div className="group"> 
            <label htmlFor="enableCheckbox">Habilitado</label> 
            <input 
              onChange={handleChange} 
              checked={!!productDetails.enable} 
              type="checkbox" 
              name="enable" 
              required 
              id="enableCheckbox"
            /> 
          </div>
        </div>
        <div className="addproduct-itemfield check">
          <p className="warning">
            Se seu produto estiver em oferta adicione esta opção!
          </p> 
          <div className="group">
          <label htmlFor="checkOffer">
            Em oferta
          </label>
            <input 
              onChange={handleChange} 
              checked={!!productDetails.inOffer} 
              type="checkbox" 
              name="inOffer" 
              id="checkOffer"
            />
          </div>
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
            <img src={URL.createObjectURL(image)} className="addproduct-thumbnail-img" alt="Pré-visualização da imagem"/>
          ):(
            <i className="fa-solid fa-cloud-arrow-up cloud-arrow"></i>
          )}
        </label>
        <input onChange={handleImage} type="file" accept="image/*" name="image" id="file-input" hidden />
      </div>
      <button onClick={()=>{Add_product()}} className='addproduct-btn'>Adicionar</button>
    </div>
  )
}

export default AddProduct