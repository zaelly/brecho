import { useState } from 'react'
import './ChatSeller.css'
import heroImage from '../../assets/hero.png';

const ChatSeller = () => {
    const [allChats, setAllChats] = useState([])
  return (
    <div className="ChatSeller">
        {/* mostra os users msg */}
        <div className='chatsList'>
            <p>teste</p>
            <div className="userChat">
                {/* quando clica no chat ele 
                traz a conversa */}
                <div className="inputSeller">
                <img src={heroImage}/>   
                <p>Zaelly</p>  
                </div>
            </div> 
        </div>
        {/* lado q mostra as mensagens */}
        <div className="msg-box">
            <h1>Nenhuma mensagem</h1>
        </div>
    </div>
  )
}

export default ChatSeller