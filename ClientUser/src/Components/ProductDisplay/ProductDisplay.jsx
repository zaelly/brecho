import { useContext, useEffect, useState } from 'react';
import './ProductDisplay.css'
import { ShopContext } from '../../Context/ShopContext';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const ProductDisplay = ({product, openChat}) => {
    if (!product) {
        return <div>Carregando produto...</div>;
    }

    const [selectedSize, setSelectedSize] = useState(null);
    const [reviews, setReviews] = useState(product?.reviews || []);
    const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const inOffer = product?.inOffer;
    const sizes = product?.size
    const marca = product?.marca
    const sellerId = product.sellerId;
    const conditions = product?.conditions
    const [enterprise, setEnterprise] = useState({name: ""});
    const {addToCart} = useContext(ShopContext);
    
    const itemId = "";
    const size = "";

    const fetchSeller = async () => {
        if (!sellerId) return;
        try {
        const res = await fetch(`${url}/api/sellers/getseller/${sellerId}`);
        const data = await res.json();
        if (data.success) setEnterprise({ name: data.data.name });
        } catch (err) {
        console.error("Erro ao buscar seller no chat:", err);
        }
    };

    const removeQuantity = (itemId, size)=>{
        console.log(itemId, size);
    }

    const addQuantity = (itemId, size)=>{
        console.log(itemId, size); 
    }

    useEffect(()=>{
        if(!sellerId) return;
        fetchSeller();
    },[sellerId, url]);
    
    const sendMessage = () => {
        openChat && openChat(sellerId);
    }

    return (
    <>
        <div className="product-display">
            <div className="ProductDisplay-left">
                <div className="ProductDisplay-img-list">
                    <div className="itens-list">
                        <img src={product.image} />
                        <img src={product.image} />
                        <img src={product.image} />
                        <img src={product.image} />
                    </div>
                </div>
                <div className="productDisplay-img">
                    <img src={product.image} className='productDisplay-main-img' />
                </div>
            </div>
            <div className="ProductDisplay-right">
                <h1>{product.name}</h1>
                <label>
                    {reviews && reviews.length > 0
                    ? `${reviews.length} ${reviews.length === 1 ? 'Avaliação' : 'Avaliações'}`
                    : "Sem avaliações"}
                </label>
                <div className="productDisplay-right-prices">
                    {inOffer ? (
                        <> 
                            <div className='productDisplay-old-prices'>R${product.old_price.toFixed(2).replace(".",",")}</div>
                            <div className='productDisplay-new-prices'>R${product.new_price.toFixed(2).replace(".",",")}</div>
                        </>
                    ) : (
                        <div className='productDisplay-new-prices'>R${product.current_price.toFixed(2).replace(".",",")}</div> 
                    )}
                </div>  
                <div className="description">
                    <span>Descrição:</span>
                    <span className='span-infos'>{product.descriptionProduct}</span>
                </div>   
                <div className="info-produtos">
                    <div className="marca">
                        <span>Marca: {" "}
                            <span className='span-infos'>{!marca ? (
                                <p>N/A</p>
                            ) :(
                                <p>{product.marca}</p>
                            )}</span>
                        </span>
                    </div>
                    <div className="conditions">
                        <span>Condições do produto: {" "}
                            <span className='span-infos'>{!conditions ?(
                                <p>
                                    -
                                </p>
                            ) : (
                                <p>{product.conditions}</p>
                            )}</span>
                        </span>
                    </div>
                    <div>
                        <p className='productDisplay-category'>
                            <span>Categoria: <span className='span-infos'>{product.category}</span></span>
                        </p>
                    </div>
                    <div>
                        <p className='productDisplay-category'>
                            <span>Vendido por: <span className='span-infos'>{enterprise.name}</span></span>
                        </p>
                    </div>
                </div>
                
                
                <div className="product-display-right-size">
                    <h2 className='tamanhos-h2'>Selecione o tamanho</h2>
                    <div className="productDisplay-sizes">
                        {sizes.map(size => (
                            <div 
                                key={size} 
                                className={selectedSize === size ? "selected" : ""} 
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="product-display-right-size">
                    <h2 className='tamanhos-h2'>Quantidade</h2>
                        <div className="QuantityItens">
                            <button onClick={() => removeQuantity(itemId, size)}><i className="fa-solid fa-minus"></i></button>
                                <input type="number" name="" id="" value="0" />
                            <button onClick={()=> addQuantity(itemId, size)}><i className="fa-solid fa-plus"></i></button>
                        </div>
                </div>
                <div className="buttons">
                    <button className='btn-cart' onClick={()=>{
                        if(!selectedSize){
                            toast.warn("Selecione um tamanho!")
                            return;
                        }
                        addToCart(product._id, selectedSize)
                    }}>
                        <i className="fa-solid fa-cart-shopping"></i>
                        Add ao carrinho
                    </button>
                    <button className='btn-comment' onClick={sendMessage}>
                        <i className="fa-solid fa-comment"></i>
                        Conversar agora
                    </button>
                </div>
            </div>
        </div>
    </>
)}

export default ProductDisplay