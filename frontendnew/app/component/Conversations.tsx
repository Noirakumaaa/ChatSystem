"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/store/index";
import { fetchUsers } from "@/lib/store/feature/users/userThunks";
import { RootState } from "@/lib/store/index";

const Conversations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { onlineUsers, loading } = useSelector((state: RootState) => state.users);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full sm:w-[50%] md:w-[40%] lg:w-[30%] xl:w-[25%] h-full border-r border-gray-300 bg-white">
      <div className="flex justify-between items-center p-4 border-b">
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
          <>
            <h2 className="text-lg font-semibold">Conversations</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={handleSearchClick}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </>
        )}
      </div>
      <ul className="menu bg-base-100 w-full h-full overflow-y-auto">
        {loading ? (
          <li className="flex justify-center items-center h-full">
            <span className="loading loading-spinner loading-md"></span>
          </li>
        ) : onlineUsers.length > 0 ? (
          onlineUsers.map((user) => (
            <li key={user.socketId}>
              <div
                className={`flex items-center gap-2 p-3 hover:bg-gray-100 rounded cursor-pointer ${
                  user.socketId ? "hover:bg-gray-200" : "cursor-default"
                }`}
                onClick={() => handleUserClick(user.socketId)}
              >
                <span className="font-medium">{user.username}</span>
                <span
                  className={`text-sm ${
                    user.socketId ? "text-green-500" : "text-gray-500"
                  }`}
                >
                    Online
                </span>
              </div>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500 p-4">No users found</li>
        )}
      </ul>
    </div>
  );
};

export default Conversations;
