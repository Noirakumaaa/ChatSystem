import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate, useParams, Link } from "react-router-dom";



const socket = io("http://localhost:5000");

const ChatComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userLocalData] = useState({
    username: localStorage.getItem("username"),
    socketId: localStorage.getItem("socketId"),
    userId: localStorage.getItem("userId"),
  });



  useEffect(() => {
    if (!userLocalData.username) {
      navigate("/login");
    }
  }, [userLocalData, navigate]);




  useEffect(() => {
    if (socket) {
      console.log("userlocaldata", userLocalData);
      socket.emit("User", { userLocalData});

      console.log('connected');
    }
  }, [userLocalData]);


  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/onlineUsers");
        const data = await res.json();

        const filteredUsers = data.data.filter( user => user.userId !== userLocalData.userId);
        setOnlineUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching online users:", error);
      }
    };
    fetchOnlineUsers();
  }, [onlineUsers,userLocalData]);

  useEffect(() => { 
    const fetchMessages = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/conversation/getMessages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ conversationId: id }),
        });
        const data = await res.json();
        setMessages(data.data.reverse());
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

  }, [id]); 

  useEffect(() => {
    if (socket) {
      socket.on("PrivateMessage", (data) => {
        console.log(data)
        setMessages((prevMessages) => [...prevMessages, { user: "Friend", message: data.message }]);
      });
  
      return () => {
        socket.off("PrivateMessage");
      };
    }
  }, []);

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };



useEffect(() => {
  if (!socket) return;

  const handlePrivateMessage = (data) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        user: data.from === userLocalData.username ? "User" : "Friend",
        message: data.message,
        receiver: data.receiver
      }
    ]);
  };

  socket.off("PrivateMessage"); // Remove any previous listener before adding a new one
  socket.on("PrivateMessage", handlePrivateMessage);

  return () => {
    socket.off("PrivateMessage", handlePrivateMessage);
  };
}, [userLocalData.username]);

  
  
  const sendMessage = () => {
    if (newMessage.trim() !== "" && userLocalData.username && socket) {
      setMessages([...messages, { user: "User", message: newMessage, receiver: id }]);
      socket.emit("Message", {
        message: newMessage,
        sender: userLocalData.socketId,
        receiver: id, 
      });
      setNewMessage("");
    }
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.usersContainer}>
        <h3 style={styles.userListHeader}>Online Users</h3>
        <ul style={styles.userList}>
          {onlineUsers.map((user, index) => (
            <li key={index} style={styles.userItem}>
              <Link to={`/chat/${user.userId}`} style={styles.userLink}>
                {user.username}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div style={styles.chatContainer}>
        <div style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={
                msg.user === "User"
                  ? styles.userMessage
                  : styles.anotherUserMessage
              }
            >
              <span>{msg.user}: </span>
              <span>{msg.message}</span>
            </div>
          ))}
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={newMessage}
            onChange={handleMessageChange}
            style={styles.input}
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            style={styles.sendButton}
            disabled={id === "default"}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f0f4f8",
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
  },
  usersContainer: {
    width: "260px",
    backgroundColor: "#1c3b6e",
    color: "#fff",
    padding: "20px",
    borderRight: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderTopLeftRadius: "10px",
    borderBottomLeftRadius: "10px",
  },
  userListHeader: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#fff",
    textAlign: "center",
  },
  userList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    width: "100%",
  },
  userItem: {
    padding: "12px 20px",
    textAlign: "center",
    borderBottom: "1px solid #ddd",
    cursor: "pointer",
    transition: "background-color 0.3s ease, color 0.3s ease",
    borderRadius: "6px",
    fontSize: "18px",
    fontWeight: "500",
  },
  chatContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderTopRightRadius: "10px",
    borderBottomRightRadius: "10px",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    border: "1px solid #ddd",
  },
  userMessage: {
    textAlign: "right",
    marginBottom: "10px",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "15px",
    maxWidth: "65%",
    marginLeft: "auto",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  anotherUserMessage: {
    textAlign: "left",
    marginBottom: "10px",
    padding: "12px",
    backgroundColor: "#e0e0e0",
    color: "#333",
    borderRadius: "15px",
    maxWidth: "65%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  inputContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },
  input: {
    width: "80%",
    padding: "14px",
    borderRadius: "20px",
    border: "1px solid #ddd",
    fontSize: "16px",
    backgroundColor: "#f1f1f1",
  },
  sendButton: {
    width: "15%",
    padding: "14px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },
  userLink: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    display: "block",
    padding: "12px",
    borderRadius: "6px",
    transition: "background-color 0.3s ease",
  },
  userLinkHover: {
    backgroundColor: "#3b65a3",
  },
};

export default ChatComponent;
