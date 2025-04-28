import './Navbar.css'
import logo from '../Assets/hat.png'
import { useContext, useState, useEffect, useRef  } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {

    const [menu, setMenu] = useState("home");
    const {getTotalCartItems} =useContext(ShopContext);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const menuRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
              setIsMenuOpen(false);
            }
        }
        
        window.addEventListener("resize", handleResize);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
          window.removeEventListener("resize", handleResize);
        };
    }, []);


    const handleFocus = () =>{
        setIsMenuOpen(true);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);    

  return (
    <> 
        <div className="navbar">
            <div className="nav-logo">
                <img src={logo} alt="" />
                <Link to="/"> 
                    <p>Reverto Brechó</p>
                </Link>
            </div>
            {windowWidth < 800 ? (
                <i
                    className={`fa-solid ${isMenuOpen ? "fa-xmark btn-close-menu" : "fa-bars btn-hamburger"}`}
                    onClick={toggleMenu}
                ></i>
            ) : (
                <div className="nav-search">
                    <div className="input-group">
                        <input type="text" id='searchInput' className="form-control" 
                        placeholder='Pesquisar por...' aria-label="Username" aria-describedby="basic-addon1" />
                        <span className="input-group-text" id="basic-addon1">      
                            <i className="fa-solid fa-magnifying-glass"></i>      
                        </span>
                    </div>
                </div>
            )} 
            {windowWidth >= 800 &&(
             <div className="nav-login-cart">
                <Link to="cart"><i className="fa-solid fa-cart-shopping"></i></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
                <button>
                    <Link to="LoginSignup">
                        <i className="fa-solid fa-circle-user"></i> Login
                    </Link>
                </button>
            </div>
            )}
        </div>
        {windowWidth >= 800 ? (
                <div className="nav-categorys">
                    <ul className="menu-categorys">
                        <li onClick={() => setMenu("home")} className={menu === "home" ? "category" : ""}>
                            <Link to="/">Home</Link>
                        </li>
                        <li onClick={() => setMenu("men")} className={menu === "men" ? "category" : ""}>
                            <Link to="men">Homens</Link>
                        </li>
                        <li onClick={() => setMenu("women")} className={menu === "women" ? "category" : ""}>
                            <Link to="women">Mulheres</Link>
                        </li>
                        <li onClick={() => setMenu("kid")} className={menu === "kid" ? "category" : ""}>
                            <Link to="kid">Crianças</Link>
                        </li>
                    </ul>
                </div>
            ) : (
                <div ref={menuRef} tabIndex={0} className={`mobile-menu ${isMenuOpen ? "active" : ""}`} onFocus={handleFocus}>
                    <div className="nav-search-mobile">
                        <input type="text" id='searchInput' className="form-control-mobile" 
                        placeholder='Pesquisar por...' aria-label="Username" 
                        aria-describedby="basic-addon1" />
                        <span className="input-group-text" id="basic-addon1">      
                            <i className="fa-solid fa-magnifying-glass"></i>      
                        </span>
                    </div>
                     <ul className="menu-categorys-mobile">
                        <li onClick={() => setMenu("home")} className={menu === "home" ? "category-mobile" : ""}>
                            <Link to="/">Home</Link>
                        </li>
                        <li onClick={() => setMenu("men")} className={menu === "men" ? "category-mobile" : ""}>
                            <Link to="men">Homens</Link>
                        </li>
                        <li onClick={() => setMenu("women")} className={menu === "women" ? "category-mobile" : ""}>
                            <Link to="women">Mulheres</Link>
                        </li>
                        <li onClick={() => setMenu("kid")} className={menu === "kid" ? "category-mobile" : ""}>
                            <Link to="kid">Crianças</Link>
                        </li>
                    </ul>
                    <div className="nav-login-cart-mobile">
                        <Link to="cart">
                            <i className="fa-solid cart-mobile-icon fa-cart-shopping"></i>
                            <div className="nav-cart-count-mobile">{getTotalCartItems()}</div>
                        </Link>
                        <button>
                            <Link to="LoginSignup">
                                <i className="fa-solid fa-circle-user"></i> Login
                            </Link>
                        </button>
                    </div>
                   
                </div>
            )}
    </>
  )
}
export default Navbar