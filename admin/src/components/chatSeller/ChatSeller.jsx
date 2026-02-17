import { useContext, useEffect, useState, useRef } from "react";
import "./ChatSeller.css";
import { AdminContext } from "../../context/AdminContext";
import { io } from "socket.io-client";

const ChatSeller = () => {
  const { profileDetail, fetchProfile, url } = useContext(AdminContext);
  const sellerId = profileDetail?.id || localStorage.getItem("seller-id");

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // clientId selecionado
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
      // se a msg e para o vendedor, adicionar na conversa ativa
      if (data.chat === sellerId) {
        setMessages((prev) => [
          ...prev,
          {
            content: data.content,
            sender: data.sender,
            createdAt: new Date().toISOString(),
          },
        ]);

        // atualizar lista de conversas tambem
        fetchConversations();
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url, sellerId]);

  // entrar na sala do vendedor
  useEffect(() => {
    if (sellerId && socketRef.current) {
      socketRef.current.emit("join", sellerId);
    }
  }, [sellerId]);

  // buscar perfil do vendedor
  useEffect(() => {
    fetchProfile();
  }, []);

  // buscar conversas quando tiver sellerId
  useEffect(() => {
    if (sellerId) {
      fetchConversations();
    }
  }, [sellerId]);

  // scroll para baixo quando novas mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${url}/api/chat/sellerConversations`, {
        headers: {
          "auth-token-seller": localStorage.getItem("auth-token"),
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

  const openConversation = async (clientId, clientName, clientImage) => {
    setActiveChat(clientId);
    setActiveName(clientName);
    setActiveImage(clientImage);
    setMobileShowChat(true);

    try {
      const res = await fetch(
        `${url}/api/chat/sellerMessages?clientId=${clientId}`,
        {
          headers: {
            "auth-token-seller": localStorage.getItem("auth-token"),
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error("Erro ao buscar mensagens:", err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat || !sellerId) return;

    const msgData = {
      content: newMessage,
      sender: sellerId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, msgData]);

    // enviar via socket
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", {
        sender: sellerId,
        receiver: activeChat,
        content: newMessage,
        chat: sellerId,
      });
    }

    setNewMessage("");

    // salvar no banco
    try {
      await fetch(`${url}/api/chat/saveMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: sellerId,
          content: msgData.content,
          chat: sellerId,
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

  // agrupar mensagens por data
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

  // filtrar conversas pela busca
  const filteredConversations = conversations.filter((c) =>
    c.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chatseller-wrapper">
      {/* ====== SIDEBAR - Lista de conversas ====== */}
      <div className={`chatseller-sidebar ${mobileShowChat ? "hidden-mobile" : ""}`}>
        <div className="chatseller-sidebar-header">
          <h2>Conversas</h2>
          <p>{conversations.length} cliente{conversations.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="chatseller-search">
          <input
            type="text"
            placeholder="Buscar conversa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="chatseller-conversations">
          {filteredConversations.length === 0 ? (
            <div className="chatseller-empty-sidebar">
              <i className="fa-solid fa-comments"></i>
              <p>Nenhuma conversa ainda</p>
              <p style={{ fontSize: "12px" }}>
                Quando clientes enviarem mensagens, elas aparecerao aqui
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.clientId}
                className={`chatseller-conversation-item ${
                  activeChat === conv.clientId ? "active" : ""
                }`}
                onClick={() =>
                  openConversation(conv.clientId, conv.clientName, conv.clientImage)
                }
              >
                {conv.clientImage ? (
                  <img
                    src={conv.clientImage}
                    alt={conv.clientName}
                    className="chatseller-avatar"
                  />
                ) : (
                  <div className="chatseller-avatar-placeholder">
                    <i className="fa-solid fa-user"></i>
                  </div>
                )}

                <div className="chatseller-conversation-info">
                  <div className="chatseller-conversation-top">
                    <p className="chatseller-conversation-name">
                      {conv.clientName}
                    </p>
                    <span className="chatseller-conversation-time">
                      {formatTime(conv.lastMessageTime)}
                    </span>
                  </div>
                  <p className="chatseller-conversation-preview">
                    {conv.lastMessage}
                  </p>
                </div>

                {conv.messageCount > 0 && (
                  <div className="chatseller-badge">{conv.messageCount}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ====== AREA DO CHAT ====== */}
      <div className={`chatseller-chat-area ${!mobileShowChat ? "hidden-mobile" : ""}`}>
        {!activeChat ? (
          <div className="chatseller-no-chat">
            <i className="fa-solid fa-comments"></i>
            <h3>Chat do Vendedor</h3>
            <p>Selecione uma conversa para comecar</p>
          </div>
        ) : (
          <>
            {/* Header do chat */}
            <div className="chatseller-chat-header">
              <button
                className="chatseller-chat-back"
                onClick={() => {
                  setMobileShowChat(false);
                  setActiveChat(null);
                }}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>

              {activeImage ? (
                <img
                  src={activeImage}
                  alt={activeName}
                  className="chatseller-avatar"
                />
              ) : (
                <div className="chatseller-avatar-placeholder">
                  <i className="fa-solid fa-user"></i>
                </div>
              )}

              <div>
                <p className="chatseller-chat-header-name">{activeName}</p>
                <p className="chatseller-chat-header-status">Cliente</p>
              </div>
            </div>

            {/* Mensagens */}
            <div className="chatseller-messages">
              {messages.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#667781",
                    marginTop: "40px",
                  }}
                >
                  <p>Nenhuma mensagem ainda</p>
                </div>
              ) : (
                getMessagesWithDividers().map((item, i) => {
                  if (item.type === "divider") {
                    return (
                      <div key={`div-${i}`} className="chatseller-date-divider">
                        <span>{item.date}</span>
                      </div>
                    );
                  }

                  const isSent = String(item.sender) === String(sellerId);
                  return (
                    <div
                      key={i}
                      className={`chatseller-msg ${
                        isSent ? "chatseller-msg-sent" : "chatseller-msg-received"
                      }`}
                    >
                      <p>{item.content}</p>
                      <div className="chatseller-msg-time">
                        {formatTime(item.createdAt)}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensagem */}
            <div className="chatseller-input-area">
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

export default ChatSeller;
