import { useState } from 'react';
import './LoginSignup.css';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [signup, setSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);  // Estado de carregamento
  const [error, setError] = useState(null);  // Estado para mensagens de erro

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
      const response = await fetch("http://localhost:4000/api/sellers/seller/login", {
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
      } else {
        setError("Login falhou: " + data.message);
      }
    } catch (err) {
      setError("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/sellers/seller/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        navigate("/admin");
      } else {
        setError("Cadastro falhou: " + data.message);
      }
    } catch (err) {
      setError("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="LoginSignup">
      <div className={`loginSignup-container ${signup ? "active" : ""}`}>
        <h1>{signup ? "Sign Up Seller" : "Login Seller"}</h1>

        {error && <div className="error-message">{error}</div>} {/* Mensagem de erro */}

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
