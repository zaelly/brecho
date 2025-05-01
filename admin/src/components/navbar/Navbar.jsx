import './Navbar.css'
import logo from '../../assets/hat.png'
import nav_profile from '../../assets/nav_profile.png'
import { Link } from 'react-router-dom'

const Navbar = () => {

  return (
    <div className='Navbar'>
        <div className="nav-logo">
            <img src={logo} alt="" />
            <Link to="welcome">
              <p>Reverto <span>Painel Admin</span></p>
            </Link>
        </div>
        <div className="profile">
          <img src={nav_profile} alt=""/>
        </div>
    </div>
  )
}

export default Navbar