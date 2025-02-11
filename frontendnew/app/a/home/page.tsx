"use client";
import React, { useEffect } from "react";
import { io } from "socket.io-client";
import Topnav from "@/app/component/Topnav";

const socket = io("http://localhost:3000", { withCredentials: true });

const Home = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/r/get-current-user", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        console.log("Fetched User:", data.CurrentUser);

        socket.emit("user", { id: data.CurrentUser });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    if(socket) {
      fetchData();
    }

  }, [socket]); // ✅ Runs once on mount (no need for socket dependency)

  return (
    <div className="min-h-screen w-screen flex flex-col overflow-y-auto">
      <Topnav />
      <div className="mt-16 flex justify-center items-center p-4">
        <div className="border border-black w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] min-h-[30%] p-6 bg-gray-100">
          <h2 className="text-xl font-bold text-center mb-4">Welcome to Home</h2>
          <p className="text-center">You are now logged in!</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
