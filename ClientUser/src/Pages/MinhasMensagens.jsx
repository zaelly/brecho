import { useContext, useEffect, useState, useRef } from "react";
import "./css/MinhasMensagens.css";
import { ShopContext } from "../Context/ShopContext";
import { io } from "socket.io-client";

const MinhasMensagens = () => {
  const { profileDetail, fetchProfile } = useContext(ShopContext);
  const userId = profileDetail?._id;
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeName, setActiveName] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // conectar socket
  useEffect(() => {
    socketRef.current = io(url);

    socketRef.current.on("receiveMessage", (data) => {
      if (data.sender === activeChat || data.chat === activeChat) {
        setMessages((prev) => [
          ...prev,
          {
            content: data.content,
            sender: data.sender,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      fetchConversations();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url, activeChat]);

  // entrar na sala do usuario
  useEffect(() => {
    if (userId && socketRef.current) {
      socketRef.current.emit("join", userId);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${url}/api/chat/clientConversations`, {
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
        },
      });
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (err) {
      console.error("Erro ao buscar conversas:", err);
    }
  };

  const openConversation = async (sellerId, sellerName, sellerImage) => {
    setActiveChat(sellerId);
    setActiveName(sellerName);
    setActiveImage(sellerImage);
    setMobileShowChat(true);

    try {
      const res = await fetch(
        `${url}/api/chat/clientMessages?sellerId=${sellerId}`,
        {
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
        // atualizar conversas para zerar badge de nao lidas
        fetchConversations();
      }
    } catch (err) {
      console.error("Erro ao buscar mensagens:", err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat || !userId) return;

    const msgData = {
      content: newMessage,
      sender: userId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, msgData]);

    if (socketRef.current) {
      socketRef.current.emit("sendMessage", {
        sender: userId,
        receiver: activeChat,
        content: newMessage,
        chat: activeChat,
      });
    }

    setNewMessage("");

    try {
      await fetch(`${url}/api/chat/saveMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: userId,
          content: msgData.content,
          chat: activeChat,
        }),
      });
    } catch (err) {
      console.error("Erro ao salvar mensagem:", err);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);

    if (d.toDateString() === hoje.toDateString()) return "Hoje";
    if (d.toDateString() === ontem.toDateString()) return "Ontem";
    return d.toLocaleDateString("pt-BR");
  };

  const getMessagesWithDividers = () => {
    const result = [];
    let lastDate = "";

    for (const msg of messages) {
      const msgDate = new Date(msg.createdAt).toDateString();
      if (msgDate !== lastDate) {
        result.push({ type: "divider", date: formatDate(msg.createdAt) });
        lastDate = msgDate;
      }
      result.push({ type: "message", ...msg });
    }
    return result;
  };

  const filteredConversations = conversations.filter((c) =>
    c.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="clientmsg-wrapper">
      {/* SIDEBAR */}
      <div className={`clientmsg-sidebar ${mobileShowChat ? "hidden-mobile" : ""}`}>
        <div className="clientmsg-sidebar-header">
          <h2>Minhas Mensagens</h2>
          <p>
            {conversations.length} conversa{conversations.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="clientmsg-search">
          <input
            type="text"
            placeholder="Buscar vendedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="clientmsg-conversations">
          {filteredConversations.length === 0 ? (
            <div className="clientmsg-empty">
              <i className="fa-solid fa-comments"></i>
              <p>Nenhuma conversa ainda</p>
              <p style={{ fontSize: "12px" }}>
                Inicie uma conversa pela pagina do produto
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.sellerId}
                className={`clientmsg-item ${activeChat === conv.sellerId ? "active" : ""}`}
                onClick={() =>
                  openConversation(conv.sellerId, conv.sellerName, conv.sellerImage)
                }
              >
                {conv.sellerImage ? (
                  <img src={conv.sellerImage} alt={conv.sellerName} className="clientmsg-avatar" />
                ) : (
                  <div className="clientmsg-avatar-placeholder">
                    <i className="fa-solid fa-store"></i>
                  </div>
                )}

                <div className="clientmsg-info">
                  <div className="clientmsg-top">
                    <p className="clientmsg-name">{conv.sellerName}</p>
                    <div className="clientmsg-right">
                      {conv.messageCount > 0 && (
                        <div className="clientmsg-badge">{conv.messageCount}</div>
                      )}
                      <span className="clientmsg-time">{formatTime(conv.lastMessageTime)}</span>
                    </div>
                  </div>
                  <p className="clientmsg-preview">{conv.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className={`clientmsg-chat ${!mobileShowChat ? "hidden-mobile" : ""}`}>
        {!activeChat ? (
          <div className="clientmsg-no-chat">
            <i className="fa-solid fa-comments"></i>
            <h3>Minhas Mensagens</h3>
            <p>Selecione uma conversa para comecar</p>
          </div>
        ) : (
          <>
            <div className="clientmsg-chat-header">
              <button className="clientmsg-back" onClick={() => { setMobileShowChat(false); setActiveChat(null); }}>
                <i className="fa-solid fa-arrow-left"></i>
              </button>

              {activeImage ? (
                <img src={activeImage} alt={activeName} className="clientmsg-avatar" />
              ) : (
                <div className="clientmsg-avatar-placeholder">
                  <i className="fa-solid fa-store"></i>
                </div>
              )}

              <div>
                <p className="clientmsg-header-name">{activeName}</p>
                <p className="clientmsg-header-status">Vendedor</p>
              </div>
            </div>

            <div className="clientmsg-messages">
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", color: "#667781", marginTop: "40px" }}>
                  <p>Nenhuma mensagem ainda</p>
                </div>
              ) : (
                getMessagesWithDividers().map((item, i) => {
                  if (item.type === "divider") {
                    return (
                      <div key={`div-${i}`} className="clientmsg-date-divider">
                        <span>{item.date}</span>
                      </div>
                    );
                  }

                  const isSent = String(item.sender) === String(userId);
                  return (
                    <div
                      key={i}
                      className={`clientmsg-msg ${isSent ? "clientmsg-msg-sent" : "clientmsg-msg-received"}`}
                    >
                      <p>{item.content}</p>
                      <div className="clientmsg-msg-time">{formatTime(item.createdAt)}</div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="clientmsg-input">
              <input
                type="text"
                placeholder="Digite uma mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MinhasMensagens;
