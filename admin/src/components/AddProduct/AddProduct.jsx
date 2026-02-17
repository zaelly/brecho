import React from 'react';
import './AddProduct.css'
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import SimpleCloudinaryUpload from '../SimpleCloudinaryUpload/SimpleCloudinaryUpload';

const AddProduct = () => {

  const { offer, Add_product, Save_edit_product, cancelEdit, editingProductId, loading, handleChange, productDetails } = useContext(AdminContext);

  return (
    <div className="container-geral">
      <form className="addproduct-form" encType='multipart/form-data'>

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

        <section className="form-section">
          <h3 className="section-title">Imagens do Produto</h3>

          <div className="images-group">
            <div className="image-upload-section">
              <label className="image-label">Imagem Principal (Thumbnail)</label>
              <SimpleCloudinaryUpload
                onImageUpload={(imageUrl) => {
                  const event = {
                    target: { name: 'thumbnail', value: imageUrl }
                  };
                  handleChange(event);
                }}
                currentImage={productDetails.thumbnail}
                label="Selecionar Thumbnail"
                multiple={false}
              />
              {/* adicionar um btn de remover a imagem */}
            </div>

            <div className="image-upload-section">
              <label className="image-label">Galeria de Imagens</label>
              <SimpleCloudinaryUpload
                onImageUpload={(imageUrls) => {
                  const currentGallery = Array.isArray(productDetails.gallery) ? productDetails.gallery : [];
                  const newUrls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
                  const newGallery = [...currentGallery, ...newUrls];
                  const event = {
                    target: { name: 'gallery', value: newGallery }
                  };
                  handleChange(event);
                }}
                currentImage={productDetails.gallery || []}
                label="Adicionar à Galeria"
                multiple={true}
              />
            </div>

            {productDetails.gallery && productDetails.gallery.length > 0 && (
              <div className="gallery-preview">
                <label className="image-label">
                  Galeria ({productDetails.gallery.length} imagens)
                </label>
                <div className="gallery-grid">
                  {productDetails.gallery.map((img, index) => (
                    <div key={index} className="gallery-item">
                      <img
                        src={img}
                        alt={`Gallery ${index}`}
                        className="gallery-preview-img"
                      />
                      <button
                        type="button"
                        className="remove-gallery-btn"
                        onClick={() => {
                          const newGallery = productDetails.gallery.filter((_, i) => i !== index);
                          const event = {
                            target: { name: 'gallery', value: newGallery }
                          };
                          handleChange(event);
                        }}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </form>
        {editingProductId && (
          <p style={{color:'#ff9800', fontWeight:'bold', marginBottom:'10px'}}>
            <i className="fa-solid fa-pen-to-square"></i> Editando produto...
          </p>
        )}
        <div style={{display:'flex', gap:'10px'}}>
          <button
            type="button"
            className="addproduct-btn"
            onClick={(e) => {
              e.preventDefault();
              if(editingProductId){
                Save_edit_product();
              } else {
                Add_product();
              }
            }}
          >
            {loading ? "Carregando..." : editingProductId ? "Salvar alteracoes" : "Adicionar produto"}
          </button>
          {editingProductId && (
            <button
              type="button"
              className="addproduct-btn"
              style={{backgroundColor:'#999'}}
              onClick={cancelEdit}
            >
              Cancelar
            </button>
          )}
        </div>
    </div>


  )
}

export default AddProduct