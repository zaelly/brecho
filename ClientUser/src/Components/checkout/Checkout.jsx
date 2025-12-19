import "./Checkout.css"
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from 'react';

const Checkout = ({closeModal}) => {
    const [loading, setLoading] = useState(true)
    const [pixCode, setPixCode] = useState("");
    const qrcode = ""; // insira a imagem do qrcode aqui
    const copyCode = (e) => {
        if(!e) return;

        navigator.clipboard.writeText(e)
        .then(() => {
            toast.success("Código copiado para a área de transferência!");
        })
        .catch(() => {toast.error("Falha ao copiar o código!");});
    }

    const gerandoQrCode = () =>{
        setTimeout(()=>{
            setPixCode("00020126580014BR.GOV.BCB.PIX0136+55219999999952040000530398654041.005802BR5925Nome do Recebedor6009Rio de Janeiro61080540900062070503***6304B14F")
            setLoading(false)
        }, 1000)
    }

    useEffect(()=>{
        gerandoQrCode
    },[])
    
  return (
    <div>
        {/* modal pix */}
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="headerModal">
                    <h4>Pagamento via Pix</h4>
                    <span onClick={closeModal}><i className="fa-solid fa-xmark"></i></span>
                </div>
                <div className="content">
                    {loading ? (
                        <>
                            <p>Gerando QrCode...</p>
                        </>
                    ) : (
                        <>
                            <div className="qrcode">
                                <img src={qrcode} alt="qrcode" />
                            </div>
                            <div className="copycode">
                                <p>Copie o código!</p>
                                <div className="clipboard">
                                    <input type="text" readOnly value={pixCode}/>
                                    <button onClick={() => copyCode(pixCode)}><i className="fa-solid fa-clipboard"></i></button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Checkout