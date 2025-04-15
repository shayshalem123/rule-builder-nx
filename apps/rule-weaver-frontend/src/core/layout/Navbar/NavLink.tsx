import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/utils/cn";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, icon }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-gray-700 hover:bg-primary/10 hover:text-primary"
      )}
    >
      {icon}
      <span className="ml-3">{children}</span>
    </Link>
  );
};

export default NavLink;
