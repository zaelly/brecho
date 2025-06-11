import './Navbar.css'
import logo from '../Assets/hat.png'
import { useContext, useState, useEffect, useRef  } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Adicionar useNavigate aqui
import { ShopContext } from '../../Context/ShopContext';
import { useLocation } from 'react-router-dom';
import nav_profile from '../Assets/nav_profile.png'

const Navbar = () => {
    const navigate = useNavigate();  // Declare navigate aqui, logo após a importação
    const [menu, setMenu] = useState("home");
    const {getTotalCartItems} =useContext(ShopContext);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const menuRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [all_product, setAll_products] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();
    const [image_profile, setImage_profile] = useState(nav_profile);
    const [isLoading, setIsLoading] = useState(false);
    const [profileFile, setProfileFile] = useState(null);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };

        fetch('http://localhost:4000/api/products/allproducts')
            .then((response) => response.json())
            .then((data) => setAll_products(data));

        window.addEventListener("resize", handleResize);
        document.addEventListener("mousedown", handleClickOutside);

        const handleStoreChange = () =>{
            const updateImage = localStorage.getItem('seller-image');
            if(updateImage) setImage_profile(updateImage);
        }

        window.addEventListener('storage', handleStoreChange);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener('storage', handleStoreChange);
        };
    }, [searchTerm, all_product, navigate, location]);

    const handleFocus = () =>{
        setIsMenuOpen(true);
    };

    const save_profile = async () => {
        setIsLoading(true); // Inicia o carregamento
        let responseData;

        if (image_profile) {
        let formData = new FormData();
        formData.append('profile', profileFile);

        try {
            const response = await fetch('http://localhost:4000/api/users/uploadprofileimage', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
            });

            const data = await response.json();
            responseData = data;

            if (responseData.success) {
            setImage_profile(responseData.image_url);
            localStorage.setItem('user-image', responseData.image_url);
            }
        } catch (error) {
            console.error('Erro ao salvar o perfil:', error);
        }
        }
        setIsLoading(false); // Finaliza o carregamento
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);    
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('auth-token'));

    const searchProducts = (term)=>{
        const search = term.toLowerCase();
        const result = all_product.filter(product =>
            product.name.toLowerCase().includes(search)
        )
        navigate("/search", { state: { result } });
    }
    const goOutSearch = ()=>{
        if(searchTerm.trim() === ""){
            if (location.pathname === "/search") {
                navigate(-1);
            } else {
                navigate("/");
            }
        }else{
            searchProducts(searchTerm)
        }
    }
    const handleBlur = (e) => {
    // Garantir que o onBlur só acontece quando o foco realmente for perdido
        if (!e.currentTarget.contains(document.activeElement)) {
            goOutSearch();
        }
    };

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
                       <input 
                        type="text" 
                        onKeyDown={(e) => {if (e.key === 'Enter') {searchProducts(searchTerm)}}}
                        onBlur={handleBlur}
                        value={searchTerm} 
                        id='searchInput' 
                        className="form-control" 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder='Pesquisar por...' 
                        aria-label="Username" 
                        aria-describedby="basic-addon1" 
                        />

                        <span className="input-group-text" onClick={() => searchProducts(searchTerm)} id="basic-addon1">      
                        <i className="fa-solid fa-magnifying-glass"></i>      
                        </span>
                    </div>
                </div>
            )} 
            {windowWidth >= 800 &&(
             <div className="nav-login-cart">
                <Link to="cart"><i className="fa-solid fa-cart-shopping"></i></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
                {isLoggedIn ? 
                    (
                        <Link to='/profile' className='prof'>
                            <div className="profile">
                                <img src={image_profile} onChange={save_profile}/>
                            </div>
                            <p>Perfil</p>
                        </Link>
                    )
                    : (
                    <button>
                        <Link to="/LoginSignup">
                            <i className="fa-solid fa-circle-user"></i> Entrar
                        </Link>
                    </button>
                    )
                }
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
                        <li onClick={() => setMenu("Unissex")} className={menu === "Unissex" ? "category" : ""}>
                            <Link to="Unissex">Unissex</Link>
                        </li> 
                        <li onClick={() => setMenu("Imperdiveis")} className={menu === "Imperdiveis" ? "category" : ""}>
                            <Link to="Imperdiveis">Imperdíveis</Link>
                        </li>
                    </ul>
                </div>
            ) : (
                <div ref={menuRef} tabIndex={0} className={`mobile-menu ${isMenuOpen ? "active" : ""}`} onFocus={handleFocus}>
                   <div className="nav-search-mobile">
                       <input 
                        type="text" 
                        onKeyDown={(e) => {if (e.key === 'Enter') {searchProducts(searchTerm)}}}
                        value={searchTerm} 
                        onBlur={handleBlur}
                        id='searchInput' 
                        className="form-control" 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder='Pesquisar por...' 
                        aria-label="Username" 
                        aria-describedby="basic-addon1" 
                        />

                        <span className="input-group-text" onClick={() => searchProducts(searchTerm)} id="basic-addon1">      
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
                        <li onClick={() => setMenu("Unissex")} className={menu === "Unissex" ? "category-mobile" : ""}>
                            <Link to="Unissex">Unissex</Link>
                        </li>
                    </ul>
                    <div className="nav-login-cart-mobile">
                        <Link to="cart">
                            <i className="fa-solid cart-mobile-icon fa-cart-shopping"></i>
                            <div className="nav-cart-count-mobile">{getTotalCartItems()}</div>
                        </Link>
                        {isLoggedIn ? 
                            (
                               <Link to='/profile' className='prof'>
                                    <div className="profile">
                                        <img src={image_profile} onChange={save_profile}/>
                                    </div>
                                    <p>Perfil</p>
                                </Link> 
                            )
                            : (
                            <button>
                                <Link to="/LoginSignup">
                                    <i className="fa-solid fa-circle-user"></i> Entrar
                                </Link>
                            </button>
                            )
                        }
                    </div>
                   
                </div>
            )}
    </>
  )
}
export default Navbar