import Topbar from "@/components/Topbar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-50">
        <Topbar />
      </header>
      {children}
    </div>
  );
};

export default layout;
