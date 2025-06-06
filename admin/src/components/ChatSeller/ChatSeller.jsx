import { useState } from 'react'
import './ChatSeller.css'
import Join from '../Join/Join';

const ChatSeller = () => {
    const [allChats, setAllChats] = useState([])
    const [newMsg, setNewMsg] = useState(false)
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [clickMsg, setClickMsg] = useState(false)

  return (
    <div className="ChatSeller">
        {/* mostra os users msg */}
        <div className='chatsList'>
            {/* quando clica no chat ele 
            traz a conversa */}
            {allChats > 0 ? (allChats.map((chats)=>(
                <div key={chats.id} 
                    className={`inputSeller ${selectedChatId === chats.id ? 'active' : ''}`}
                    onClick={() => {setSelectedChatId(chats.id); setClickMsg(true)}} >
                    <div className="userChat">
                        <img src={chats.image}/>   
                        <p>{chats.name}</p>  
                    </div>
                    {/* se tiver mensagem nova */}
                    <div className={newMsg ? "newMsg" : "hide"}>
                        <i className="fa-solid fa-circle-exclamation"></i>
                    </div>
                </div>  
            ))) : (
                <h1>Sem mensagens</h1>
            )}
        </div>
        {/* lado q mostra as mensagens */}
        <div className="msg-box">
            {clickMsg ? 
                <Join 
                    id={item._id} 
                    name={item.name} 
                    image={item.image} 
                /> 
                : 
                <h3>Nada por aqui!</h3>
            }
        </div> 
    </div>
  )
}

export default ChatSeller