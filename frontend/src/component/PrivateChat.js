import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate, useParams, Link } from "react-router-dom";

const socket = io("http://13.213.46.53:5555");

const ChatComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [targetUser, setTargetUser] = useState(null);
  const [onlineCount, setOnlineCount] = useState([]);
  const [userLocalData] = useState({
    username: localStorage.getItem("username"),
    socketId: localStorage.getItem("socketId"),
    userId: localStorage.getItem("userId"),
  });
  const [showOnlineUsers, setShowOnlineUsers] = useState(true); 

  useEffect(() => {
    if (!userLocalData.username) {
      navigate("/login");
    }
  }, [userLocalData, navigate]);

  useEffect(() => {
    if (socket) {
      console.log("userlocaldata", userLocalData);
      socket.emit("User", { userLocalData });
      socket.on("login", (data) => {
        setOnlineCount((prev) => [...prev, data.socketId]);
      });
      console.log("connected");
    }
  }, [userLocalData]);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const res = await fetch("http://13.213.46.53:5555/api/users/allUser");
        const data = await res.json();
        console.log("All User : ", data);
        const filteredUsers = data.filter(
          (user) => user._id !== userLocalData.userId
        );
        setOnlineUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching online users:", error);
      }
    };
    fetchOnlineUsers();
  }, [onlineCount, userLocalData]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://13.213.46.53:5555/api/users/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log("TARGET FETCH : ", data);
        setTargetUser(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (targetUser) {
        try {
          const res = await fetch(
            "http://13.213.46.53:5555/api/conversation/getConvo",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                sender: userLocalData.userId,
                receiver: targetUser._id,
              }),
            }
          );

          console.log("User:", userLocalData.userId);
          console.log("Receiver:", targetUser._id);

          const data = await res.json();
          console.log("Message:", data);

          setMessages(data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();
  }, [targetUser]);

  useEffect(() => {
    if (socket) {
      socket.on("PrivateMessage", (data) => {
        console.log(data);
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: "Friend", message: data.message },
        ]);
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
          receiver: data.receiver,
        },
      ]);
    };

    socket.off("PrivateMessage");
    socket.on("PrivateMessage", handlePrivateMessage);

    return () => {
      socket.off("PrivateMessage", handlePrivateMessage);
    };
  }, [userLocalData.username]);

  const sendMessage = () => {
    if (newMessage.trim() !== "" && userLocalData.username && socket) {
      setMessages([
        ...messages,
        {
          user: "User",
          sender: userLocalData.userId,
          message: newMessage,
          receiver: id,
        },
      ]);
      socket.emit("Message", {
        message: newMessage,
        sender: userLocalData.userId,
        receiver: id,
      });
      setNewMessage("");
    }
  };

  const toggleOnlineUsers = () => {
    setShowOnlineUsers((prev) => !prev);
  };
  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/login")
  };

  return (
    <div className="chat-container">
      {/* Online Users Section */}
      <div
        className={`users-container ${showOnlineUsers ? "visible" : "hidden"}`}
      >
        <h3 className="user-list-header">Online Users</h3>
        <ul className="user-list">
          {onlineUsers
            .slice()
            .sort((a, b) => (b.status === "Online") - (a.status === "Online"))
            .map((user, index) => (
              <li key={index} className="user-item">
                <Link to={`/chat/${user._id}`} className="user-link">
                  {user.username} {user.status === "Online" ? "🟩" : "⬛"}
                </Link>
              </li>
            ))}
        </ul>
        <div
          style={{ display: "flex", flexDirection: "column", height: "auto" }}
        >
          <button onClick={logout} style={{ marginTop: "auto" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Chat Main Section */}
      <div className="chat-main-container">
        {/* Top Navbar with Toggle Button */}
        <div className="top-nav">
          <button className="toggle-button" onClick={toggleOnlineUsers}>
            {showOnlineUsers ? "Hide Online Users" : "Show Online Users"}
          </button>
          <h3 className="chat-header">
            {targetUser ? targetUser.username : "Chat"}
          </h3>
        </div>

        {/* Messages Container */}
        <div className="messages-container">
          {messages.map((msg, index) => {
            const isUserMessage = msg.sender === userLocalData.userId;
            return (
              <div
                key={index}
                className={
                  isUserMessage ? "user-message" : "another-user-message"
                }
              >
                <span>{isUserMessage ? "You" : "Friend"}:</span>
                <span>{msg.message}</span>
              </div>
            );
          })}
        </div>

        {/* Input Container */}
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={handleMessageChange}
            className="input"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="send-button"
            disabled={id === "default"}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
