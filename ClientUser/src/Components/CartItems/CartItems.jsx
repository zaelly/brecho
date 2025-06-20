import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import { useContext } from 'react';

const CartItems = () => {
    const {getTotalCartAmount, all_product, cartItem, removeFromCart} = useContext(ShopContext);

  return (
    <div className='CartItems'>
            <h1>Carrinho</h1>   
        <div className="cartItems-format-main">
            <p>Produtos</p>
            <p>Título</p>
            <p>Preço</p>
            <p>Quantidade</p>
            <p>Tamanho</p>
            <p>Total</p>
            <p>Remover</p>
        </div>
        <hr />
        {all_product.map((e) => {
            if (cartItem[e._id] > 0) {
                return (
                    // add o current_price nesta logica ou o preço do qual o produto esta sendo vendido
                    <div key={e._id} className="cart-mobile">
                        <div className="cartItems-format cartItems-format-main">
                            <img src={e.image} className='cartItems-product-icon' alt="" />
                            <p>{e.name}</p>
                            <p>R${e.inOffer ? e.new_price * cartItem[e._id] : e.current_price * cartItem[e._id]}</p>
                            <button className='CartItems-quantity'>{cartItem[e._id]}</button>
                            <button className='CartItems-quantity'>{e.size}</button>
                            <p>R${e.inOffer ? e.new_price * cartItem[e._id] : e.current_price * cartItem[e._id]}</p>
                            <i className="fa-solid fa-trash" onClick={() => removeFromCart(e._id)}></i>
                        </div>
                        <hr />
                    </div>
                );
            }
            return null;
        })}
        
       <div className="cartItems-down">
            {/* <div className="cartItems-promocode">
                <p>Cupom de Desconto</p>
                <div className="cartItem-promoBox">
                    <input type="text" name="" id="" placeholder='Código de desconto' />
                    <button type="submit">Enviar</button>
                </div>
            </div> */}
            <div className="cart-items-total">
                <h1>Total</h1>
                <div>
                    <div className="cartItems-total-item">
                        <p>Subtotal:</p>
                        <p>R${getTotalCartAmount()}</p>
                    </div>
                    <hr />
                    <div className="cartItems-total-item">
                        <p>Frete:</p>
                        <p>Grátis</p>
                    </div>
                    <hr />
                    <div className="cartItems-total-item">
                        <h3>Total:</h3>
                        <h3>R${getTotalCartAmount()}</h3>
                    </div>
                </div>
                <button>FINALIZAR</button>
            </div>
       </div>
    </div>
  )
}

export default CartItems