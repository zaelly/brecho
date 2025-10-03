import { useState } from 'react';
import './LoginSignup.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';

const LoginSignup = () => {
  const [signup, setSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);  // Estado de carregamento

  const navigate = useNavigate();

  const changeHandle = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${url}0/api/sellers/seller/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        navigate("/admin");
        toast.success("Login feito com sucesso!")
      } else {
        toast.error("Login falhou, tente novamente");
      }
    } catch (err) {
      toast.error("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${url}/api/sellers/seller/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        navigate("/admin");
        toast.success("Cadastro feito com sucesso!")
      } else {
        toast.error("Cadastro falhou: " + data.message);
      }
    } catch (err) {
      toast.error("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="LoginSignup">
      <ToastContainer position="top-right" autoClose={4000} />
      <div className={`loginSignup-container ${signup ? "active" : ""}`}>
        <h1>{signup ? "Sign Up Seller" : "Login Seller"}</h1>
        {signup ? (
          <>
            <div className="login-fields">
              <input
                value={formData.username}
                onChange={changeHandle}
                type="text"
                name="username"
                placeholder="Adicione seu nome"
              />
              <input
                value={formData.email}
                onChange={changeHandle}
                type="email"
                name="email"
                placeholder="Adicione seu email"
              />
              <input
                value={formData.password}
                onChange={changeHandle}
                type="password"
                name="password"
                placeholder="Crie uma senha"
              />
            </div>
            <button onClick={handleSignup} disabled={loading}>
              {loading ? "Cadastrando..." : "Continue"}
            </button>
            <p className="login">
              Já tem uma conta? <span onClick={() => setSignup(false)}>Faça login</span>
            </p>
          </>
        ) : (
          <>
            <div className="login-fields">
              <input
                value={formData.email}
                onChange={changeHandle}
                type="email"
                name="email"
                placeholder="Adicione seu email"
              />
              <input
                value={formData.password}
                onChange={changeHandle}
                type="password"
                name="password"
                placeholder="Crie uma senha"
              />
            </div>
            <button onClick={handleLogin} disabled={loading}>
              {loading ? "Entrando..." : "Continue"}
            </button>
            <p className="login">
              Ainda não é um vendedor? Faça seu <span onClick={() => setSignup(true)}>cadastro!</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
