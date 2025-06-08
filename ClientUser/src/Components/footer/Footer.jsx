import './Footer.css'
import hat from '../Assets/hat.png'
import { useEffect, useState } from 'react'

const Footer = () => {

    const [year, setYear] = useState("");

   useEffect(()=>{
    const newDate = new Date();
    setYear(newDate.getFullYear());
   },[]);

  return (
    <div className='footer'>
        <div className="footer-logo">
            <img src={hat} alt="" />
            <p>Reverto Brechó</p>
        </div>
        <ul className="footer-links">
            <li>Empresa</li>
            <li>Produtos</li>
            <li>Ofertas</li>
            <li>Sobre Nós</li>
            <li>Contato</li>
        </ul>
        <div className="footer-social-icon">
            <div className="footer-icons-container">
                <i className="fa-brands fa-instagram"></i>
            </div>
            <div className="footer-icons-container">
                <i className="fa-brands fa-pinterest"></i>
            </div>
            <div className="footer-icons-container">
                <i className="fa-brands fa-whatsapp"></i>
            </div>
        </div>
        <div className="footer-copyright">
            <hr />
            <p>Copyright @ {year} - Todos os direitos reservados</p>
        </div>
    </div>
  )
}

export default Footer