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
        {all_product.map((product) => {
            if(cartItem[product._id] > 0){

            const unitPrice = product.inOffer ? product.new_price : product.current_price;
            const totalPrice = unitPrice * cartItem[product._id];

            //se quantidade for = 0 ou < 0 entao nao vai poder finalizar a venda
           
            //se for > 0 e tiver meio de pagamento entao finaliza
            //se quantidade for > 0 e nao tiver meio de pagamento entao nao deixar finalizar

            return (
                <div key={product._id} className="cart-mobile">
                <div className="cartItems-format cartItems-format-main">
                    <img src={product.image} className="cartItems-product-icon" alt={product.name} />
                    <p>{product.name}</p>
                    <p>R${unitPrice.toFixed(2)}</p>
                    <button className="CartItems-quantity">{cartItem[product._id]}</button>
                    <p className="CartItems-quantity">{product.size || 'N/A'}</p>
                    <p>R${totalPrice.toFixed(2)}</p>
                    <i className="fa-solid fa-trash" onClick={() => removeFromCart(product._id)} role="button" tabIndex="0"></i>
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
                        <p>R${getTotalCartAmount().toFixed(2)}</p>
                    </div>
                    <hr />
                    <div className="cartItems-total-item">
                        <p>Frete:</p>
                        <p>Grátis</p>
                    </div>
                    <hr />
                    <div className="cartItems-total-item">
                        <h3>Total:</h3>
                        <h3>R${getTotalCartAmount().toFixed(2)}</h3>
                    </div>
                </div>
                <button>FINALIZAR</button>
            </div>
       </div>
    </div>
  )
}

export default CartItems