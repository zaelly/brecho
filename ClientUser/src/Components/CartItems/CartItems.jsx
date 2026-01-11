import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Checkout from '../checkout/Checkout';

const CartItems = () => {
    const {getTotalCartAmount, all_product, addToCart, cartItem, removeFromCart, profileDetail, fetchProfile} = useContext(ShopContext);
    const [selectedPayment, setSelectedPayment] = useState(null);
    // const [paymentMethod, setPaymentMethod] = useState([])
    const isDisabled = !selectedPayment || getTotalCartAmount <= 0;
    const [checkout, setCheckout] = useState(false);

    console.log(profileDetail)
    const finalizarCompra = () => {
        if(!profileDetail.adress || !profileDetail.cpf || !profileDetail.city){
            toast.warn(`Endereço não encontrado. Adicione um endereço para entrega!`);
            return;
        }
        if(!selectedPayment){
            toast.warn('Nenhuma forma de pagamento selecionada');
            return;
        }else{
            toast.success(`Forma de pagamento selecionada: ${selectedPayment}`);
        }

        // chama a API para finalizar a compra
        setCheckout(true);
    }

    useEffect(()=>{
        fetchProfile()
    }, [])
  return (
    <div className='CartItems'>
        <h1>Carrinho</h1>  
        <div className="cartItems-format-main">
            <p>Produtos</p>
            <p>Título</p>            
            <p>Tamanho</p>            
            <p>Quantidade</p>
            <p>Preço</p>
            <p>Total</p>
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
                                <img src={product.thumbnail} className="cartItems-product-icon" alt={product.name} />
                                <p>{product.name}</p>
                                <p className="CartItems-size">{size}</p>
                                <div className="CartItems-quantity">
                                    <button onClick={() => removeFromCart(itemId, size)}><i className="fa-solid fa-minus"></i></button>
                                    {quantity}
                                    <button onClick={()=> addToCart(itemId, size)}><i className="fa-solid fa-plus"></i></button>
                                </div>
                                <p>R${unitPrice.toFixed(2).replace(".", ",")}</p>
                                <p>R${totalPrice.toFixed(2).replace(".", ",")}</p>
                            </div>
                            <hr />
                        </div>
                    );
                } return null;
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
                                <p><i className="fa-brands fa-pix"></i> Pix</p>
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
                    {/* antes de finalizar verificar se o cliente tem endereço */}
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