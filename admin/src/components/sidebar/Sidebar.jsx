import { useEffect, useState } from 'react'
import './Sidebar.css'
import {Link} from 'react-router-dom'
// import add_product_icon from '../../assets/Product.Cart.svg'

const Sidebar = () => {
    const [width, setWindowWidth] = useState(window.innerWidth);

    useEffect(()=>{

        const handleSize = () => setWindowWidth(window.innerWidth)
        window.addEventListener('resize', handleSize)

        return ()=> window.removeEventListener('resize', handleSize);
    },[])
  return (
    <>
        {width > 1000 && (
            <div className='Sidebar'>
                <Link to={'/admin/addproduct'} style={{TextDecoderation: "none"}}>
                    <div className="sidebar-item">
                        <i className="fa-solid fa-cart-shopping"></i>
                        <p>Adicionar produto</p>
                    </div>
                </Link>
                <Link to={'/admin/listproduct'} style={{TextDecoderation: "none"}}>
                    <div className="sidebar-item">
                        <i className="fa-solid fa-rectangle-list"></i>
                        <p>Lista de Produtos</p>
                    </div>
                </Link>
                <Link to={'/admin/neworder'} style={{TextDecoderation: "none"}}>
                    <div className="sidebar-item">
                        <i className="fa-solid fa-truck"></i>
                        <p>Pedidos</p>
                    </div>
                </Link>
                <Link to={'/admin/notifications'} style={{TextDecoderation: "none"}}>
                    <div className="sidebar-item">
                        <i className="fa-solid fa-bell"></i>
                        <p>Notificações</p>
                    </div>
                </Link>
                <Link to={'/admin/reviewsproducts'} style={{TextDecoderation: "none"}}>
                    <div className="sidebar-item">
                        <i className="fa-solid fa-star"></i>
                        <p>Reviews</p>
                    </div>
                </Link>
            </div>
        )}
    </>
  )
}

export default Sidebar