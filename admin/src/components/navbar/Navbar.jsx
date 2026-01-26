import './Navbar.css'
import logo from '../../assets/hat.png'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import nav_profile from '../../assets/nav_profile.png'

const Navbar = () => {
  const [image_profile, setImage_profile] = useState(nav_profile);
  const [width, setWindowWidth] = useState(window.innerWidth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen); 
  const [isHoverGoOut, setHoverGoOut] = useState(false);

  const goOut = () => {
    localStorage.removeItem('auth-token-seller');
    localStorage.removeItem('seller-image');
    window.location.replace('/');
  };

  useEffect(() => {
    const handleSize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleSize)

    const handleStoreChange = () =>{
      const updateImage = localStorage.getItem('seller-image');
      if(updateImage) setImage_profile(updateImage);
    }
    window.addEventListener('storage', handleStoreChange);

    return ()=>{
      window.removeEventListener('resize', handleSize);
      window.removeEventListener('storage', handleStoreChange);
    };
  }, []);

  return (
    <div className='Navbar'>
      {/* verificar pq nao ta pegando a imagem q add no navbar */}
        <div className="nav-logo">
            <img src={logo} alt="" />
            <Link to="/admin/">
              <p>Reverto <span>Painel Admin</span></p>
            </Link>
        </div>
        {width <= 1000 ? (
            <i
              className={`fa-solid ${isMenuOpen ? "fa-xmark btn-close-menu" : "fa-bars btn-hamburger"}`}
              onClick={toggleMenu}
            ></i>
        ):(
          <div className='container-nav-box'>
            <Link to={'/admin/notifications'} style={{TextDecoderation: "none"}}>
              <div className="">
                  <i className="fa-solid fa-bell"></i>
              </div>
            </Link>
            <div
              className="profile-wrapper"
              onMouseEnter={() => setHoverGoOut(true)}
              onMouseLeave={() => setHoverGoOut(false)}
            >
              <div className="profile">
                <Link to="/admin/profile">
                  <img src={image_profile} alt="" />
                  <p>Seu Perfil</p>
                </Link>
              </div>

              <div className={`btnGoOut ${isHoverGoOut ? "active" : ""}`}>
                <div className="logout" onClick={goOut}>
                  Logout
                </div>
              </div>
            </div>
          </div>
        )}
          {/* menu mobile */}
          {width <= 1000 && isMenuOpen ? (
            <div className='SidebarMobile'>
              <div className="menu-logo">
                <Link to="/admin/">
                  <p>Reverto <span>Painel Admin</span></p>
                </Link>
              </div>
              <div className="itens">
                <Link to={'/admin/addproduct'} style={{TextDecoderation: "none"}}>
                  <div className="sidebar-item-mobile">
                      <i className="fa-solid fa-cart-shopping"></i>
                      <p>Adicionar produto</p>
                  </div>
                </Link>
                <Link to={'/admin/listproduct'} style={{TextDecoderation: "none"}}>
                  <div className="sidebar-item-mobile">
                      <i className="fa-solid fa-rectangle-list"></i>
                      <p>Lista de Produtos</p>
                  </div>
                </Link>
                <Link to={'/admin/neworder'} style={{TextDecoderation: "none"}}>
                  <div className="sidebar-item-mobile">
                      <i className="fa-solid fa-truck"></i>
                      <p>Pedidos</p>
                  </div>
                </Link>
                <Link to={'/admin/notifications'} style={{TextDecoderation: "none"}}>
                  <div className="sidebar-item-mobile">
                      <i className="fa-solid fa-bell"></i>
                      <p>Notificações</p>
                  </div>
                </Link>
                <Link to={'/admin/reviewsproducts'} style={{TextDecoderation: "none"}}>
                  <div className="sidebar-item-mobile">
                      <i className="fa-solid fa-star"></i>
                      <p>Reviews</p>
                  </div>
                </Link>
                <div className="profile">
                  <Link to='/admin/profile'>
                    <img src={image_profile} alt=""/>
                    <p>Seu Perfil</p>
                  </Link>
                </div>
              </div>
            </div>
          ):(
            null
          )}
    </div>
  )
}

export default Navbar