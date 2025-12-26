import { useState, useEffect, useContext } from 'react';
import './SellerProfile.css';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from '../../context/AdminContext';

const SellerProfile = () => {
  const [image, setImage] = useState(null);
  const [btn_profile, setBtn_profile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {fetchProfile, profileDetail, setProfileDetail} = useContext(AdminContext)
  const url = import.meta.env.VITE_API_URL;

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

  const goOut = () => {
    localStorage.removeItem('auth-token-seller');
    localStorage.removeItem('seller-image');
    window.location.replace('/');
  };

  return (
    <div className="container-geral">
      <div className="container-config">
        <div className="container-group">
          <div className="left-side">
            <div className="perfil-file">
              <label htmlFor="file-input">
                  {image ? (
                    <img src={URL.createObjectURL(image)} className="addprofile-thumbnail-img" />
                  ) : profileDetail.image ? (
                    <img src={profileDetail.image} className="addprofile-thumbnail-img" />
                  ) : (
                    <i className="fa-solid fa-cloud-arrow-up arrow-cloud"></i>
                  )}
              </label>
              <input disabled={!btn_profile} onChange={handleImage} type="file" name="image" id="file-input" hidden />
            </div>
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
          </div>
          <form className="inputsConfig">
            <div className="formInputs">
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
                  Faça seu cadastro no <a href="http://https://www.abacatepay.com">AbacatePay</a>, gere suas chaves e <br/>
                  insira-as aqui para receber pagamentos via PIX e 
                  Cartão de Crédito.
                </div>
              </div>
              <div className="description">
                <label>Descrição da loja</label>
                <textarea
                  rows={5}
                  onChange={handleChange}
                  cols={40}
                  value={profileDetail.shopDescription}
                  name="shopDescription"
                  disabled={!btn_profile}
                  placeholder="Descreva sua loja!"
                />
              </div>
            </div>
          </form>
          <div className="info-empresa">
            <div className="vendidos">
              <label>Produtos vendidos:</label>
              <span>{profileDetail.produtos_vendidos || 0}</span>
            </div>
            <div className="stars">
              <label>Popularidade:</label>
              <span>{profileDetail.stars || 0} ⭐</span>
            </div>
          </div>
        </div>
      </div>
      <div className="btn">
        <button className="logout" onClick={goOut}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default SellerProfile;
