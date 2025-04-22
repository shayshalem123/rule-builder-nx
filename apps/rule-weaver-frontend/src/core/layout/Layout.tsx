import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 hardware-accelerated">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-[2000px]">
        <Outlet />
      </main>
      <footer className="border-t py-4 text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          Rule Builder - {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
