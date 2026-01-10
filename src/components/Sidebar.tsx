import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CalendarPlus, LayoutDashboard, LogOut, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside 
      className={`
        fixed left-0 top-0 h-full w-64 bg-sidebar flex flex-col z-50
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Logo Area */}
      <div className="p-4 sm:p-6 border-b border-sidebar-border flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-display font-bold text-sidebar-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
            <CalendarPlus className="w-5 h-5 text-primary-foreground" />
          </div>
          TaskFlow
        </h1>
        {/* Close button for mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="lg:hidden h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/tasks" onClick={handleNavClick}>
          <Button
            variant={isActive('/tasks') ? 'sidebar' : 'sidebar-ghost'}
            className="w-full justify-start gap-3"
          >
            <CalendarPlus className="w-5 h-5" />
            Add Task
          </Button>
        </Link>
        <Link to="/dashboard" onClick={handleNavClick}>
          <Button
            variant={isActive('/dashboard') ? 'sidebar' : 'sidebar-ghost'}
            className="w-full justify-start gap-3"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Button>
        </Link>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-sidebar-accent/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'User'} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-primary-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.displayName || 'User'}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <Button
          variant="sidebar-ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
