import Topbar from "@/components/Topbar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Topbar />
      {children}
    </div>
  );
};

export default layout;
