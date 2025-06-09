import { useContext, useEffect, useState } from 'react';
import './ProductDisplay.css'
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {

    const[windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(()=>{
        const handleSize = ()=>{
            setWindowWidth(window.innerWidth)
        } 
        window.addEventListener("resize", handleSize);
        return () => window.removeEventListener("resize", handleSize);
    },[])
    const {product} = props;
    const {addToCart} = useContext(ShopContext)
    const currentPrice = product.current_price;
   
  return (
    <>
        {windowWidth <= 1366 ? (
            <>
                <div className="product-display-mobile">
                    <div className="ProductDisplay-left-mobile">
                        <div className="productDisplay-img">
                            <img src={product.image} className='productDisplay-main-img' alt="" />
                        </div>
                        <div className="ProductDisplay-img-list">
                            <img src={product.image} alt="" />
                            <img src={product.image} alt="" />
                            <img src={product.image} alt="" />
                            <img src={product.image} alt="" />
                        </div>     
                    </div>
                    <div className="ProductDisplay-right">
                        <h1>{product.name}</h1>
                        <div className="productDisplay-right-prices">
                            {currentPrice ? (
                                <div className='productDisplay-old-prices'>R${product.current_price}</div>
                            ) : (
                                <>
                                    <div className='productDisplay-old-prices'>R${product.old_price}</div>
                                    <div className='productDisplay-new-prices'>R${product.new_price}</div>
                                </>
                            )}
                           
                        </div>    
                        <div className="description">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
                            Unde ducimus maxime voluptatibus officiis perspiciatis, optio repudiandae, dolor, 
                            cupiditate eveniet nostrum quaerat odit minus est consequatur distinctio molestiae commodi.
                        </div>
                        <div className="product-display-right-size">
                            <h1>Selecione o tamanho</h1>
                            <div className="productDisplay-sizes">
                                <div>PP</div>
                                <div>P</div>
                                <div>M</div>
                                <div>G</div> 
                                <div>GG</div>
                            </div>
                        </div>
                        <button onClick={()=>{addToCart(product._id)}}>Add ao carrinho</button>
                        <p className='productDisplay-category'>
                            <span>Categoria: </span> Mulher, T-Shirt, Crop Top
                        </p>
                        <p className='productDisplay-category'>
                            <span>Tags: </span> Moderno, Mais recente
                        </p>
                    </div>
                </div>
            </>
        ) : ( 
            <>
                <div className="product-display">
                    <div className="ProductDisplay-left">
                        <div className="ProductDisplay-img-list">
                            <img src={product.image} alt="" />
                            <img src={product.image} alt="" />
                            <img src={product.image} alt="" />
                            <img src={product.image} alt="" />
                        </div>
                        <div className="productDisplay-img">
                            <img src={product.image} className='productDisplay-main-img' alt="" />
                        </div>
                    </div>
                    <div className="ProductDisplay-right">
                        <h1>{product.name}</h1>
                        <div className="productDisplay-right-prices">
                            <div className='productDisplay-old-prices'>R${product.old_price}</div>
                            <div className='productDisplay-new-prices'>R${product.new_price}</div>
                        </div>    
                        <div className="description">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
                            Unde ducimus maxime voluptatibus officiis perspiciatis, optio repudiandae, dolor, 
                            cupiditate eveniet nostrum quaerat odit minus est consequatur distinctio molestiae commodi.
                        </div>
                        <div className="product-display-right-size">
                            <h1>Selecione o tamanho</h1>
                            <div className="productDisplay-sizes">
                                <div>PP</div>
                                <div>P</div>
                                <div>M</div>
                                <div>G</div> 
                                <div>GG</div>
                            </div>
                        </div>
                        <button onClick={()=>{addToCart(product._id)}}>Add ao carrinho</button>
                        <p className='productDisplay-category'>
                            <span>Categoria: </span> Mulher, T-Shirt, Crop Top
                        </p>
                        <p className='productDisplay-category'>
                            <span>Tags: </span> Moderno, Mais recente
                        </p>
                    </div>
                </div>
            </>
        )}
    </>
)}

export default ProductDisplay