"use client";
import TopnavAuth from "@/app/component/TopNavAuth";
import { ReactNode } from "react";

import Conversations from "@/app/component/Conversations";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen w-screen flex flex-col">
      <TopnavAuth />
      <div className="flex-1 flex h-full w-full border border-black">
        <Conversations />
        {children}
      </div>
    </div>
  );
}
