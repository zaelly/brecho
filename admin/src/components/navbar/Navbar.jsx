import './Navbar.css'
import logo from '../../assets/hat.png'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import nav_profile from '../../assets/nav_profile.png'


const Navbar = () => {
  const [image_profile, setImage_profile] = useState(nav_profile);
  const [isLoading, setIsLoading] = useState(false);
  const [profileDetail, setProfileDetail] = useState({ image_profile: "" });

 const save_profile = async () => {
    setIsLoading(true); // Inicia o carregamento
    let responseData;

    if (image_profile) {
      let formData = new FormData();
      formData.append('profile', image_profile);

      try {
        const response = await fetch('http://localhost:4000/uploadprofileimage', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        });

        const data = await response.json();
        responseData = data;

        if (responseData.success) {
          setProfileDetail(prev => ({
            ...prev,
            image_profile: responseData.image_url,
          }));
          localStorage.setItem('seller-image', responseData.image_url);
        }
      } catch (error) {
        console.error('Erro ao salvar o perfil:', error);
      }
    }
    setIsLoading(false); // Finaliza o carregamento
  };

  useEffect(() => {
    const savedProfileImage = localStorage.getItem('seller-image');
    if (savedProfileImage) {
      setImage_profile(savedProfileImage);
    }
  }, []);

  return (
    <div className='Navbar'>
        <div className="nav-logo">
            <img src={logo} alt="" />
            <Link to="/admin/welcome">
              <p>Reverto <span>Painel Admin</span></p>
            </Link>
        </div>
        <Link to='/admin/profile'>
          <div className="profile">
            <img src={image_profile} alt=""/>
            <p>Seu Perfil</p>
          </div>
        </Link>
    </div>
  )
}

export default Navbar