import { useContext, useEffect, useState } from 'react';
import './ProductDisplay.css'
import { ShopContext } from '../../Context/ShopContext';
import { getThumbnailUrl, getGalleryUrls } from '../../utils/cloudinary';
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
    const [sellerRating, setSellerRating] = useState({ average: 0, total: 0 });
    const [myRating, setMyRating] = useState(0);
    const [myComment, setMyComment] = useState('');
    const [showRating, setShowRating] = useState(false);
    
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

    const fetchSellerRating = async () => {
        if (!sellerId) return;
        try {
            const res = await fetch(`${url}/api/sellers/getratings/${sellerId}`);
            const data = await res.json();
            if (data.success) {
                setSellerRating({ average: data.average, total: data.total });
            }
        } catch (err) {
            console.error("Erro ao buscar avaliacao do vendedor:", err);
        }
    };

    const submitSellerRating = async () => {
        if (!localStorage.getItem('auth-token')) {
            toast.warn("Faca login para avaliar!");
            return;
        }
        if (myRating === 0) {
            toast.warn("Selecione uma nota!");
            return;
        }
        try {
            const res = await fetch(`${url}/api/sellers/rateseller`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                },
                body: JSON.stringify({
                    sellerId: sellerId,
                    rating: myRating,
                    comment: myComment,
                    userName: localStorage.getItem('users-name') || 'Usuario',
                }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Avaliacao enviada!");
                setShowRating(false);
                setMyRating(0);
                setMyComment('');
                fetchSellerRating();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Erro ao enviar avaliacao");
        }
    };

    useEffect(()=>{
        if(!sellerId) return;
        fetchSeller();
        fetchSellerRating();
    },[sellerId, url]);
    
    const sendMessage = () => {
        openChat && openChat(sellerId);
    }

    // Gerar URLs otimizadas
    const optimizedGallery = product.gallery ? getGalleryUrls(product.gallery, {
        width: 80,
        height: 80,
        quality: 'auto'
    }) : [];
    
    const optimizedThumbnail = getThumbnailUrl(product.thumbnail, 500);

    return (
    <>
        <div className="product-display">
            <div className="ProductDisplay-left">
                <div className="ProductDisplay-img-list">
                    <div className="itens-list">
                        {optimizedGallery.map((imgUrl, index) => (
                            <img 
                                key={index} 
                                src={imgUrl}
                                alt={`Gallery ${index}`}
                                onClick={() => {
                                    // Mudar imagem principal quando clicar
                                    const mainImg = document.querySelector('.productDisplay-main-img');
                                    if (mainImg) {
                                        mainImg.src = product.gallery[index];
                                    }
                                }}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                    </div>
                </div>
                <div className="productDisplay-img">
                    <img 
                        src={optimizedThumbnail} 
                        className='productDisplay-main-img' 
                        alt={product.name}
                    />
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
                            {sellerRating.total > 0 && (
                                <span style={{marginLeft:'10px', color:'#ff9800'}}>
                                    <i className="fa-solid fa-star"></i> {sellerRating.average} ({sellerRating.total} {sellerRating.total === 1 ? 'avaliacao' : 'avaliacoes'})
                                </span>
                            )}
                        </p>
                        <span
                            style={{color:'#2196f3', cursor:'pointer', fontSize:'13px', textDecoration:'underline'}}
                            onClick={() => setShowRating(!showRating)}
                        >
                            {showRating ? 'Fechar' : 'Avaliar vendedor'}
                        </span>
                        {showRating && (
                            <div style={{marginTop:'10px', padding:'10px', border:'1px solid #e0e0e0', borderRadius:'8px'}}>
                                <p style={{fontSize:'13px', marginBottom:'5px'}}>Sua nota:</p>
                                <div style={{display:'flex', gap:'5px', marginBottom:'8px'}}>
                                    {[1,2,3,4,5].map(star => (
                                        <i
                                            key={star}
                                            className={`fa-${myRating >= star ? 'solid' : 'regular'} fa-star`}
                                            style={{cursor:'pointer', color:'#ff9800', fontSize:'20px'}}
                                            onClick={() => setMyRating(star)}
                                        ></i>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Comentario (opcional)"
                                    value={myComment}
                                    onChange={(e) => setMyComment(e.target.value)}
                                    style={{width:'100%', padding:'5px', border:'1px solid #ccc', borderRadius:'4px', marginBottom:'8px'}}
                                />
                                <button
                                    onClick={submitSellerRating}
                                    style={{backgroundColor:'#4caf50', color:'white', border:'none', padding:'5px 15px', borderRadius:'4px', cursor:'pointer', fontSize:'13px'}}
                                >
                                    Enviar avaliacao
                                </button>
                            </div>
                        )}
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