'use client'
import TopnavAuth from "@/app/component/TopNavAuth";
import { ReactNode, useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { withCredentials: true });

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isLoading, setLoading] = useState(true);

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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };

    if (socket) {
      fetchData();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <TopnavAuth />
      {children}
    </>
  );
}
