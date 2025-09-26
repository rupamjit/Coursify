"use client";
import React from "react";
import Sidebar from "../../../components/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-screen flex bg-gray-50">
      <aside className="w-64 bg-white shadow-lg border-r flex flex-col">
        <Sidebar />
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
};

export default Layout;
