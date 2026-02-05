import { useState, useEffect, useContext } from 'react';
import './SellerProfile.css';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from '../../context/AdminContext';

const SellerProfile = () => {
  const [image, setImage] = useState(null);
  const [btn_profile, setBtn_profile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {fetchProfile, profileDetail, setProfileDetail, allproducts} = useContext(AdminContext)
  const url = import.meta.env.VITE_API_URL;
  const allProducts = allproducts.length;
  const [width, setWidth] = useState(window.innerWidth);

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const successHandle = () => {
    toast.success('Perfil Alterado!');
    fetchProfile();
  };

  const handleChange = (e) => {
    setProfileDetail({ ...profileDetail, [e.target.name]: e.target.value });
  };
  
  useEffect(() => {
    fetchProfile();
    const resize = ()=> setWidth(window.innerWidth)
    window.addEventListener("resize", resize)

    return ()=>{
      window.removeEventListener("resize", resize);
    }
  }, []);

  const save_profile = async () => {
    setIsLoading(true); // Start loading
    let responseData;
    let profile = {...profileDetail};
    if (image) {
      let formData = new FormData();
      formData.append('profile', image);

      await fetch(`${url}/api/sellers/uploadprofileimage`, {
        method: 'POST',
        headers: {
          'auth-token-seller': localStorage.getItem("auth-token")
        },
        body: formData,
      })
        .then((resp) => resp.json())
        .then((data) => {
          responseData = data;
        });

      if (responseData.success) {
        profile.image = responseData.image_url;
        localStorage.setItem('seller-image', responseData.image_url);
      }
      if (!responseData || !responseData.success) {
        toast.error('Falha ao fazer upload da imagem');
        setIsLoading(false);
        return;
      }

    }

    await fetch(`${url}/api/sellers/updateprofile`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'auth-token-seller': localStorage.getItem('auth-token'),
      },
      body: JSON.stringify(profile)
    })
      .then((resp) => resp.json())
      .then((data) => {
        data.success ? successHandle() : toast.error('Alteração de perfil falhou!');
      })
      .finally(() => setIsLoading(false)); // Stop loading
  };

  return (
    <div className="container-geral">
      <div className="container-config">
        <h3>Informações do Perfil</h3>
        <div className="container-group">
          <div className="left-side">
            <div className="perfil-file">
              <label htmlFor="image">
                  {image ? (
                    <img 
                      src={URL.createObjectURL(image)} 
                      className="addprofile-thumbnail-img" />
                    ) : profileDetail.image ? (
                    <img src={profileDetail.image} className="addprofile-thumbnail-img" />
                  ) : (
                    <i className="fa-solid fa-cloud-arrow-up arrow-cloud"></i>
                  )}
              </label>
              <input disabled={!btn_profile} onChange={handleImage} accept="image/*" type="file" name="image" id="image" hidden />
            </div>
            {width > 1200 && (
              <button className='btn-save'
                onClick={() => {
                  if (btn_profile && !isLoading) {
                    save_profile();
                  }
                  setBtn_profile(!btn_profile);
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : btn_profile ? 'Salvar' : 'Editar'}
            </button>
            )}
          </div>
          <form className="inputsConfig">
            <div className="name">
              <label>Nome da Loja</label>
              <input
                value={profileDetail.name}
                onChange={handleChange}
                type="text"
                name="name"
                disabled={!btn_profile}
                placeholder="adicione aqui o nome da sua loja"
              />
            </div>
            <div className="emailChange">
              <label>Alterar email Admin</label>
              <input
                type="email"
                name="email"
                placeholder="vendedor@gmail.com"
                disabled={!btn_profile}
                value={profileDetail.email}
                onChange={handleChange}
              />
            </div>
            <div className="passwordChange">
              <label>Alterar senha Admin</label>
              <input
                type="password" // Updated to password
                name="new_password"
                placeholder="*******"
                onChange={handleChange}
                value={profileDetail.new_password}
                disabled={!btn_profile}
              />
            </div>
            <div className="gateways">
              <label><i className="fa-solid fa-circle-info"></i> Gateway de pagamento</label>
              <input
                onChange={handleChange}
                value={profileDetail.gatways}
                name="gateways"
                type='text'
                disabled={!btn_profile}
                placeholder="Cole aqui suas chaves do AbacatePay"
              />
              <div className="detailsgateway">
                Faça seu cadastro no <a href="http://https://www.abacatepay.com">AbacatePay</a>, gere suas chaves e
                insira-as aqui para receber pagamentos via PIX e 
                Cartão de Crédito.
              </div>
            </div>
            <div className="description-box">
              <label>Descrição da loja</label>
              <textarea
                rows={5}
                className='textarea-description'
                onChange={handleChange}
                cols={40}
                value={profileDetail.shopDescription}
                name="shopDescription"
                disabled={!btn_profile}
                placeholder="Descreva sua loja!"
              />
            </div>
          </form>
          {width < 1200 && (
            <button className='btn-save'
              onClick={() => {
                if (btn_profile && !isLoading) {
                  save_profile();
                }
                setBtn_profile(!btn_profile);
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : btn_profile ? 'Salvar' : 'Editar'}
          </button>
          )}
        </div>
      </div>  
      <div className="container-infos mb-4">
        <h3>Informações adicionais</h3>
        <div className="info-empresa">
          <div className="container-group-info">
            <div className="vendidos box">
              <p>Produtos vendidos:</p>
              <hr className='hr'></hr>
              <i className="fa-solid fa-cart-flatbed icon"></i>
              <div className='group-box'>
                <span>{profileDetail.produtos_vendidos || 0}</span>
              </div>
            </div>
            <div className="stars box">
              <p>Popularidade:</p>
              <hr className='hr'></hr>
              <div className='group-box'>
                <span>{profileDetail.stars || 0} </span>
                <i className="fa-solid fa-star icon"></i>
              </div>
            </div>
            <div className="estoque box">
              <p>Produtos no Estoque:</p>
              <hr className='hr'></hr>
              <div className='group-box'>
                <span>{allProducts || 0}</span>
                <i className="fa-solid fa-boxes-stacked icon"></i>
              </div>
            </div>
            <div className="vendas box">
              <p>Vendas Completas:</p>
              <hr className='hr'></hr>
              <div className='group-box'>
                {/* trocar para adicionar vendas */}
                <span>{allProducts || 0}</span>
                <i className="fa-solid fa-cash-register icon"></i>
              </div>
            </div>
          </div>
        </div>
      </div>    
    </div>
  );
};

export default SellerProfile;
