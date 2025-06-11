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
    const inOffer = product.inOffer;
    const sizes = product.size
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
                           {product.descriptionProduct}
                        </div>
                        <div className="product-display-right-size">
                            <h1>Selecione o tamanho</h1>
                            <div className="productDisplay-sizes">
                                {sizes.map((size)=>(
                                     <div key={size}>{size}</div> 
                                ))}
                            </div>
                        </div>
                        <button onClick={()=>{addToCart(product._id)}}>Add ao carrinho</button>
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
                            {product.descriptionProduct}
                        </div>
                        <div className="product-display-right-size">
                            <h1>Selecione o tamanho</h1>
                            <div className="productDisplay-sizes">
                                {/* criar um loop que mostra todos os tamanhos */}
                                {sizes.map((size, index)=>(
                                    /* criar um id para cada tamanho e o id que for clicado ele vai aparecer no cart */
                                    <div key={size}>{size}</div> 
                                ))}
                            </div>
                        </div>
                        <button onClick={()=>{addToCart(product._id)}}>Add ao carrinho</button>
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