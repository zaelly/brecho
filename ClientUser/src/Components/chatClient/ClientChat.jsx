import { useEffect, useState } from "react";
import "./ClientChat.css";

const ClientChat = ({ isOpen, setIsOpen }) => {
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [sentMessages, setSentMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [enterprise, setEnterprise] = useState({
        name: "",
    });
    const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';

    const sendMessage = () => {
        if (!message.trim()) return;
        setSentMessages([...sentMessages, message]);
        setMessage("");
    };

    const receiveMessage = () => {
        if (!message.trim()) return;
        setSentMessages([...receivedMessages, message]);
        setSentMessages("");
    };

    const fetchProfile = async () => {
        const res = await fetch(`${url}/api/sellers/getsellerprofile`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
        });
        const data = await res.json();
        if (data.success) {
        const sellerId = data.data._id;
        setEnterprise(prev => ({
            ...prev,
            name: data.data.name
        }));
        localStorage.setItem("seller-id", sellerId);
        // imagem de cada vendedor setada
        localStorage.setItem(`seller-image-${sellerId}`, data.data.image);
        } 
    };

    useEffect(() => {
        fetchProfile();
    }, []);

  return (
    <div className={`main-container-chat ${isOpen ? "active" : ""}`}>
      <div className="container-header">
        <p>Chat Client</p>
        <i className="fa-solid fa-xmark" onClick={() => setIsOpen(false)}></i>
      </div>

      <div className="container-chat">
        <div className="messages">
          {sentMessages.length === 0 && receivedMessages.length === 0 ? (
            <div className="no-messages">
              <i className="fa-solid fa-comments"></i>
              <span>Sem mensagens ainda</span>
            </div>
          ) : (
            <>
              {receivedMessages.map((msg, i) => (
                <div key={i} className="received">{receiveMessage}</div>
              ))}
              {sentMessages.map((msg, i) => (
                <div key={i} className="sent">{msg}</div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="container-input-chat">
          <input 
            type="text" 
            placeholder="Digite sua mensagem..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={(e)=>{
                if(e.key === "13" || e.key === "Enter"){
                    sendMessage
                }
            }}
          />
          <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default ClientChat;
