import './Footer.css'
import hat from '../Assets/hat.png'
import {Link} from 'react-router-dom'
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
            <li>
                <Link to={'/allProducts'}>Produtos</Link>
            </li>
            <li>
                <Link to={'/Imperdiveis'}>Ofertas</Link>
            </li>
            <li>Contato</li>
        </ul>
        <div className="footer-social-icon">
             <a href="http://">
                <div className="footer-icons-container">
                    <i className="fa-brands fa-instagram"></i>
                </div>
            </a>
            <a href="http://">
                <div className="footer-icons-container">
                    <i className="fa-brands fa-whatsapp"></i>
                </div>
            </a>
        </div>
        <div className="footer-copyright">
            <hr />
            <p>Copyright @ {year} - Todos os direitos reservados</p>
        </div>
    </div>
  )
}

export default Footer