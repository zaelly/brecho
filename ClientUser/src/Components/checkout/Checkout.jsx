import "./Checkout.css"
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useState } from 'react';

const Checkout = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [pixCode, setPixCode] = useState("00020126580014BR.GOV.BCB.PIX0136+55219999999952040000530398654041.005802BR5925Nome do Recebedor6009Rio de Janeiro61080540900062070503***6304B14F");
    
    const copyCode = (e) => {
        if(!e) return;

        navigator.clipboard.writeText(e)
        .then(() => {
            toast.success("Código copiado para a área de transferência!");
        })
        .catch(() => {toast.error("Falha ao copiar o código!");});
    }
  return (
    <div className='container-checkout'>
        {isOpen &&(
            <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                    <div className="headerModal">
                        <h2>Pagamento via Pix</h2>
                    </div>
                    <div className="copycode">
                        <p>Copie o código!</p>
                        <input type="text" readOnly value={pixCode}/>
                        <button onClick={() => copyCode(pixCode)}>Copiar código</button>
                    </div>
                    <button onClick={() => setIsOpen(!isOpen)}>Fechar</button>
                </div>
            </div>
        )}
    </div>
  )
}

export default Checkout