import { useState } from 'react'
import './NewsLetter.css'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const NewsLetter = () => {

  const [ takeEmail, setValueEmail] = useState("")

  const sendEmail = async()=>{
    if(!takeEmail) return toast.warn("Digite um email!")
    try{
      const res = await fetch("http://localhost:4000/sendemail",{
        method: 'POST', 
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email: takeEmail})
      })
      const data = await res.json();
      toast(data.message);
      setValueEmail('');
    }catch(err){
      console.error("Erro ao enviar:", err);
      toast.error("Erro ao enviar e-mail.");
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