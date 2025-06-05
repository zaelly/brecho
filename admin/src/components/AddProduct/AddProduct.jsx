import './AddProduct.css'
import { useEffect, useState } from 'react';

const AddProduct = () => {

  const [image, setImage] = useState(false)
  const [productDetails, setProductDetails] = useState({
    name:"",
    image:"",
    category: "Feminino",
    current_price: "",
    new_price: "",
    old_price: "",
    unit: "",
    sellerId: "",
    enable: false,
    inOffer: false,
    size: []
  })

  const handleImage = (e)=>{
    setImage(e.target.files[0]);
  }
  const handleChange = (e) =>{
    const {name, value, type, checked} = e.target;

    if (type === "checkbox" && name.startsWith("size")) {
    const sizeLabel = name.replace("size", ""); // ex: "PP"
    setProductDetails((prev) => {
      const updatedSizes = checked
        ? [...prev.size, sizeLabel]
        : prev.size.filter((s) => s !== sizeLabel);

      return {
        ...prev,
        size: updatedSizes,
      };
    });
    } else {
      setProductDetails((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : e.target.value,
      }));
    }
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
      current_price: "",
      new_price: "",
      old_price: "",
      sellerId: "",
      unit: "",
      enable: false,
      inOffer: false,
      size: []
    })
  }

  let offer = productDetails.inOffer;

  const Add_product = async ()=>{
    let responseData;
    let product = { ...productDetails };

    let formData =  new FormData();

    product.unit = Number(product.unit);
    product.old_price = product.old_price ? Number(product.old_price) : undefined;
    product.new_price = product.new_price ? Number(product.new_price) : undefined;
    product.current_price = product.current_price ? Number(product.current_price) : undefined;

    if (product.inOffer) {
      product.current_price = undefined;
      if (!product.old_price || !product.new_price) {
        alert("Preço antigo e preço de oferta são obrigatórios para produtos em oferta.");
        return;
      }
    } else {
      product.old_price = undefined;
      product.new_price = undefined;
      if (!product.current_price) {
        alert("Preço atual é obrigatório para produtos sem oferta.");
        return;
      }
    }

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
          'auth-token-seller': localStorage.getItem('auth-token'), // ou onde você salva o token do vendedor
        },
        body: JSON.stringify(product),
      }).then((resp)=>resp.json()).then((data)=>{
        data.success ? successHandle() : alert("Adição de produto falhou!")
      })
    }
  }

  return (
    <div className='add-product'>
      <div className="addproduct-price">
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
        <div className="addproduct-itemfield">
          <p>Preço</p>
          {/* se a offer for true entao tem oferta e o value passa a ser old_price
          se for false entao nao tem oferta e o value passa a ser o new_price
          
          se nao tiver oferta entao vai chamar o current_price*/}
          <input 
            value={offer ? (productDetails.old_price || '') : (productDetails.current_price || '')} 
            onChange={handleChange} 
            type="number" 
            name={offer ? "old_price" : "current_price"}
            placeholder='Digite o valor aqui' 
            required
          />
        </div>
        {offer && (
          <div className="addproduct-itemfield">
            <p>Preço de Oferta</p>
            <input value={(productDetails.new_price || '')} 
              onChange={handleChange} 
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
        <div className="add-product-itemfield category">
          <label htmlFor="category">Categoria do Produto</label>
          <select value={productDetails.category} onChange={handleChange} name="category" className='add-product-selector'>
            <option value="Feminino">Feminino</option>
            <option value="Masculino">Masculino</option>
            <option value="kid">Kid</option>
            <option value="Unissex">Unissex</option>
          </select>
        </div>
      </div>
      <div className="addproduct-productDetails">
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
        <div className="addproduct-itemfield check size">
          <label htmlFor="checkSize">
            Tamanhos
          </label>
            <p className="warning" style={{"margin": "0", "padding": '0', "fontSize": "12px"}}>
              Adicione os tamanhos disponiveis do seu produto!
            </p>
          <div className="group" style={{"marginBottom": "1rem"}}>
            <div className="sizeGroup">
              <input 
                onChange={handleChange} 
                type="checkbox" 
                name="sizePP" 
                id="sizePP"
                checked={productDetails.size.includes("PP")}
              />
              <p>PP</p>
            </div>
            <div className="sizeGroup">
              <input onChange={handleChange} type="checkbox" name="sizeP" id="sizeP" checked={productDetails.size.includes("P")}/>
              <p>P</p>
            </div>
            <div className="sizeGroup">
              <input onChange={handleChange} type="checkbox" name="sizeM" id="sizeM" checked={productDetails.size.includes("M")}/>
              <p>M</p>
            </div>
            <div className="sizeGroup">
              <input onChange={handleChange} type="checkbox" name="sizeG" id="sizeG" checked={productDetails.size.includes("G")}/>
              <p>G</p>
            </div>
            <div className="sizeGroup">
              <input onChange={handleChange} type="checkbox" name="sizeGG" id="sizeGG" checked={productDetails.size.includes("GG")}/>
              <p>GG</p>
            </div>
          </div>
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p style={{"margin": "0", "paddingTop": "1rem"}}>Adicione uma imagem!</p>
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