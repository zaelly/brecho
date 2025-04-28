import './Navbar.css'
import logo from '../../assets/hat.png'
import nav_profile from '../../assets/nav_profile.png'
import arrow_icon from '../../assets/arrow_icon.png'
import Dropdown from 'react-bootstrap/Dropdown';
import { useState } from 'react';

const Navbar = () => {

  //se clicar no icone do perfil aparece o dropdown menu

  const [menu, setMenu] = useState(false)

  const handleMenu = () =>{
    //se o valor do menu for false ele some os itens
    if(!menu){
      setMenu(true);
    }else{
      setMenu(false);
    }
    
  }
  return (
    <div className='Navbar'>
        <div className="nav-logo">
            <img src={logo} alt="" />
            <p>Painel Admin Reverto</p>
        </div>
        <div className="profile" onClick={handleMenu}>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                <img src={nav_profile} alt=""/>
              </Dropdown.Toggle>
              <Dropdown.Menu className={menu ? "" : "menu-hidden"}>
                <Dropdown.Item href="#/action-1">Configurar perfil</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Configurar Site</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* colocar css pra ele ficar apontado pra cima e quando clicado apontar pra baixo */}
            {/* <img src={arrow_icon} alt="" className={`arro w_icon ${menu ? "arrow-toggle" : ""}`}/> */}
        </div>
    </div>
  )
}

export default Navbar