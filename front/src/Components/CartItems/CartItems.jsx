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
            <p>Total</p>
            <p>Remover</p>
        </div>
        <hr />
        {all_product.map((e) => {
            if (cartItem[e.id] > 0) {
                return (
                    <div key={e.id} className="cart-mobile">
                        <div className="cartItems-format cartItems-format-main">
                            <img src={e.image} className='cartItems-product-icon' alt="" />
                            <p>{e.name}</p>
                            <p>R${e.new_price}</p>
                            <button className='CartItems-quantity'>{cartItem[e.id]}</button>
                            <p>R${e.new_price * cartItem[e.id]}</p>
                            <i className="fa-solid fa-trash" onClick={() => removeFromCart(e.id)}></i>
                        </div>
                        <hr />
                    </div>
                );
            }
            return null;
        })}
        
       <div className="cartItems-down">
            <div className="cartItems-promocode">
                <p>Cupom de Desconto</p>
                <div className="cartItem-promoBox">
                    <input type="text" name="" id="" placeholder='Código de desconto' />
                    <button type="submit">Enviar</button>
                </div>
            </div>
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