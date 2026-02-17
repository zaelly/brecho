import { useState } from 'react'
import './css/loginSignup.css'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const LoginSignup = () => {

  const [changeSignup, setSignup] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1 = email, 2 = codigo + nova senha
  const [resetData, setResetData] = useState({ email: '', code: '', newPassword: '' });

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
    let responseData;
    await fetch(`${url}/api/users/user/login`,{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type': 'application/json'
      }, body:JSON.stringify(formData),
    }).then((response)=>response.json())
    .then((data)=>responseData=data);

    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    }else{
      toast.error(responseData.errors)
    }
  }

  const signup = async() =>{
    let responseData;
    await fetch(`${url}/api/users/user/signup`,{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(formData),
    }).then((response)=>response.json())
    .then((data)=>responseData=data);

    if(responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    }else{
      toast.error(responseData.errors)
    }
  }

  const handleClick = () => {
    return window.location.href = import.meta.env.VITE_VENDEDOR_URL_LOCAL || import.meta.env.VITE_VENDEDOR_URL;
  };

  const handleLogin = ()=>{
      setSignup(false);
      setForgotPassword(false);
  }

  const handleSignup = ()=>{
      setSignup(true);
      setForgotPassword(false);
  }

  // enviar codigo de recuperacao
  const sendResetCode = async () => {
    if (!resetData.email) {
      toast.warn("Digite seu email!");
      return;
    }
    try {
      const res = await fetch(`${url}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetData.email }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Codigo enviado para seu email!");
        setResetStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Erro ao enviar codigo");
    }
  };

  // resetar senha com codigo
  const resetPassword = async () => {
    if (!resetData.code || !resetData.newPassword) {
      toast.warn("Preencha todos os campos!");
      return;
    }
    try {
      const res = await fetch(`${url}/api/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Senha alterada com sucesso! Faca login.");
        setForgotPassword(false);
        setResetStep(1);
        setResetData({ email: '', code: '', newPassword: '' });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Erro ao resetar senha");
    }
  };

  return (
    <div className="LoginSignup">
      <div className={`loginSignup-container ${changeSignup ? "active" : ""}`}>

        {forgotPassword ? (
          <>
            <h1>Recuperar Senha</h1>
            {resetStep === 1 ? (
              <>
                <div className="login-fields">
                  <input
                    type="email"
                    placeholder="Digite seu email"
                    value={resetData.email}
                    onChange={(e) => setResetData({...resetData, email: e.target.value})}
                  />
                </div>
                <button onClick={sendResetCode}>Enviar Codigo</button>
              </>
            ) : (
              <>
                <div className="login-fields">
                  <input
                    type="text"
                    placeholder="Codigo recebido por email"
                    value={resetData.code}
                    onChange={(e) => setResetData({...resetData, code: e.target.value})}
                  />
                  <input
                    type="password"
                    placeholder="Nova senha"
                    value={resetData.newPassword}
                    onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                  />
                </div>
                <button onClick={resetPassword}>Alterar Senha</button>
              </>
            )}
            <p className="login">
              Lembrou a senha? <span onClick={handleLogin}>Voltar ao login</span>
            </p>
          </>
        ) : (
          <>
            <h1>{changeSignup ? "Sign Up" : "Login"}</h1>
            {changeSignup ? (
              <>
                <div className="login-fields">
                    <input value={formData.username} onChange={changeHandle} type="text" name="username" placeholder="Adicione seu nome" />
                    <input value={formData.email} onChange={changeHandle} type="email" name="email" placeholder="Adicione seu email" />
                    <input value={formData.password} onChange={changeHandle} type="password" name="password" placeholder="Crie uma senha" />
                </div>
                <button onClick={()=>{signup()}}>Continue</button>

                <p className="login">
                  Ja tem uma conta? <span onClick={handleLogin}>Faca login</span>
                </p>
              </>
            ) : (
              <>
                <div className="login-fields">
                    <input value={formData.email} onChange={changeHandle} type="email" name='email' placeholder="Adicione seu email" />
                    <input value={formData.password} onChange={changeHandle} type="password" name='password' placeholder="Crie uma senha" />
                </div>
                <button onClick={()=>{login()}}>Continue</button>

                <p className="login">
                  Ainda nao tem uma conta? Faca seu <span onClick={handleSignup}>cadastro</span>
                </p>

                <p className="login" style={{marginTop:'5px'}}>
                  <span onClick={() => setForgotPassword(true)} style={{color:'#2196f3', cursor:'pointer'}}>
                    Esqueci minha senha
                  </span>
                </p>

                <Link className='areaVendedor' onClick={handleClick}>
                  Area do vendedor
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default LoginSignup
