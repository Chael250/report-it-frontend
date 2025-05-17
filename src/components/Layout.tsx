
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, FileText, Building } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  
  const isLinkActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary py-3 px-4 sm:px-6 border-b">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-white font-bold text-lg md:text-xl">Report-It Express</Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/" active={location.pathname === '/'}>
              <Home size={18} className="mr-1.5" />
              Home
            </NavLink>
            <NavLink to="/complaints" active={isLinkActive('/complaints')}>
              <FileText size={18} className="mr-1.5" />
              Complaints
            </NavLink>
            <NavLink to="/agencies" active={isLinkActive('/agencies')}>
              <Building size={18} className="mr-1.5" /> 
              Agencies
            </NavLink>
          </nav>
          
          <nav className="md:hidden flex items-center space-x-4">
            <MobileNavLink to="/" active={location.pathname === '/'}>
              <Home size={20} />
            </MobileNavLink>
            <MobileNavLink to="/complaints" active={isLinkActive('/complaints')}>
              <FileText size={20} />
            </MobileNavLink>
            <MobileNavLink to="/agencies" active={isLinkActive('/agencies')}>
              <Building size={20} />
            </MobileNavLink>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6">
        <Outlet />
      </main>

      <footer className="bg-muted py-4 px-6 border-t">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>© 2025 Report-It Express. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const NavLink: React.FC<{
  to: string;
  active: boolean;
  children: React.ReactNode;
}> = ({ to, active, children }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center text-sm font-medium transition-colors",
      active
        ? "text-white"
        : "text-white/70 hover:text-white"
    )}
  >
    {children}
  </Link>
);

const MobileNavLink: React.FC<{
  to: string;
  active: boolean;
  children: React.ReactNode;
}> = ({ to, active, children }) => (
  <Link
    to={to}
    className={cn(
      "p-2 rounded-full",
      active
        ? "bg-white/20 text-white"
        : "text-white/70 hover:bg-white/10 hover:text-white"
    )}
  >
    {children}
  </Link>
);

export default Layout;
