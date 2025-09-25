"use client";
import { BarChart4, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const sidebarRoutes = [
  { icon: <MonitorPlay />, label: "Courses", path: "/instructor/courses" },
  {
    icon: <BarChart4 />,
    label: "Performance",
    path: "/instructor/performance",
  },
];
const Sidebar = () => {
  const path = usePathname();
  console.log(path);

  return (
    <div className="p-2 mt-5">
      {sidebarRoutes.map((sidebarRoute, _idx) => (
        <Link
          key={_idx}
          href={sidebarRoute.path}
          className={`
        flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 
        transition-colors duration-200
        ${
          path === sidebarRoute.path
            ? "bg-indigo-600 text-white font-medium shadow-sm"
            : "hover:bg-gray-100 hover:text-indigo-600"
        }
      `}
        >
          <span className="text-lg">{sidebarRoute.icon}</span>
          <span className="text-sm">{sidebarRoute.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
