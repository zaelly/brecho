import "../AddProduct/AddProduct.css"
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const EditProduct = () => {
  const { offer, allproducts, setThumbnail, setDeleteImg, setGallery, setProductDetails, edit_product, loading, gallery, handleImageGallery, handleChange, thumbnail, handleImageThumbnail, productDetails } = useContext(AdminContext);
  const { productId } = useParams();
  const product = allproducts.find((e) => e._id === productId);

  useEffect(()=>{
    if(product){
      setProductDetails(product);
      if (product.thumbnail) {
        setThumbnail(product.thumbnail); 
      }
      if (product.gallery && product.gallery.length > 0) {
        setGallery(product.gallery);
      }
    }
  }, [product])

  return (
    <div className="container-geral">
          <form className="addproduct-form" encType='multipart/form-data'>
    
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
                  <React.Fragment key={size}>
                    <label className="size-item switch">
                      <input
                        type="checkbox"
                        name={`size${size}`}
                        checked={productDetails.size.includes(size)}
                        onChange={handleChange}
                      />
                      <span className="slider"></span>
                    </label>
                    <span>{size === "Unico" ? "Único" : size}</span>
                  </React.Fragment>
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
                  <label htmlFor="thumbnail">
                    {thumbnail ? (
                      <div className="imageHover thumbnail">
                        <img
                          src={URL.createObjectURL(thumbnail)}
                          alt="Preview"
                          className="addproduct-thumbnail-img"
                        />
                        <i className="fa-solid fa-x" onClick={setDeleteImg(thumbnail)}></i>
                      </div>
                    ) : (
                      <i className="fa-solid fa-cloud-arrow-up cloud-arrow"></i>
                    )}
                  </label>
                  <input
                    type="file"
                    id="thumbnail"
                    name='thumbnail'
                    accept="image/*"
                    hidden
                    onChange={handleImageThumbnail}
                  />
                  <p>Imagem principal</p>
                </div>
                {/* imagens de carrosel */}
                <div className="image-upload">
                  <label htmlFor="gallery">
                    {gallery && (
                      <div className='container-gallery'>
                        <i className="fa-solid fa-cloud-arrow-up cloud-arrow"></i>
                        <div className="gallery">
                          {gallery.map((img, index)=>(
                            <div className="imageHover">
                              <img
                                key={index}
                                src={URL.createObjectURL(img)}
                                alt="Preview"
                                className="addproduct-gallery-img"
                              />
                              <i className="fa-solid fa-x" onClick={setDeleteImg(img)}></i>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </label>
                  <input
                    type="file"
                    id="gallery"
                    name='gallery'
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleImageGallery}
                  />
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
                edit_product(productId);
              }}
            >
              {loading ? "Carregando...": "Editar produto"}
            </button>
        </div>
  )
}

export default EditProduct