import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationService } from '../services/notificationService';
import { DemoRoleSwitcher } from './common/DemoRoleSwitcher';

interface AuthorityLayoutProps {
  children: React.ReactNode;
}

const mainNavItems = [
  { icon: 'dashboard', label: 'Dashboard', to: '/authority/dashboard' },
  { icon: 'assignment_late', label: 'Grievance Queue', to: '/authority/queue' },
  { icon: 'query_stats', label: 'Analytics', to: '/authority/analytics' },
  { icon: 'settings', label: 'Settings', to: '/authority/settings' },
];

const AuthorityLayout: React.FC<AuthorityLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    setUnreadCount(NotificationService.getUnreadCount('authority', user?.id));
  }, [location.pathname, user?.id]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0e14] text-on-surface antialiased">
      {/* Compact SideNavBar (Desktop) */}
      <nav className="fixed left-0 top-0 h-full w-20 hidden md:flex flex-col items-center justify-between py-6 z-40 bg-[#10131a] border-r border-[#262626]">
        <div className="flex flex-col items-center w-full gap-8">
          <Link
            to="/authority/dashboard"
            className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30 hover:scale-105 transition-transform"
            title="GrievAI Authority"
          >
            <span className="text-white font-bold font-mono text-lg">G</span>
          </Link>

          <div className="flex flex-col items-center gap-3 w-full px-2">
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== '/authority/dashboard' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  title={item.label}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                    isActive
                      ? 'text-purple-400 bg-purple-600/20 border border-purple-500/30 shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-[#171717]'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {item.icon}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full px-2">
          {/* Notifications */}
          <Link
            to="/authority/notifications"
            className="relative w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#171717] rounded-xl transition-colors"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse"></span>
            )}
          </Link>

          {/* Profile */}
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500/40 hover:border-purple-400 transition-colors"
            title={user?.name || 'Authority Profile'}
          >
            <img alt="" src={user?.avatar} className="w-full h-full object-cover" />
          </button>
        </div>
      </nav>

      {/* Profile Popup Menu */}
      {showProfileMenu && (
        <div className="fixed left-20 bottom-6 w-56 bg-[#171717] border border-[#2D3139] rounded-xl shadow-2xl p-2 z-50 animate-slide-in">
          <div className="px-3 py-2 border-b border-[#262626] mb-1">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-purple-400 font-mono truncate">{user?.department}</p>
          </div>
          <Link
            to="/authority/settings"
            onClick={() => setShowProfileMenu(false)}
            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-[#262626] rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-sm">settings</span>
            Authority Settings
          </Link>
          <button
            onClick={() => {
              setShowProfileMenu(false);
              logout();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1 border-t border-[#262626]"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
          </button>
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="relative flex flex-col w-64 h-full bg-[#10131a] border-r border-[#262626] p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-white">G</div>
                <div>
                  <h2 className="text-sm font-bold text-white">Authority Portal</h2>
                  <p className="text-[10px] text-gray-400 font-mono">Case Intelligence</p>
                </div>
              </div>
              <button className="text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1 w-full">
              {mainNavItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                    location.pathname === item.to ? 'text-purple-400 bg-purple-600/20 font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="ml-0 md:ml-20 flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* TopAppBar */}
        <header className="h-16 flex justify-between items-center px-6 bg-[#0b0e14]/90 backdrop-blur-xl border-b border-[#262626] z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(true)}>
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                <span>Authority Review Command</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  {user?.department || 'Faculty Panel'}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/authority/queue"
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">list_alt</span>
              View Live Queue
            </Link>
          </div>
        </header>

        {/* Content Scroll Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 max-w-7xl w-full mx-auto pb-24">
          {children}
        </main>
      </div>

      <DemoRoleSwitcher />
    </div>
  );
};

export default AuthorityLayout;
