import { useState } from 'react'
import './css/loginSignup.css'
import { Link } from 'react-router-dom';

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

  const login = async() =>{
    console.log("login", formData)

    let responseData;
    await fetch('http://localhost:4000/login',{
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
      alert(responseData.errors)
    }
  }

  const signup = async() =>{
    console.log("signup", formData);

    let responseData;
    await fetch('http://localhost:4000/signup',{
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
      alert(responseData.errors)
    }
  }

  const handleClick = () => {
    window.location.href = 'http://localhost:5174'
  };

  const handleLogin = ()=>{
      setSignup(false);
  }

  const handleSignup = ()=>{
      setSignup(true);
  }

  // const handleEnter = (e)=>{
  //   if(e.key === "Enter"){
  //     if(changeSignup){
  //       signup();
  //     }else{
  //       login();
  //     }
  //   }
  // }

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

            <div className="agree-terms">
              <input type="checkbox" name="" id="" />
              <p>Concordo com os termos de uso e privacidade.</p>
            </div>
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
            <p>
              Área do vendedor
            </p>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default LoginSignup