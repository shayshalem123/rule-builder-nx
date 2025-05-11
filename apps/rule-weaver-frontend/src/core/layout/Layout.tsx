import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-primary hardware-accelerated">
      <Navbar />
      <main className="flex-1 mx-auto w-[90%]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
