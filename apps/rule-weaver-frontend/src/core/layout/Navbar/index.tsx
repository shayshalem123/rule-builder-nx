import React from "react";
import { Link } from "react-router-dom";
import {
  Book,
  Database,
  FileJson,
  Code,
  Palette,
  LayoutGrid,
  Settings,
} from "lucide-react";
import NavLink from "./NavLink";
import UserMenu from "./UserMenu";
import { ThemeToggle } from "@/shared/components/ThemeToggle";

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 border-b bg-background-secondary shadow-consistent hardware-accelerated px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4 flex">
            <Link to="/rules" className="flex items-center space-x-2">
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
            <NavLink to="/categories" icon={<Settings className="h-4 w-4" />}>
              Configuration
            </NavLink>
            <NavLink to="/json-tools" icon={<Code className="h-4 w-4" />}>
              JSON Tools
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
