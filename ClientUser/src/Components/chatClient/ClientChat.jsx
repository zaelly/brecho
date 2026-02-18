import { useContext, useEffect, useState, useRef } from "react";
import "./ClientChat.css";
import { ShopContext } from "../../Context/ShopContext";
import { io } from "socket.io-client";

const ClientChat = ({ isOpen, setIsOpen, sellerId }) => {
  const [allMessages, setAllMessages] = useState([]);
  const [enterprise, setEnterprise] = useState({name: ""});
  const [message, setMessage] = useState("");
  const {profileDetail, fetchProfile} = useContext(ShopContext);
  const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const profileId = profileDetail?._id;
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // conectar socket
  useEffect(() => {
    socketRef.current = io(url);

    socketRef.current.on('receiveMessage', (data) => {
      // filtrar: so aceitar mensagens do vendedor atual para este cliente
      if (data.sender === sellerId || data.chat === sellerId) {
        setAllMessages(prev => [...prev, {
          content: data.content,
          sender: data.sender,
          time: data.time || new Date().toLocaleTimeString()
        }]);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url, sellerId]);

  // entrar na sala quando tiver profileId
  useEffect(() => {
    if (profileId && socketRef.current) {
      socketRef.current.emit('join', profileId);
    }
  }, [profileId]);

  // scroll para baixo quando novas mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

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

    setAllMessages(prev => [...prev, newMessage]);

    // enviar via socket
    if (socketRef.current) {
      socketRef.current.emit('sendMessage', {
        sender: profileId,
        receiver: sellerId,
        content: message,
        chat: sellerId
      });
    }

    setMessage("");

    // salvar no banco tambem
    try{
      await fetch(`${url}/api/chat/saveMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: profileId,
          content: newMessage.content,
          chat: sellerId
        })
      });
    }catch(err){
      console.error("Erro ao salvar mensagem:", err);
    }
  };

  const getMessages = async () => {
    try{
      if (!sellerId || !profileId) return;

      const res = await fetch(`${url}/api/chat/getMessages?chat=${sellerId}&clientId=${profileId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if(data.success){
        const msgs = data.data.map(msg => ({
          content: msg.content,
          sender: String(msg.sender),
          time: new Date(msg.createdAt).toLocaleTimeString()
        }));

        setAllMessages(msgs);
      }
    }catch(err){
      console.error("Erro ao buscar mensagens:", err);
    }
  };

  const fetchSellerInfo = async () => {
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
    fetchSellerInfo();
    fetchProfile();
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
          {allMessages.length === 0 ? (
            <div className="no-messages">
              <i className="fa-solid fa-comments"></i>
              <span>Sem mensagens ainda</span>
            </div>
          ) : (
            allMessages.map((msg, i) => (
              <div key={i} className={msg.sender === profileId ? "sent" : "received"}>
                <p className={msg.sender === profileId ? "messageboxS" : "messageboxR"}>
                  {msg.content}
                </p>
                <span className="time">{msg.time}</span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
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
