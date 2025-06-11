import './Navbar.css'
import logo from '../../assets/hat.png'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import nav_profile from '../../assets/nav_profile.png'

const Navbar = () => {
  const [image_profile, setImage_profile] = useState(nav_profile);
  const [isLoading, setIsLoading] = useState(false);
  const [profileFile, setProfileFile] = useState(null);

 const save_profile = async () => {
    setIsLoading(true); // Inicia o carregamento
    let responseData;

    if (image_profile) {
      let formData = new FormData();
      formData.append('profile', profileFile);

      try {
        const response = await fetch('http://localhost:4000/api/sellers/uploadprofileimage', {
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
          localStorage.setItem('seller-image', responseData.image_url);
        }
      } catch (error) {
        console.error('Erro ao salvar o perfil:', error);
      }
    }
    setIsLoading(false); // Finaliza o carregamento
  };

  useEffect(() => {
   const handleStoreChange = () =>{
    const updateImage = localStorage.getItem('seller-image');
    if(updateImage) setImage_profile(updateImage);
   }
   window.addEventListener('storage', handleStoreChange);

   return ()=>{
    window.removeEventListener('storage', handleStoreChange);
   };
  }, []);

  return (
    <div className='Navbar'>
      {/* verificar pq nao ta pegando a imagem q add no navbar */}
        <div className="nav-logo">
            <img src={logo} alt="" />
            <Link to="/admin/welcome">
              <p>Reverto <span>Painel Admin</span></p>
            </Link>
        </div>
        <Link to='/admin/profile'>
          <div className="profile">
            <img src={image_profile} onChange={save_profile} alt=""/>
            <p>Seu Perfil</p>
          </div>
        </Link>
    </div>
  )
}

export default Navbar