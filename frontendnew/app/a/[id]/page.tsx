"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { withCredentials: true });

type User = {
  id: string;
  username: string;
};

type Message = {
  id: string;
  sender: string;
  receiver: string;
  time: string;
  message: string;
  status: string;
};

const Home = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`http://${process.env.NEXT_PUBLIC_HOST_NAME}:${process.env.NEXT_PUBLIC_PORT}/api/r/get-current-user`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) console.log("Failed to fetch user");

        const data = await res.json();
        setCurrentUser(data.CurrentUser.id);
        socket.emit("user", { id: data.CurrentUser.id });
      } catch (error) {
        console.log("Error fetching user:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !currentUser) return;
      setLoadingMessages(true);

      try {
        const res = await fetch(`http://${process.env.NEXT_PUBLIC_HOST_NAME}:${process.env.NEXT_PUBLIC_PORT}/api/r/getConversation`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender: currentUser, receiver: id }),
        });

        if (!res.ok) console.log("Failed to fetch conversation");

        const data = await res.json();
        setMessages(data.conversation || []);
      } catch (error) {
        console.log("Error fetching messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    const fetchTargetUser = async () => {
      if (!id) return;

      try {
        const res = await fetch(`http://${process.env.NEXT_PUBLIC_HOST_NAME}:${process.env.NEXT_PUBLIC_PORT}/api/r/get-user`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) console.log("Failed to fetch target user");

        const data = await res.json();
        setTargetUser(data.User || null);
      } catch (error) {
        console.log("Error fetching target user:", error);
      }
    };

    if (id && currentUser) {
      fetchTargetUser();
      fetchData();
    }
  }, [id, currentUser]);

  useEffect(() => {
    if (socket) {
      socket.on("SendMessage", (data) => {
        setMessages((prev) => [...prev, data.NewMessagee]);
      });
    }

    return () => {
      socket.off("SendMessage");
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      sender: currentUser,
      receiver: Array.isArray(id) ? id[0] : id || "",
      message: input,
      status: "Delivered",
      time: new Date().toISOString(),
    };

    socket.emit("Message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  if (!id && !currentUser) {
    return null;
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-100">
      <div className="h-16 w-full flex items-center justify-between px-4 bg-white border-b shadow-md">
        <h2 className="text-lg font-semibold">
          {targetUser ? targetUser.username : ""}
        </h2>
        <div className="w-6 h-6 cursor-pointer">⚙️</div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
        {loadingUser || loadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : messages.length > 0 ? (
          <>
            {messages.map((msg) =>
              msg && msg.sender ? (
                <div
                  key={msg.id}
                  className={`chat ${msg.sender === currentUser ? "chat-end" : "chat-start"}`}
                >
                  <div className="chat-header">
                    <time className="text-xs opacity-50 ml-2">
                      {new Date(msg.time).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </time>
                  </div>
                  <div className="chat-bubble">{msg.message}</div>
                  <div className="chat-footer opacity-50">{msg.status}</div>
                </div>
              ) : null
            )}
            <div ref={messagesEndRef}></div>
          </>
        ) : (
          <div className="text-center text-gray-500">No messages available</div>
        )}
      </div>
      <div className="h-16 flex items-center px-4 border-t bg-white">
        <input
          type="text"
          className="flex-1 p-2 border rounded-md focus:outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-2 bg-blue-500 text-white p-2 rounded-md"
          onClick={sendMessage}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default Home;
