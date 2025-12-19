import { useContext, useEffect, useState } from "react";
import "./ClientChat.css";
import { ShopContext } from "../../Context/ShopContext";

const ClientChat = ({ isOpen, setIsOpen, sellerId }) => {
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [enterprise, setEnterprise] = useState({name: ""});
  const [message, setMessage] = useState("");
  const {profileDetail, fetchProfile} = useContext(ShopContext);
  const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const profileId = profileDetail?._id;
  
  const sendMessage = async () => {
    if (!message.trim()) return;
    if(!profileId){
      return console.log("id usuario ainda nao carregado")
    }

    const newMessage = {
      sender: profileId,
      content: message,
      time: new Date().toLocaleTimeString()
    }
    
    setSentMessages(prev => [...prev, newMessage]);
    setMessage("");

    try{
      const res = await fetch(`${url}/api/chat/saveMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: profileId,
          content: newMessage.content,
          chat: sellerId
        })
      })

      const data = await res.json();
      if(data.success){
        console.log("Mensagem enviada ao servidor:", data.data);
      }
    }catch(err){
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  const receiveMessage = (msg) => {
    setReceivedMessages(prev => [
      ...prev,
      { content: msg, time: new Date().toLocaleTimeString() }
    ]);
  };

  const getMessages = async () => {
    try{
      if (!sellerId || !profileId) return;

      const res = await fetch(`${url}/api/chat/getMessages?chat=${sellerId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if(data.success){
        const msgs = data.data.map(msg => ({
          content: msg.content,
          sender: String(msg.sender),
          time: new Date(msg.createdAt).toLocaleTimeString(),
          createdAt: msg.createdAt
        }));

        msgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

        setReceivedMessages(
          msgs.filter(m => m.sender !== (profileId))
        );
        setSentMessages(
          msgs.filter(m => m.sender === (profileId))
        );

        console.log("Mensagens carregadas do servidor:", msgs);
      }
    }catch(err){
      console.error("Erro ao buscar mensagens:", err);
    }
  };

  const fetchSeller = async () => {
    if (!sellerId) return;
    try {
      const res = await fetch(`${url}/api/sellers/getseller/${sellerId}`);
      const data = await res.json();
      if (data.success) setEnterprise({ name: data.data.name });
    } catch (err) {
      console.error("Erro ao buscar seller no chat:", err);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    fetchSeller();
    fetchProfile();

    if (receivedMessages.length === 0 && sentMessages.length === 0) {
      receiveMessage("Olá! Como podemos ajudar você hoje?");
    }
  }, [sellerId, isOpen]);

  useEffect(()=>{
    if(!profileId || !sellerId || !isOpen) return
    getMessages();
  },[profileId, sellerId, isOpen])

  return (
    <div className={`main-container-chat ${isOpen ? "active" : ""}`}>
      <div className="container-header" onClick={() => setIsOpen(false)}>
        <p>{enterprise.name || "Carregando..."}</p>
      </div>

      <div className="container-chat">
        <div className="messages">
          {receivedMessages.length === 0 && sentMessages.length === 0 ? (
            <div className="no-messages">
              <i className="fa-solid fa-comments"></i>
              <span>Sem mensagens ainda</span>
            </div>
          ) : (
            <>
              {receivedMessages.map((msg, i) => (
                <div key={`r-${i}`} className="received">
                  <p className="messageboxR">{msg.content}</p>
                  <span className="time">{msg.time}</span>
                </div>
              ))}
              {sentMessages.map((msg, i) => (
                <div key={`s-${i}`} className="sent">
                  <p className="messageboxS">{msg.content}</p>
                  <span className="time">{msg.time}</span>
                </div>
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
          onChange={e => setMessage(e.target.value)}
          onKeyUp={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}><i className="fa-solid fa-paper-plane"></i></button>
      </div>
    </div>
  );
};

export default ClientChat;
