import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarPlus, LayoutDashboard, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar flex flex-col z-50">
      {/* Logo Area */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-display font-bold text-sidebar-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
            <CalendarPlus className="w-5 h-5 text-primary-foreground" />
          </div>
          TaskFlow
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/tasks">
          <Button
            variant={isActive('/tasks') ? 'sidebar' : 'sidebar-ghost'}
            className="w-full justify-start gap-3"
          >
            <CalendarPlus className="w-5 h-5" />
            Add Task
          </Button>
        </Link>
        <Link to="/dashboard">
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
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
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
