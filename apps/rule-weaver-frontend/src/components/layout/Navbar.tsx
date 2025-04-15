
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Book, Database } from 'lucide-react';

const NavLink = ({ to, children, icon }: { to: string; children: React.ReactNode; icon: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={cn(
        'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
      )}
    >
      {icon}
      <span className="ml-3">{children}</span>
    </Link>
  );
};

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center px-4">
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
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
