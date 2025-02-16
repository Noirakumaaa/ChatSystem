"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Socket } from "socket.io-client";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { initializeSocket } from "@/lib/InitializedSocket";
import { fetchMessages } from "@/lib/store/feature/message/messageThunks";
import { fetchUsers } from "@/lib/store/feature/users/userThunks";
import { updateUser,updateOnlineUsers } from "@/lib/store/feature/users/userSlice";

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
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const { currentUser, allUsers, loading } = useSelector((state: RootState) => state.users);
  const messages = useSelector((state: RootState) => state.messages.messages);

  const [ConvoMessages, setConvoMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fetchedRef = useRef< string>(null);

  const targetUser = useMemo(() => allUsers.find(user => user.id === id), [id, allUsers]);

  //////////////////////////////////////////////
  //// Initialized the socket io for this component 
  /////////////////////////////////////////////
  useEffect(() => {
    const initSocket = initializeSocket();
    setSocket(initSocket);

    return () => {
      initSocket.disconnect();
    };
  }, []);

  //////////////////////////////////////////////
  //// Update the status of the user 
  /////////////////////////////////////////////
  useEffect(() => {
    if (!socket || !currentUser.id) return;
    console.log("LOGIN STATUS")
    socket.emit("user", { id: currentUser.id });
  }, [socket, currentUser]);

    //////////////////////////////////////////////
  //// update the status
  /////////////////////////////////////////////
  useEffect(() => {
    if (!socket) return;
    socket.on("userUpdate",(data)=>{
      console.log("User Update : ",data)
      console.log(data)
      dispatch(updateOnlineUsers(data))
    });
  }, [socket]);


  //////////////////////////////////////////////
  //// to scroll down to the latest message
  /////////////////////////////////////////////
  useEffect(() => {
    if (!currentUser.id || !targetUser?.id || !id) return;
    if (fetchedRef.current === id) return;
    fetchedRef.current = Array.isArray(id) ? id[0] : id;

    dispatch(fetchMessages({ currentUser: currentUser.id, targetUser: targetUser.id }));
  }, [id, dispatch, currentUser.id, targetUser?.id]);



  //////////////////////////////////////////////
  //// When recieved the messages from the redux 
  //// insert the messages to state
  /////////////////////////////////////////////
  useEffect(() => {
    setConvoMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on("SendMessage", (data) => {
      console.log("Received Message", data.newMessage)
      setConvoMessages((prev) => [...prev, data.newMessage]);
    });



    return () => {
      socket.off("SendMessage");
      console.log("All Message : ", ConvoMessages)
    };
  }, [socket]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [ConvoMessages]);
  

  const sendMessage = () => {
    if (!socket || !input.trim()) return;
    console.log("socket", socket)

    const newMessage: Message = {
      id: new Date().toISOString(),
      sender: currentUser.id,
      receiver: targetUser?.id || "",
      message: input,
      status: "Delivered",
      time: new Date().toISOString(),
    };
    console.log("Send Message : ", newMessage)

    socket.emit("Message", newMessage);
    setConvoMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  if (!id || !currentUser || !socket || loading) return null;

  return (
    <div className="h-full w-full flex flex-col bg-gray-100">
      <div className="h-16 w-full flex items-center justify-between px-4 bg-white border-b shadow-md">
        <h2 className="text-lg font-semibold">{targetUser?.username || "Unknown User"}</h2>
        <div className="w-6 h-6 cursor-pointer">⚙️</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
        {loading ? (
          <div className="flex justify-center items-center h-[90%]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : Array.isArray(ConvoMessages) && ConvoMessages.length > 0 ? (
          <>
            {ConvoMessages.map((msg) =>
              msg?.sender ? (
                <div
                  key={msg.id}
                  className={`chat ${msg.sender === currentUser.id ? "chat-end" : "chat-start"}`}
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
        <button className="ml-2 bg-blue-500 text-white p-2 rounded-md" onClick={sendMessage}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default Home;
