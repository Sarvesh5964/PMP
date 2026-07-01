import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FileUser, Code, CheckSquare, MessageSquareCode,
  Briefcase, Users, Database, Layers, Sparkles
} from 'lucide-react';

const Sidebar = ({ sidebarOpen }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const menu = isAdmin ? [
    { name: 'Admin Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Manage Students', path: '/admin/students', icon: Users },
    { name: 'Manage Drives', path: '/admin/drives', icon: Briefcase },
    { name: 'Manage Questions', path: '/admin/questions', icon: Database },
    { name: 'Manage Applications', path: '/admin/applications', icon: Layers }
  ] : [
    { name: 'Readiness Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Resume & Profile', path: '/resume', icon: FileUser },
    { name: 'Coding Practice', path: '/coding', icon: Code },
    { name: 'Aptitude Tests', path: '/aptitude', icon: CheckSquare },
    { name: 'Mock Interview', path: '/interview', icon: MessageSquareCode },
    { name: 'Placement Drives', path: '/drives', icon: Briefcase }
  ];

  return (
    <aside className={`fixed top-16 bottom-0 left-0 z-30 w-64 glass-panel border-r border-white/5 bg-slate-950/80 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-full flex-col justify-between py-6 px-4">
        <nav className="space-y-1.5">
          <div className="px-3 mb-4 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Main Menu</div>
          {menu.map(item => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-slate-100 border-l-2 border-indigo-500 shadow-md shadow-indigo-500/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        {!isAdmin && (
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-indigo-950/40 to-purple-950/40 border border-indigo-500/10 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold font-display">AI Coach Ready</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">Upload your resume on the profile page to get score feedback and tailored job matching!</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
