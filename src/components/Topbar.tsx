"use client";
import React from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import {  useAuth, UserButton } from "@clerk/nextjs";

const topBarRoutes = [
  { label: "Instructor", path: "/instructor/courses" },
  { label: "Learning", path: "/learning" },
];

const Topbar = () => {
  const { isSignedIn } = useAuth();
  
  return (
    <div className="flex justify-between items-center p-2 mx-4">
      <Link className="cursor-pointer" href={"/"}>
        <p className="font-extrabold text-2xl">Coursify</p>
      </Link>
      <div className="flex gap-2 justify-between items-center ">
        <Input className="w-2xl" placeholder="Search For Courses..." />
        <Button className="cursor-pointer">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className=" flex items-center justify-center gap-4 ">
        {topBarRoutes.map((route, _idx) => (
          <Link
            className="text-md hover:underline cursor-pointer hover:text-gray-500 transition-colors duration-300 ease-in-out"
            key={_idx}
            href={route.path}
          >
            {route.label}
          </Link>
        ))}
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/sign-in" />
        ) : (
          <Link  href={"/sign-in"}>
            <Button className="cursor-pointer" >Sign In</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Topbar;
