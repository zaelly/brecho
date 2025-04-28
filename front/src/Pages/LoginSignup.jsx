import { useEffect, useState } from 'react'
import './css/loginSignup.css'

const LoginSignup = () => {

  const [changeSignup, setSignup] = useState(false);

  const handleLogin = ()=>{
      setSignup(false);
  }

  const handleSignup = ()=>{
      setSignup(true);
    console.log("cadastro")
  }

  return (
    <div className="LoginSignup">
      <div className={`loginSignup-container ${changeSignup ? "active" : ""}`}>
        <h1>{changeSignup ? "Sign Up" : "Login"}</h1>
        {changeSignup ? (
          <>
          {/* CADASTRO */}
            <div className="login-fields">
                <input type="text" placeholder="Adicione seu nome" />
                <input type="email" placeholder="Adicione seu email" />
                <input type="password" placeholder="Crie uma senha" />
            </div>
            <button>Continue</button>

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
                <input type="email" placeholder="Adicione seu email" />
                <input type="password" placeholder="Crie uma senha" />
            </div>
            <button>Continue</button>

            <p className="login">
              Ainda não tem uma conta? Faça seu <span onClick={handleSignup}>cadastro</span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default LoginSignup