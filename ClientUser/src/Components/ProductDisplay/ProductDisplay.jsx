import { useContext, useEffect, useState } from 'react';
import './ProductDisplay.css'
import { ShopContext } from '../../Context/ShopContext';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const ProductDisplay = ({product, openChat}) => {
    if (!product) {
        return <div>Carregando produto...</div>;
    }

    const[windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [selectedSize, setSelectedSize] = useState(null);
    const [reviews, setReviews] = useState(product?.reviews || []);
    const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const {addToCart} = useContext(ShopContext)
    const inOffer = product?.inOffer;
    const sizes = product?.size
    const marca = product?.marca
    const conditions = product?.conditions
    const [enterprise, setEnterprise] = useState({
        name: "",
    });

    const fetchProfile = async () => {
        const res = await fetch(`${url}/api/sellers/getsellerprofile`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
        });
        const data = await res.json();
        if (data.success) {
        const sellerId = data.data._id;
        setEnterprise(prev => ({
            ...prev,
            name: data.data.name
        }));
        localStorage.setItem("seller-id", sellerId);
        // imagem de cada vendedor setada
        localStorage.setItem(`seller-image-${sellerId}`, data.data.image);
        } else {
        toast.error(data.errors || "Erro ao buscar perfil");
        }
    };

    console.log(enterprise, "nome")

    useEffect(()=>{
        const handleSize = ()=>{
            setWindowWidth(window.innerWidth)
        } 
        fetchProfile();
        window.addEventListener("resize", handleSize);
        return () => window.removeEventListener("resize", handleSize);
    },[])
    
    const sendMessage = () => {
        // Lógica para abrir o chat ou enviar uma mensagem
        openChat && openChat();
    }

    return (
    <>
        {windowWidth <= 1366 ? (
            <>
                <div className="product-display-mobile">
                    <div className="ProductDisplay-left-mobile">
                        <div className="productDisplay-img">
                            <img src={product.image} className='productDisplay-main-img' />
                        </div>
                        <div className="ProductDisplay-img-list">
                            <img src={product.image} />
                            <img src={product.image} />
                            <img src={product.image} />
                            <img src={product.image} />
                        </div>     
                    </div>
                    <div className="ProductDisplay-right">
                        <h1>{product.name}</h1>
                        <div className="productDisplay-right-prices">
                            {inOffer ? (
                                <> 
                                    <div className='productDisplay-old-prices'>R${product.old_price}</div>
                                    <div className='productDisplay-new-prices'>R${product.new_price}</div>
                                </>
                            ) : (
                                <div className='productDisplay-new-prices'>R${product.current_price}</div> 
                            )}
                        </div> 
                        <div className="description">
                            <span>Descrição:</span>
                            <p>{product.descriptionProduct}</p>
                        </div>   
                        <div className="info-produtos">
                            
                            <div className="marca">
                                <span>Marca:</span>
                                {!marca ? (
                                    <div>N/A</div>
                                ) :(
                                    <p>{product.marca}</p>
                                )}
                            </div>
                            <div className="conditions">
                                <span>Condições do produto:</span>
                                {!conditions ?(
                                    <p>
                                        -
                                    </p>
                                ) : (
                                     <p>{product.conditions}</p>
                                )}
                            </div>
                        </div>
                        <p className='productDisplay-category'>
                            <span>Categoria: </span> {product.category}
                        </p>
                        <p className='productDisplay-category'>
                            <span>Vendido por: </span> {enterprise.name}
                        </p>
                        <div className="product-display-right-size">
                            <h1>Tamanhos disponíveis</h1>
                            <p>Adicione um por vez</p>
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
                        <div className="buttons">
                            <button onClick={sendMessage}>
                                <i className="fa-solid fa-comment"></i>
                                Conversar agora
                            </button>
                            <button onClick={()=>{
                                if(!selectedSize){
                                    toast.warn("Selecione um tamanho!")
                                    return;
                                }
                                addToCart(product._id, selectedSize)
                            }}>
                                <i className="fa-solid fa-cart-plus"></i>
                                Add ao carrinho
                            </button>
                        </div>
                    </div>
                </div>
            </>
        ) : ( 
            <>
                <div className="product-display">
                    <div className="ProductDisplay-left">
                        <div className="ProductDisplay-img-list">
                            <img src={product.image} />
                            <img src={product.image} />
                            <img src={product.image} />
                            <img src={product.image} />
                        </div>
                        <div className="productDisplay-img">
                            <img src={product.image} className='productDisplay-main-img' />
                        </div>
                    </div>
                    <div className="ProductDisplay-right">
                        <h1>{product.name}</h1>
                        <small>
                            {reviews && reviews.length > 0
                            ? `${reviews.length} ${reviews.length === 1 ? 'Avaliação' : 'Avaliações'}`
                            : "Sem avaliações"}
                        </small>
                        <div className="productDisplay-right-prices">
                            {inOffer ? (
                                <> 
                                    <div className='productDisplay-old-prices'>R${product.old_price}</div>
                                    <div className='productDisplay-new-prices'>R${product.new_price}</div>
                                </>
                            ) : (
                                <div className='productDisplay-new-prices'>R${product.current_price}</div> 
                            )}
                        </div>  
                        <div className="description">
                            <span>Descrição:</span>
                            {product.descriptionProduct}
                        </div>   
                        <div className="info-produtos">
                            <div className="marca">
                                <span>Marca:</span>
                                {!marca ? (
                                    <p>N/A</p>
                                ) :(
                                    <p>{product.marca}</p>
                                )}
                            </div>
                            <div className="conditions">
                                <span>Condições do produto:</span>
                                {!conditions ?(
                                    <p>
                                        -
                                    </p>
                                ) : (
                                     <p>{product.conditions}</p>
                                )}
                            </div>
                        </div>
                        <p className='productDisplay-category'>
                            <span>Categoria: </span> {product.category}
                        </p>
                        <p className='productDisplay-category'>
                            <span>Vendido por: </span> {enterprise.name}
                        </p>
                        <div className="product-display-right-size">
                            <h1>Selecione o tamanho</h1>
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
                        <div className="buttons">
                            <button onClick={()=>{
                                if(!selectedSize){
                                    toast.warn("Selecione um tamanho!")
                                    return;
                                }
                                addToCart(product._id, selectedSize)
                            }}>
                                <i className="fa-solid fa-cart-plus"></i>
                                Add ao carrinho
                            </button>
                            <button onClick={sendMessage}>
                                <i className="fa-solid fa-comment"></i>
                                Conversar agora
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )}
    </>
)}

export default ProductDisplay