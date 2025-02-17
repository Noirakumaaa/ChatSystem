"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store/index";
import { fetchUsers } from "@/lib/store/feature/users/userThunks";
import { RootState } from "@/lib/store/index";

const Conversations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { onlineUsers, allUsers, loading } = useSelector(
    (state: RootState) => state.users
  );
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("inbox");

  const router = useRouter();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleUserClick = (userId: string) => {
    router.push(`/a/${userId}`);
  };

  const handleSearchClick = () => {
    setSearchMode(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchBlur = () => {
    setSearchMode(false);
  };

  const filteredUsers = onlineUsers.filter((user) =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const renderUser = (user : any) => {
    const userStatus = onlineUsers.find((onlineUser) => onlineUser.socketId === user.socketId)?.status || "Offline"; // Check status from onlineUsers array

    return (
      <div
        key={user.socketId}
        className="flex justify-between items-center p-3 border-b border-gray-300 hover:bg-gray-100 cursor-pointer"
        onClick={() => handleUserClick(user.id)}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${userStatus === "Online" ? "bg-green-500" : "bg-black"}`}
          />
          <span className="text-sm">{user.username}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="w-4 h-4 text-green-500"
          >
            <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z"/>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="hidden lg:block xl:w-[24%] 2xl:w-[20%] 3xl:w-[20%] h-full border-r border-gray-300 bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex space-x-4">
          <div
            onClick={() => setActiveSection("online")}
            className={`cursor-pointer ${activeSection === "online" ? "text-black" : "text-gray-600"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-5 h-5"
              fill={activeSection === "online" ? "green" : "gray"}
            >
              <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z"/>
            </svg>
          </div>
          <div
            onClick={() => setActiveSection("inbox")}
            className={`cursor-pointer ${activeSection === "inbox" ? "text-black" : "text-gray-600"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-5 h-5"
              fill={activeSection === "inbox" ? "blue" : "gray"}
            >
              <path d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l96 0 0 80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416 448 416c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0z"/>
            </svg>
          </div>
        </div>
        {searchMode ? (
          <input
            type="text"
            className="w-full p-2 border rounded outline-none"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            onBlur={handleSearchBlur}
            autoFocus
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600 cursor-pointer"
            fill="black"
            viewBox="0 0 512 512"
            stroke="currentColor"
            onClick={handleSearchClick}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
            />
          </svg>
        )}
      </div>
      <ul className="menu bg-base-100 w-full h-full overflow-y-auto">
      {loading ? (
  <li className="flex justify-center items-center h-full">
    <span className="loading loading-spinner loading-md"></span>
  </li>
) : activeSection === "inbox" ? (
  allUsers.length > 0 ? (
    allUsers.map((user: any) => renderUser(user))
  ) : (
    <li className="text-center text-gray-500 p-4">No users found</li>
  )
) : activeSection === "online" ? (
  filteredUsers.length > 0 ? (
    filteredUsers.map((user) => renderUser(user))
  ) : (
    <li className="text-center text-gray-500 p-4">No online users</li>
  )
) : (
  <li className="text-center text-gray-500 p-4">No section selected</li>
)}


      </ul>
    </div>
  );
};

export default Conversations;
