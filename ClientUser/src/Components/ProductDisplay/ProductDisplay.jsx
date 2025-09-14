import { useContext, useEffect, useState } from 'react';
import './ProductDisplay.css'
import { ShopContext } from '../../Context/ShopContext';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const ProductDisplay = (props) => {

    const[windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(()=>{
        const handleSize = ()=>{
            setWindowWidth(window.innerWidth)
        } 
        window.addEventListener("resize", handleSize);
        return () => window.removeEventListener("resize", handleSize);
    },[])
    const {product} = props;

    console.log(product.size)

    const {addToCart} = useContext(ShopContext)
    const inOffer = product.inOffer;
    const sizes = product.size
    const marca = product.marca
    const conditions = product.conditions
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
                        <div className="product-display-right-size">
                            <h1>Tamanhos disponíveis</h1>
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
                        <button onClick={()=>{
                            if(!selectedSize){
                                toast.warn("Selecione um tamanho!")
                                return;
                            }
                            addToCart(product._id, selectedSize)
                        }}>Add ao carrinho</button>
                        <p className='productDisplay-category'>
                            <span>Categoria: </span> {product.category}
                        </p>
                    </div>
                </div>
            </>
        ) : ( 
            <>
                <div className="product-display">
                    <div className="ProductDisplay-left">
                        <div className="ProductDisplay-img-list">
                           {product.images?.map((img, index) => (
                                <img key={index} src={img} />
                            ))}
                        </div>
                        <div className="productDisplay-img">
                            <img src={product.image} className='productDisplay-main-img' />
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
                        <button onClick={()=>{
                            if(!selectedSize){
                                toast.warn("Selecione um tamanho!")
                                return;
                            }
                            addToCart(product._id, selectedSize)
                        }}>
                            Add ao carrinho
                        </button>
                        <p className='productDisplay-category'>
                            <span>Categoria: </span> {product.category}
                        </p>
                    </div>
                </div>
            </>
        )}
    </>
)}

export default ProductDisplay