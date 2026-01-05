import './AddProduct.css'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {

  const [image, setImage] = useState(false)
  const [productDetails, setProductDetails] = useState({
    name:"",
    image:"",
    category: "Feminina",
    current_price: "",
    new_price: "",
    old_price: "",
    unit: "",
    sellerId: "",
    enable: false,
    inOffer: false,
    size: [],
    descriptionProduct: "",
    marca: '',
    conditions: ''
  })
  const url = import.meta.env.VITE_API_URL;

  const handleImage = (e)=>{
    setImage(e.target.files[0]);
  }

  const handleChange = (e) =>{
    const {name, type, checked} = e.target;

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
    toast.success("Produto Adicionado!");
    setProductDetails({
      name:"",
      image:"",
      category: "Feminina",
      current_price: "",
      new_price: "",
      old_price: "",
      sellerId: "",
      unit: "",
      enable: false,
      inOffer: false,
      size: [],
      descriptionProduct: "",
      marca: '',
      conditions: ''
    })
  }

  let offer = productDetails.inOffer;

  const Add_product = async ()=>{
    console.log('testew')
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
        toast.warn("Preço antigo e preço de oferta são obrigatórios para produtos em oferta.");
        return;
      }
      if(product.new_price > product.old_price){
        toast.warn("Preço antigo é MENOR que preço de oferta altere o valor!.");
        return;
      }
    } else {
      product.old_price = undefined;
      product.new_price = undefined;
      if (!product.current_price) {
        toast.warn("Preço atual é obrigatório para produtos sem oferta.");
        return;
      }
    }

    formData.append('product', image);

    await fetch(`${url}/upload`,{
      method:'POST',
      headers:{
        Accept:'application/json',
      },
      body: formData,
    }).then((resp) => resp.json())
    .then((data)=>{responseData=data})

    if(responseData.success){
      product.image = responseData.image_url;

      await fetch(`${url}/api/products/seller/addproduct` ,{
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json',
          'auth-token-seller': localStorage.getItem('auth-token'), // ou onde você salva o token do vendedor
        },
        body: JSON.stringify(product),
      }).then((resp)=>resp.json()).then((data)=>{
        data.success ? successHandle() : toast.error("Adição de produto falhou!")
      })
    }
  }

  return (
    <div className="container-geral">
      <form className="addproduct-form">

        {/* ===== INFORMAÇÕES PRINCIPAIS ===== */}
        <section className="form-section">
          <h3 className="section-title">Informações do Produto</h3>

          <div className="form-grid">
            <div className="addproduct-itemfield">
              <label>Título do Produto *</label>
              <input
                type="text"
                name="name"
                value={productDetails.name}
                onChange={handleChange}
                placeholder="Digite o nome do produto"
                required
              />
            </div>

            <div className="addproduct-itemfield">
              <label>Preço *</label>
              <input
                type="number"
                name={offer ? "old_price" : "current_price"}
                value={
                  offer
                    ? productDetails.old_price || ""
                    : productDetails.current_price || ""
                }
                onChange={handleChange}
                placeholder="Digite o valor"
                required
              />
            </div>

            {offer && (
              <div className="addproduct-itemfield">
                <label>Preço promocional</label>
                <input
                  type="number"
                  name="new_price"
                  value={productDetails.new_price || ""}
                  onChange={handleChange}
                  placeholder="Preço com desconto"
                />
              </div>
            )}

            <div className="addproduct-itemfield">
              <label>Quantidade *</label>
              <input
                type="number"
                name="unit"
                value={productDetails.unit}
                onChange={handleChange}
                placeholder="Ex: 100"
                required
              />
            </div>

            <div className="addproduct-itemfield">
              <label>Categoria *</label>
              <select
                name="category"
                value={productDetails.category}
                onChange={handleChange}
              >
                <option value="Feminina">Feminina</option>
                <option value="Masculina">Masculina</option>
                <option value="Kid">Kid</option>
                <option value="Unissex">Unissex</option>
                <option value="Eletronicos">Eletrônicos</option>
              </select>
            </div>
          </div>
        </section>

        {/* ===== STATUS ===== */}
        <section className="form-section">
          <h3 className="section-title">Status do Produto</h3>

          <div className="checkbox-grid">
            <div className="checkbox-item">
                <label className="switch">
                <input
                  type="checkbox"
                  name="enable"
                  checked={!!productDetails.enable}
                  onChange={handleChange}
                />
                <span className="slider"></span>
              </label>
              <span>Produto habilitado</span>
            </div>
           
            <div className="checkbox-item">
              <label className="switch">
                <input
                  type="checkbox"
                  name="inOffer"
                  checked={!!productDetails.inOffer}
                  onChange={handleChange}
                />
                <span className="slider"></span>
              </label>              
              <span>Produto em oferta</span>
            </div>
          </div>
        </section>

        {/* ===== TAMANHOS ===== */}
        <section className="form-section">
          <h3 className="section-title">Tamanhos disponíveis</h3>

          <div className="sizes-grid">
            {["PP", "P", "M", "G", "GG", "Unico"].map((size) => (
              <>
                <label key={size} className="size-item switch">
                  <input
                    type="checkbox"
                    name={`size${size}`}
                    checked={productDetails.size.includes(size)}
                    onChange={handleChange}
                  />
                  <span className="slider"></span>
                </label>
                <span>{size === "Unico" ? "Único" : size}</span>
              </>
            ))}
          </div>
        </section>

        {/* ===== DESCRIÇÃO ===== */}
        <section className="form-section">
          <h3 className="section-title">Detalhes do Produto</h3>

          <div className="form-grid">
            <div className="addproduct-itemfield">
              <label>Marca *</label>
              <input
                type="text"
                name="marca"
                value={productDetails.marca}
                onChange={handleChange}
                required
              />
            </div>

            <div className="addproduct-itemfield">
              <label>Condição do produto *</label>
              <input
                type="text"
                name="conditions"
                value={productDetails.conditions}
                onChange={handleChange}
                placeholder="Novo, usado, seminovo..."
              />
            </div>

            <div className="addproduct-itemfield full description">
              <label>Descrição do produto *</label>
              <textarea
                rows="5"
                name="descriptionProduct"
                value={productDetails.descriptionProduct}
                onChange={handleChange}
                placeholder="Descreva seu produto"
              />
            </div>
          </div>
        </section>

        {/* ===== IMAGENS ===== */}
        <section className="form-section">
          <h3 className="section-title">Imagens do Produto</h3>

          <div className="images-group">
            {/* imagem de thumbnail */}
            <div className="image-upload">
              <label htmlFor="file-input">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="addproduct-thumbnail-img"
                  />
                ) : (
                  <i className="fa-solid fa-cloud-arrow-up cloud-arrow"></i>
                )}
              </label>
              <input
                type="file"
                id="file-input"
                accept="image/*"
                hidden
                onChange={handleImage}
              />
              <p>Imagem principal</p>
            </div>
            {/* imagens de carrosel */}
            <div className="image-upload">
              <label htmlFor="file-input">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="addproduct-thumbnail-img"
                  />
                ) : (
                  <i className="fa-solid fa-cloud-arrow-up cloud-arrow"></i>
                )}
              </label>
              <p>Outras imagens</p>
            </div>
          </div>
        </section>
      </form>
      {/* ===== BOTÃO ===== */}
        <button
          type="button"
          className="addproduct-btn"
          onClick={(e) => {
            e.preventDefault();
            Add_product();
          }}
        >
          Adicionar produto
        </button>
    </div>

  )
}

export default AddProduct