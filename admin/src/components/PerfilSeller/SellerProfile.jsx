import { useState, useEffect } from 'react';
import './SellerProfile.css';

const SellerProfile = () => {
  const [image, setImage] = useState(null);
  const [btn_profile, setBtn_profile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileDetail, setProfileDetail] = useState({
    name: '',
    image: '',
    email: 'email',
    new_password: '',
    description: '',
    produtos_vendidos: '',
    stars: '',
  });

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const successHandle = () => {
    alert('Perfil Alterado!');
    fetchProfile();
  };

  const handleChange = (e) => {
    setProfileDetail({ ...profileDetail, [e.target.name]: e.target.value });
  };

  const fetchProfile = async () => {
    const res = await fetch("http://localhost:4000/getsellerprofile", {
      method: "GET",
      headers: {
        'auth-token': localStorage.getItem("auth-token"),
      },
    });
    const data = await res.json();
    if (data.success) {
      const sellerId = data.data._id;
      setProfileDetail(prev => ({
        ...prev,
        name: data.data.name,
        email: data.data.email,
        description: data.data.description || '',
        image: data.data.image || '',
        produtos_vendidos: data.data.produtos_vendidos,
        stars: data.data.stars,
      }));
      localStorage.setItem("seller-id", sellerId);
      localStorage.setItem(`seller-image-${sellerId}`, data.data.image || '');
    } else {
      alert(data.errors || "Erro ao buscar perfil");
    }
  };
  
  useEffect(() => {
    fetchProfile();
  }, []);

  const save_profile = async () => {
    setIsLoading(true); // Start loading
    let responseData;
    let profile = profileDetail;

    if (image) {
      let formData = new FormData();
      formData.append('profile', image);

      await fetch('http://localhost:4000/uploadprofileimage', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
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
    }

    await fetch('http://localhost:4000/updateprofile', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token'),
      },
      body: JSON.stringify(profile),
    })
      .then((resp) => resp.json())
      .then((data) => {
        data.success ? successHandle() : alert('Alteração de perfil falhou!');
      })
      .finally(() => setIsLoading(false)); // Stop loading
  };

  const goOut = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('seller-image');
    window.location.replace('/');
  };

  return (
    <div className="SellerProfile">
      <div className="container-config">
        <div className="perfil-file">
          <label htmlFor="file-input">
            {image ? (
              <img src={URL.createObjectURL(image)} className="addprofile-thumbnail-img" />
            ) : (
              <i className="fa-solid fa-cloud-arrow-up"></i>
            )}
          </label>
          <input onChange={handleImage} type="file" name="image" id="file-input" hidden />
        </div>
        <div className="inputsConfig">
          <div className="name">
            <p>Nome da Loja</p>
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
            <p>Alterar email Admin</p>
            <input
              type="text"
              name="email"
              placeholder="vendedor@gmail.com"
              disabled={!btn_profile}
              value={profileDetail.email}
              onChange={handleChange}
            />
          </div>
          <div className="passwordChange">
            <p>Alterar senha Admin</p>
            <input
              type="password" // Updated to password
              name="new_password"
              placeholder="*******"
              onChange={handleChange}
              value={profileDetail.new_password}
              disabled={!btn_profile}
            />
          </div>
          <div className="description">
            <p>Descrição da loja</p>
            <textarea
              rows={5}
              onChange={handleChange}
              cols={40}
              value={profileDetail.description}
              name="description"
              id=""
              disabled={!btn_profile}
              placeholder="Descreva sua loja!"
            />
          </div>
        </div>
        <div className="info-empresa">
          <div className="vendidos">
            <p>Produtos vendidos:</p>
            <input type="number" disabled value={profileDetail.produtos_vendidos || 0} />
          </div>
          <div className="stars">
            Popularidade:
            <span>{profileDetail.stars || 0} ⭐</span>
          </div>
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
  );
};

export default SellerProfile;
