import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, Menu, LogOut, ShieldAlert } from 'lucide-react';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'TechCorp Shortlist announced! Check status.' },
    { id: 2, text: 'New Aptitude quiz added: Quantitative Aptitude.' },
    { id: 3, text: 'AI Mock Interview suggestions report compiled.' }
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between px-6 glass-panel border-b border-white/5 bg-slate-950/70">
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-slate-100 lg:hidden focus:outline-none">
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-display font-bold text-white shadow-lg shadow-indigo-500/20">P</div>
          <span className="hidden sm:inline font-display font-semibold text-lg bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">PlacementPortal</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user?.role === 'admin' && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <ShieldAlert className="h-3 w-3" />
            <span>Admin Console</span>
          </div>
        )}
        <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all">
          {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
        </button>
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-slate-950"></span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-xl glass-panel p-2 shadow-2xl border border-white/10 bg-slate-950/95 animate-in fade-in-50 slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-white/5"><span className="font-display font-semibold text-sm">Notifications</span></div>
              <div className="flex flex-col py-1">
                {notifications.map(n => (
                  <div key={n.id} className="px-4 py-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer text-xs border-b border-white/5 last:border-0">
                    <p className="text-slate-200">{n.text}</p>
                    <span className="text-[10px] text-slate-500">Just now</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-200">{user?.name}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">{user?.role}</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 font-display font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <button onClick={logout} className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
