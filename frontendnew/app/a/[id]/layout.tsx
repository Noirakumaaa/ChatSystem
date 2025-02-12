'use client'
import TopnavAuth from "@/app/component/TopNavAuth";
import Conversations from "@/app/component/Conversations";
import { ReactNode, useState, useEffect } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {


  return (
    <div className="h-screen w-screen">
      <TopnavAuth />
      <div className="h-[90%] w-full flex"> 
      <Conversations />
      {children}
      </div>

    </div>
  );
}
