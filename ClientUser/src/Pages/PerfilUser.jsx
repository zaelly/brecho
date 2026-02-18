import './css/PerfilUser.css'
import {useState, useEffect, useContext} from 'react'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ShopContext } from '../Context/ShopContext';
import { Link } from 'react-router-dom';

const estadosBrasil = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO"
];

const PerfilUser = () => {
  const [image, setImage] = useState(null);
  const [btn_profile, setBtn_profile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const {fetchProfile, profileDetail, setProfileDetail} = useContext(ShopContext);
  const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';

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

  const formatCep = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length > 5) {
      return digits.slice(0, 5) + '-' + digits.slice(5);
    }
    return digits;
  };

  const handleCepChange = (e) => {
    const formatted = formatCep(e.target.value);
    setProfileDetail({ ...profileDetail, cep: formatted });

    const digits = formatted.replace(/\D/g, '');
    if (digits.length === 8) {
      buscarCep(digits);
    }
  };

  const buscarCep = async (cep) => {
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) {
        toast.error('CEP nao encontrado!');
        setCepLoading(false);
        return;
      }
      setProfileDetail(prev => ({
        ...prev,
        adress: data.logradouro || prev.adress,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
      }));
      toast.success('Endereco preenchido pelo CEP!');
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
      toast.error('Erro ao buscar CEP');
    } finally {
      setCepLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const save_profile = async () => {
    setIsLoading(true);
    let responseData;
    let profile = {...profileDetail};
    if (image) {
      let formData = new FormData();
      formData.append('profile', image);

      await fetch(`${url}/api/users/uploadprofileimage`, {
        method: 'POST',
        headers: {
          'auth-token': localStorage.getItem("auth-token")
        },
        body: formData,
      })
        .then((resp) => resp.json())
        .then((data) => {
          responseData = data;
        });

      if (responseData.success) {
        profile.image = responseData.image_url;
        localStorage.setItem('user-image', responseData.image_url);
      }
      if (!responseData || !responseData.success) {
        toast.error('Falha ao fazer upload da imagem');
        setIsLoading(false);
        return;
      }

    }

    await fetch(`${url}/api/users/updateprofile`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token'),
      },
      body: JSON.stringify(profile)
    })
      .then((resp) => resp.json())
      .then((data) => {
        data.success ? successHandle() : toast.error('Alteracao de perfil falhou!');
      })
      .finally(() => setIsLoading(false));
  };

  const goOut = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-image');
    window.location.replace('/');
  };

  return (
    <div className='userPerfil-container'>
      <div className="container-config">
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
          <button
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
        <div className="inputsConfig">
            <form>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="inputEmail4">Alterar email</label>
                  <input
                    className="form-control"
                    type="text"
                    name="email"
                    placeholder="user@gmail.com"
                    disabled={!btn_profile}
                    value={profileDetail.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="inputPassword4">Password</label>
                  <input type="password" className="form-control"
                    name="new_password"
                    placeholder="*******"
                    onChange={handleChange}
                    value={profileDetail.new_password}
                    disabled={!btn_profile}/>
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="name">Nome de Usuario</label>
                  <input
                    value={profileDetail.name}
                    onChange={handleChange}
                    type="text"
                    name="name"
                    className="form-control"
                    disabled={!btn_profile}
                    placeholder="nome de usuario"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="CPF">CPF</label>
                  <input
                    value={profileDetail.cpf}
                    onChange={handleChange}
                    type="number"
                    className="form-control"
                    name="cpf"
                    disabled={!btn_profile}
                    placeholder="CPF"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>CEP</label>
                <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                  <input type='text' className="form-control" name='cep'
                    placeholder="12345-678" disabled={!btn_profile}
                    onChange={handleCepChange} value={profileDetail.cep || ''}
                    maxLength={9}/>
                  {cepLoading && <span style={{fontSize:'12px', color:'#999'}}>Buscando...</span>}
                </div>
              </div>
              <div className="form-group">
                <label>Endereco</label>
                <input type='text' className="form-control" name='adress'
                  placeholder="Rua, numero, complemento" disabled={!btn_profile}
                  onChange={handleChange} value={profileDetail.adress || ''}/>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Cidade</label>
                  <input type="text" name='city' className="form-control" disabled={!btn_profile} onChange={handleChange} value={profileDetail.city || ''}/>
                </div>
                <div className="form-group col-md-6">
                  <label>Estado</label>
                  <select name='state' className="form-control" disabled={!btn_profile} onChange={handleChange} value={profileDetail.state || ''}>
                    <option value="">Selecione o estado</option>
                    {estadosBrasil.map(uf => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
              </div>
          </form>
          <div className="btn" style={{gap:'10px'}}>
            <Link to="/meuspedidos">
              <button style={{backgroundColor:'#2196f3'}}>
                <i className="fa-solid fa-bag-shopping"></i> Meus Pedidos
              </button>
            </Link>
            <Link to="/favoritos">
              <button style={{backgroundColor:'#e91e63'}}>
                <i className="fa-solid fa-heart mr-1"></i> Favoritos
              </button>
            </Link>
            <Link to="/mensagens">
              <button style={{backgroundColor:'#4caf50'}}>
                <i className="fa-solid fa-comments"></i> Minhas Mensagens
              </button>
            </Link>
            <button className="logout" onClick={goOut}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerfilUser