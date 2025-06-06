import { useState } from 'react';
import './Join.css'

const Join = (props) => {

  const [mensage, setMensage] = useState("")
    const sendMsg = (e)=>{
      console.log(mensage)
      setMensage("");
    }
  return (
    <div className="Join" id={props.id}>
        {/* quando clica em um chat ao lado aparece 
        as mensagens desse chat */}
        <div className="chatBox-header">
            <div className="userChat">
                <img src={props.image}/>   
                <p>{props.name}zaelly</p>  
            </div>
        </div> 
        <div className="chatMessages">
          {/* Aqui entram as mensagens do chat */}
        </div>

        <div className="joinMsg">
          <div className="footer-sendmsg">
            <input type="text" name="sendMsg" value={mensage} 
            onChange={(e)=> setMensage(e.target.value)} 
            className='sendmsg' placeholder='Digite uma mensagem'/>
            <i className="fa-regular fa-circle-right" onClick={sendMsg}></i>
          </div>
        </div>
    </div>
  )
}

export default Join