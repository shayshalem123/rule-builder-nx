import React from "react";
import { Link } from "react-router-dom";
import {
  Book,
  Database,
  FileJson,
  Code,
  Terminal,
  AlertTriangle,
  Keyboard,
} from "lucide-react";
import NavLink from "./NavLink";
import UserMenu from "./UserMenu";

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <div className="mr-4 flex">
            <Link to="/" className="flex items-center space-x-2">
              <Database className="h-6 w-6" />
              <span className="font-bold text-xl">Rule Builder</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
            <NavLink to="/rules" icon={<Book className="h-4 w-4" />}>
              Rules
            </NavLink>
            <NavLink to="/schemas" icon={<FileJson className="h-4 w-4" />}>
              Schemas
            </NavLink>
            <NavLink to="/monaco-demo" icon={<Code className="h-4 w-4" />}>
              Monaco Demo
            </NavLink>
          </nav>
        </div>
        <UserMenu />
      </div>
    </header>
  );
};

export default Navbar;
