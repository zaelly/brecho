import './Sidebar.css'
import {Link} from 'react-router-dom'
// import add_product_icon from '../../assets/Product.Cart.svg'

const Sidebar = () => {
  return (
    <div className='Sidebar'>
        <Link to={'/addproduct'} style={{TextDecoderation: "none"}}>
            <div className="sidebar-item">
                <i className="fa-solid fa-cart-shopping"></i>
                <p>Adicionar produto</p>
            </div>
        </Link>
        <Link to={'/listproduct'} style={{TextDecoderation: "none"}}>
            <div className="sidebar-item">
                <i className="fa-solid fa-rectangle-list"></i>
                <p>Lista de Produtos</p>
            </div>
        </Link>
    </div>
  )
}

export default Sidebar