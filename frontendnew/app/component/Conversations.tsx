'use client'
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Users {
  email: string;
  id: string;
  password: string;
  socketId: string;
  username: string;
}

const Conversations = () => {
  const [allUsers, setAllUsers] = useState<Users[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/r/get-all-user", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) console.error("Failed to fetch users");

        const data = await res.json();
        console.log(data);

        setAllUsers(data.Users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (userId: string) => {
    router.push(`/a/${userId}`);
  };

  return (
    <div className="w-[30%] sm:w-[30%] md:w-[25%] lg:w-[20%] h-full border-r border-gray-300 bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Conversations</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-600 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <ul className="menu bg-base-100 w-full">
        {allUsers.length > 0 ? (
          allUsers.map((user) => (
            <li key={user.id}>
              <div
                className={`flex items-center gap-2 p-3 hover:bg-gray-100 rounded cursor-pointer ${
                  user.socketId ? "hover:bg-gray-200" : "cursor-default"
                }`}
                onClick={() => handleUserClick(user.id)}
              >
                <span className="font-medium">{user.username}</span>
                <span
                  className={`text-sm ${
                    user.socketId ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  {user.socketId ? " Online" : " Offline"}
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
