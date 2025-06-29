import { useState } from 'react'
import './NewsLetter.css'

const NewsLetter = () => {

  const [ takeEmail, setValueEmail] = useState("")

  const sendEmail = async()=>{
    if(!takeEmail) return alert("Digite um email!")
    try{
      const res = await fetch("http://localhost:4000/sendemail",{
        method: 'POST', 
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email: takeEmail})
      })
      const data = await res.json();
      alert(data.message);
      setValueEmail('');
    }catch(err){
      console.error("Erro ao enviar:", err);
      alert("Erro ao enviar e-mail.");
    }
    
  }

  return (
    <div className='newsletter'>
      <div className="texts">
        <h1>Receba Ofertas Exclusivas No Seu Email</h1>
        <p>Increve-se no nosso canal de noticias e fique por dentro de tudo!</p>
      </div>
        <div className='inpt'>
          <input type="email" placeholder='Adicione seu Email aqui' 
            value={takeEmail} 
            onChange={(e)=>{
              setValueEmail(e.target.value); 
              }
            } 
            />
          <button onClick={sendEmail}>Inscreva-se</button>
        </div>
    </div>
  )
}

export default NewsLetter