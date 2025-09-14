import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import { useContext, useState } from 'react';

const CartItems = () => {
    const {getTotalCartAmount, all_product, cartItem, removeFromCart} = useContext(ShopContext);
    const [finalizarCompra, setFinalizarCompra] = useState(false);

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
        {Object.entries(cartItem).map(([key, quantity]) => {
            if (quantity > 0) {
                const [itemId, size] = key.split("_");
                if(size.length > 1){
                    size.split(", ");
                }
                const product = all_product.find(p => p._id === itemId);

                if (!product) return null;

                const unitPrice = product.inOffer ? product.new_price : product.current_price;
                const totalPrice = unitPrice * quantity;

                return (
                    <div key={key} className="cart-mobile">
                        <div className="cartItems-format cartItems-format-main">
                            <img src={product.image} className="cartItems-product-icon" alt={product.name} />
                            <p>{product.name}</p>
                            <p>R${unitPrice}</p>
                            <button className="CartItems-quantity">{quantity}</button>
                            <p className="CartItems-quantity">{size}</p>
                            <p>R${totalPrice.toFixed(2)}</p>
                            <i 
                            className="fa-solid fa-trash" 
                            onClick={() => removeFromCart(key)} 
                            role="button" 
                            tabIndex="0"
                            ></i>
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
                        <p>R${getTotalCartAmount.toFixed(2)}</p>
                    </div>
                    <hr />
                    <div className="cartItems-total-item">
                        <p>Frete:</p>
                        <p>Grátis</p>
                    </div>
                    <hr />
                    <div className="cartItems-total-item">
                        <h3>Total:</h3>
                        <h3>R${getTotalCartAmount.toFixed(2)}</h3>
                    </div>
                </div>
                <button>FINALIZAR</button>
            </div>
       </div>
    </div>
  )
}

export default CartItems