import './css/PerfilUser.css'
import {useState, useEffect} from 'react'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const PerfilUser = () => {
  const [image, setImage] = useState(null);
  const [btn_profile, setBtn_profile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileDetail, setProfileDetail] = useState({
    name: '',
    image: '' || '',
    email: 'email',
    new_password: '',
    cpf: '',
    adress: '',
    city: '',
    gateways: [],
  });
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

  const fetchProfile = async () => {
    const res = await fetch(`${url}/api/users/getuserprofile`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem("auth-token"),
      },
    });
    const data = await res.json();

    if (data.success) {
      const usersId = data.data._id;
      setProfileDetail(prev => ({
        ...prev,
        name: data.data.name,
        email: data.data.email,
        image: data.data.image,
        adress: data.data.adress,
        cpf: data.data.cpf,
        city: data.data.city,
        gateways: data.data.gateways || [],
      }));
      localStorage.setItem("users-id", usersId);
      localStorage.setItem("users-name", data.data.name);
      // imagem de cada vendedor setada
      localStorage.setItem(`users-image-${usersId}`, data.data.image);
    } else {
      toast.error(data.errors || "Erro ao buscar perfil");
    }
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
        data.success ? successHandle() : toast.error('Alteração de perfil falhou!');
      })
      .finally(() => setIsLoading(false)); // Stop loading
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
                  <label htmlFor="name">Nome de Usúario</label>
                  <input
                    value={profileDetail.name}
                    onChange={handleChange}
                    type="text"
                    name="name"
                    className="form-control"
                    disabled={!btn_profile}
                    placeholder="nome de usuário"
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
                <label htmlFor="inputAddress">Endereço</label>
                <input type='text' className="form-control"  name='adress'
                placeholder="1234 Main St" disabled={!btn_profile} 
                onChange={handleChange} value={profileDetail.adress}/>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="inputCity">Cidade</label>
                  <input type="text" name='city' className="form-control" disabled={!btn_profile} onChange={handleChange} value={profileDetail.city}/>
                </div>
              </div>
          </form>
        </div>
      </div>
      <div className="btn">
        <button
          onClick={() => {
            if (btn_profile && !isLoading) {
              save_profile();
            }
            setBtn_profile(!btn_profile);
          }}
          disabled={isLoading} // Disable the button while saving
        >
          {isLoading ? 'Salvando...' : btn_profile ? 'Salvar' : 'Editar'}
        </button>

        <button className="logout" onClick={goOut}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default PerfilUser