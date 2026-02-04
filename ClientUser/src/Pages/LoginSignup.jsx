import { useState } from 'react'
import './css/loginSignup.css'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const LoginSignup = () => {

  const [changeSignup, setSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  })

  const changeHandle = (e) =>{
    setFormData({...formData, [e.target.name]:e.target.value})
  }
  const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const login = async() =>{
    if (!formData.email || !formData.password) {
      toast.error("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch(`${url}/api/users/user/login`,{
        method:'POST',
        headers:{
          'Accept':'application/json',
          'Content-Type': 'application/json'
        }, 
        body:JSON.stringify(formData),
      });

      const responseData = await response.json();

      if(responseData.success){
        localStorage.setItem('auth-token', responseData.token);
        toast.success("Login realizado com sucesso!");
        window.location.replace("/");
      }else{
        toast.error(responseData.errors || responseData.message || "Erro ao fazer login");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Erro ao conectar com o servidor");
    }
  }

  const signup = async() =>{
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch(`${url}/api/users/user/signup`,{
        method:'POST',
        headers:{
          'Accept':'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(formData),
      });

      const responseData = await response.json();

      if(responseData.success){
        localStorage.setItem('auth-token', responseData.token);
        toast.success("Cadastro realizado com sucesso!");
        window.location.replace("/");
      }else{
        toast.error(responseData.errors || responseData.message || "Erro ao fazer cadastro");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error("Erro ao conectar com o servidor");
    }
  }

  const handleClick = () => {
    return window.location.href = import.meta.env.VITE_VENDEDOR_URL_LOCAL || import.meta.env.VITE_VENDEDOR_URL;
  };

  const handleLogin = ()=>{
      setSignup(false);
  }

  const handleSignup = ()=>{
      setSignup(true);
  }

  return (
    <div className="LoginSignup">
      <div className={`loginSignup-container ${changeSignup ? "active" : ""}`}>
        <h1>{changeSignup ? "Sign Up" : "Login"}</h1>
        {changeSignup ? (
          <>
          {/* CADASTRO */}
            <div className="login-fields">
                <input value={formData.username} onChange={changeHandle} type="text" name="username" placeholder="Adicione seu nome" />
                <input value={formData.email} onChange={changeHandle} type="email" name="email" placeholder="Adicione seu email" />
                <input value={formData.password} onChange={changeHandle} type="password" name="password" placeholder="Crie uma senha" />
            </div>
            <button onClick={()=>{signup()}}>Continue</button>

            <p className="login">
              Já tem uma conta? <span onClick={handleLogin}>Faça login</span>
            </p>
{/* 
            <div className="agree-terms">
              <input type="checkbox" name="" id="" required />
              <p>Concordo com os termos de uso e privacidade.</p>
            </div> */}
          </>
        ) : (
          <>
          {/* LOGIN*/}
            <div className="login-fields">
                <input value={formData.email} onChange={changeHandle} type="email" name='email' placeholder="Adicione seu email" />
                <input value={formData.password} onChange={changeHandle} type="password" name='password' placeholder="Crie uma senha" />
            </div>
            <button onClick={()=>{login()}}>Continue</button>

            <p className="login">
              Ainda não tem uma conta? Faça seu <span onClick={handleSignup}>cadastro</span>
            </p>

            <Link className='areaVendedor' onClick={handleClick}>
              Área do vendedor
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default LoginSignup