import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Checkout from '../checkout/Checkout';

const CartItems = () => {
    const {getTotalCartAmount, all_product, cartItem, removeFromCart} = useContext(ShopContext);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const isDisabled = !selectedPayment || getTotalCartAmount <= 0;
    const [checkout, setCheckout] = useState(false);

    const finalizarCompra = () => {
        if(!selectedPayment){
            toast.warn('Nenhuma forma de pagamento selecionada');
            return;
        }else{
            toast.success(`Forma de pagamento selecionada: ${selectedPayment}`);
        }

        // chama a API para finalizar a compra
        setCheckout(true);
    }
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
        <div className="listcart">
            {Object.entries(cartItem).map(([key, quantity]) => {
                if (quantity > 0) {
                    const [itemId, size] = key.split("_");

                    const product = all_product.find(p => p._id === itemId);

                    if (!product) return null;

                    const unitPrice = product.inOffer ? product.new_price : product.current_price;
                    const totalPrice = unitPrice * quantity;

                    return (
                        <div key={key} className="cart-mobile">
                            <div className="cartItems-format cartItems-format-main">
                                <img src={product.image} className="cartItems-product-icon" alt={product.name} />
                                <p>{product.name}</p>
                                <p>R${unitPrice.toFixed(2).replace(".", ",")}</p>
                                <button className="CartItems-quantity">{quantity}</button>
                                <p className="CartItems-quantity">{size}</p>
                                <p>R${totalPrice.toFixed(2).replace(".", ",")}</p>
                                <i 
                                className="fa-solid fa-trash" 
                                onClick={() => removeFromCart(itemId, size)} 
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
        </div>

        <div className="containerPayment">
            <div className='container-payment-up'>
                <h2>Selecione uma forma de pagamento para finalizar a compra!</h2>
                <hr />
                <div className="group-content">
                    <div className="optionsPayments">
                        <div className="optionPayment">
                            {/* quando selecionado e clicado em gerar ele gera um qrcode */}
                            <h3>Formas de pagamentos:</h3>
                            <div className={`optionCard ${selectedPayment === "pix" ? 'selectedPayment' : ''}`} 
                                onClick={() => setSelectedPayment(selectedPayment === "pix" ? null : "pix")}>
                                <i className="fa-brands fa-pix"></i>
                                <p>Pix</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cartItems-down">
                <div className="cart-items-total">
                    <h1>Resumo</h1>
                    <div>
                        <div className="cartItems-total-item">
                            <p>Subtotal:</p>
                            <p>R${getTotalCartAmount.toFixed(2).replace(".", ",")}</p>
                        </div>
                        <hr />
                        <div className="cartItems-total-item">
                            <p>Frete:</p>
                            <p>Grátis</p>
                        </div>
                        <hr />
                        <div className="cartItems-total-item">
                            <h3>Total:</h3>
                            <h3>R${getTotalCartAmount.toFixed(2).replace(".", ",")}</h3>
                        </div>
                    </div> 
                    <button 
                        onClick={finalizarCompra} 
                        className={`${isDisabled ? 'disabledBtn' : ''}`} 
                        disabled={isDisabled}
                    >
                        FINALIZAR
                    </button>

                    {checkout && <Checkout closeModal={()=>setCheckout(false)}/>}
                </div>
            </div>
        </div>
    </div>
  )
}

export default CartItems