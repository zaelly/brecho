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
    const {totalCartItems} = useContext(ShopContext);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const menuRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [all_product, setAll_products] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();
    const [image_profile, setImage_profile] = useState(nav_profile);
    const [isLoading, setIsLoading] = useState(false);
    const [profileFile, setProfileFile] = useState(null);
    const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };

        fetch(`${url}/api/products/allproducts`)
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
    }, [searchTerm, location]);

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
            const response = await fetch(`${url}/api/users/uploadprofileimage`, {
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
            {windowWidth < 900 ? (
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
            {windowWidth >= 900 &&(
             <div className="nav-login-cart">
                <Link to="favoritos"><i className="fa-regular fa-heart"></i></Link>
                <Link to="cart"><i className="fa-solid fa-cart-shopping"></i></Link>
                <div className="nav-cart-count">{totalCartItems}</div>
                {isLoggedIn ? 
                    (
                        <Link to='/profile' className='prof'>
                            <div className="profile">
                                <img src={image_profile} onChange={save_profile}/>
                            </div>
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
                        <li onClick={() => setMenu("masculina")} className={menu === "masculina" ? "category" : ""}>
                            <Link to="masculina">Homens</Link>
                        </li>
                        <li onClick={() => setMenu("feminina")} className={menu === "feminina" ? "category" : ""}>
                            <Link to="feminina">Mulheres</Link>
                        </li>
                        <li onClick={() => setMenu("kid")} className={menu === "kid" ? "category" : ""}>
                            <Link to="kid">Crianças</Link>
                        </li>
                        <li onClick={() => setMenu("Unissex")} className={menu === "Unissex" ? "category" : ""}>
                            <Link to="Unissex">Unissex</Link>
                        </li> 
                        <li onClick={() => setMenu("Imperdiveis")} className={menu === "Imperdiveis" ? "category" : ""}>
                            <Link to="Imperdiveis">Imperdíveis</Link>
                        </li> <li onClick={() => setMenu("Eletronicos")} className={menu === "Eletronicos" ? "category" : ""}>
                            <Link to="Eletronicos">Eletronicos</Link>
                        </li>
                    </ul>
                </div>
            ) : (
                <>
                <div className={`mobile-overlay ${isMenuOpen ? "active" : ""}`} onClick={() => setIsMenuOpen(false)}></div>
                <div ref={menuRef} tabIndex={0} className={`mobile-menu ${isMenuOpen ? "active" : ""}`} onFocus={handleFocus}>

                    {/* Header com perfil */}
                    <div className="mobile-menu-header">
                        {isLoggedIn ? (
                            <Link to='/profile' className='prof' onClick={() => setIsMenuOpen(false)}>
                                <div className="profile">
                                    <img src={image_profile} onChange={save_profile}/>
                                </div>
                                <div className="mobile-menu-header-info">
                                    <p>Meu Perfil</p>
                                    <span>Ver conta</span>
                                </div>
                            </Link>
                        ) : (
                            <div className="mobile-menu-header-info">
                                <p>Reverto Brecho</p>
                                <span>Moda sustentavel</span>
                            </div>
                        )}
                    </div>

                    {/* Botoes rapidos: Carrinho + Favoritos */}
                    <div className="mobile-quick-actions">
                        <Link to="cart" className="mobile-quick-action-btn" onClick={() => setIsMenuOpen(false)}>
                            <i className="fa-solid fa-cart-shopping"></i>
                            Carrinho
                            {totalCartItems > 0 && (
                                <span className="mobile-quick-action-badge">{totalCartItems}</span>
                            )}
                        </Link>
                        <Link to="favoritos" className="mobile-quick-action-btn" style={{"gap": "25px"}} onClick={() => setIsMenuOpen(false)}>
                            <i className="fa-solid fa-heart"></i>
                            Favoritos
                        </Link>
                    </div>

                    {/* Busca */}
                    <div className="nav-search-mobile">
                       <input
                        type="text"
                        onKeyDown={(e) => {if (e.key === 'Enter') {searchProducts(searchTerm); setIsMenuOpen(false);}}}
                        value={searchTerm}
                        id='searchInputMobile'
                        className="form-control"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder='Pesquisar por...'
                        />
                        <span className="input-group-text" onClick={() => {searchProducts(searchTerm); setIsMenuOpen(false);}} >
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </span>
                    </div>

                    {/* Categorias */}
                    <p className="mobile-menu-section-title">Categorias</p>
                    <ul className="menu-categorys-mobile">
                        <li onClick={() => {setMenu("home"); setIsMenuOpen(false);}} className={menu === "home" ? "category-mobile" : ""}>
                            <Link to="/"><i className="fa-solid fa-house"></i> Home</Link>
                        </li>
                        <li onClick={() => {setMenu("masculina"); setIsMenuOpen(false);}} className={menu === "masculina" ? "category-mobile" : ""}>
                            <Link to="masculina"><i className="fa-solid fa-person"></i> Homens</Link>
                        </li>
                        <li onClick={() => {setMenu("feminina"); setIsMenuOpen(false);}} className={menu === "feminina" ? "category-mobile" : ""}>
                            <Link to="feminina"><i className="fa-solid fa-person-dress"></i> Mulheres</Link>
                        </li>
                        <li onClick={() => {setMenu("kid"); setIsMenuOpen(false);}} className={menu === "kid" ? "category-mobile" : ""}>
                            <Link to="kid"><i className="fa-solid fa-child"></i> Criancas</Link>
                        </li>
                        <li onClick={() => {setMenu("Unissex"); setIsMenuOpen(false);}} className={menu === "Unissex" ? "category-mobile" : ""}>
                            <Link to="Unissex"><i className="fa-solid fa-shirt"></i> Unissex</Link>
                        </li>
                        <li onClick={() => {setMenu("Imperdiveis"); setIsMenuOpen(false);}} className={menu === "Imperdiveis" ? "category-mobile" : ""}>
                            <Link to="Imperdiveis"><i className="fa-solid fa-fire"></i> Imperdiveis</Link>
                        </li>
                        <li onClick={() => {setMenu("Eletronicos"); setIsMenuOpen(false);}} className={menu === "Eletronicos" ? "category-mobile" : ""}>
                            <Link to="Eletronicos"><i className="fa-solid fa-laptop"></i> Eletronicos</Link>
                        </li>
                    </ul>

                    {/* Botao entrar (se nao logado) */}
                    {!isLoggedIn && (
                        <Link to="/LoginSignup" className="mobile-login-btn" onClick={() => setIsMenuOpen(false)}>
                            <i className="fa-solid fa-circle-user"></i> Entrar ou Cadastrar
                        </Link>
                    )}

                    {/* Rodape */}
                    <div className="mobile-menu-footer">
                        <p>Reverto Brecho - Moda Circular</p>
                    </div>
                </div>
                </>
            )}
    </>
  )
}
export default Navbar