import "./Checkout.css"
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Checkout = ({closeModal, orderCreated}) => {
    const [loading, setLoading] = useState(true)
    const [pixCode, setPixCode] = useState("");

    const copyCode = (e) => {
        if(!e) return;
        navigator.clipboard.writeText(e)
        .then(() => {
            toast.success("Codigo copiado!");
        })
        .catch(() => {toast.error("Falha ao copiar!");});
    }

    useEffect(()=>{
        setTimeout(()=>{
            setPixCode("00020126580014BR.GOV.BCB.PIX0136+55219999999952040000530398654041.005802BR5925Nome do Recebedor6009Cidade61080540900062070503***6304B14F")
            setLoading(false)
        }, 1000)
    },[])

  return (
    <div>
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="headerModal">
                    <h4>{orderCreated ? "Pedido Confirmado!" : "Pagamento via Pix"}</h4>
                    <span onClick={closeModal}><i className="fa-solid fa-xmark"></i></span>
                </div>
                <div className="content">
                    {orderCreated && (
                        <div style={{textAlign:'center', marginBottom:'15px'}}>
                            <i className="fa-solid fa-circle-check" style={{fontSize:'40px', color:'#4caf50'}}></i>
                            <p style={{color:'#4caf50', fontWeight:'bold', margin:'10px 0'}}>Seu pedido foi criado com sucesso!</p>
                            <Link to="/meuspedidos" style={{color:'#2196f3', textDecoration:'underline'}}>
                                Ver meus pedidos
                            </Link>
                        </div>
                    )}
                    {loading ? (
                        <p>Gerando QrCode...</p>
                    ) : (
                        <div className="copycode">
                            <p>Copie o codigo Pix para pagar:</p>
                            <div className="clipboard">
                                <input type="text" readOnly value={pixCode}/>
                                <button onClick={() => copyCode(pixCode)}><i className="fa-solid fa-clipboard"></i></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Checkout
