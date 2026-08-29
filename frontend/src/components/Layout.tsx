import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationService } from '../services/notificationService';
import { DemoRoleSwitcher } from './common/DemoRoleSwitcher';

interface NavItem {
  icon: string;
  label: string;
  to: string;
}

interface LayoutProps {
  children: React.ReactNode;
  navItems?: NavItem[];
  userRoleLabel?: string;
  userName?: string;
}

const defaultStudentNavItems: NavItem[] = [
  { icon: 'dashboard', label: 'Dashboard', to: '/student/dashboard' },
  { icon: 'folder_managed', label: 'My Grievances', to: '/student/grievances' },
  { icon: 'notifications', label: 'Notifications', to: '/student/notifications' },
  { icon: 'person', label: 'Student Profile', to: '/student/profile' },
];

const Layout: React.FC<LayoutProps> = ({
  children,
  navItems = defaultStudentNavItems,
  userRoleLabel = 'Student Portal',
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    setUnreadCount(NotificationService.getUnreadCount('student', user?.id));
  }, [location.pathname, user?.id]);

  return (
    <div className="bg-[#0b0e14] text-on-surface font-body-md antialiased overflow-x-hidden min-h-screen flex flex-col">
      {/* SideNavBar (Desktop) */}
      <aside className="bg-[#10131a] text-primary h-screen w-64 fixed left-0 top-0 border-r border-[#262626] flex flex-col p-5 z-40 hidden md:flex">
        {/* Header Branding */}
        <Link to="/student/dashboard" className="mb-8 flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-tight">GrievAI</h1>
            <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">{userRoleLabel}</p>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/student/dashboard' && location.pathname.startsWith(item.to));
            const isNotifs = item.to.includes('notification');
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-[#171717]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </div>
                {isNotifs && unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold font-mono">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Submit Grievance Primary CTA Button */}
        <div className="pt-4 border-t border-[#262626] mt-auto">
          <Link
            to="/student/submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 active:scale-95"
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              add_circle
            </span>
            File New Grievance
          </Link>
        </div>

        {/* User Profile Footer */}
        {user && (
          <div className="mt-4 pt-3 border-t border-[#262626] flex items-center justify-between">
            <Link to="/student/profile" className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity">
              <img alt="" src={user.avatar} className="w-8 h-8 rounded-full object-cover border border-gray-700 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-gray-500 font-mono truncate">{user.studentId || user.email}</p>
              </div>
            </Link>
            <button onClick={logout} title="Logout" className="text-gray-500 hover:text-red-400 p-1 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="relative flex flex-col w-72 h-full bg-[#10131a] border-r border-[#262626] p-5 overflow-y-auto animate-slide-in">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">account_balance</span>
                </div>
                <div>
                  <h1 className="text-base font-bold text-white">GrievAI</h1>
                  <p className="text-[10px] text-gray-400 uppercase font-mono">{userRoleLabel}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl ${
                    location.pathname === item.to ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </div>
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-[#262626] mt-auto">
              <Link
                to="/student/submit"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-blue-600 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                File New Grievance
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* TopAppBar */}
      <header className="bg-[#0b0e14]/90 backdrop-blur-xl border-b border-[#262626] fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] h-16 flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-3">
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(true)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-400">
            <span className="text-gray-200 font-semibold">Institutional Portal</span>
            <span>/</span>
            <span className="text-blue-400 uppercase">{userRoleLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications Icon */}
          <Link
            to="/student/notifications"
            className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#171717] transition-colors"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            )}
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#171717] transition-colors"
            >
              <img alt="" src={user?.avatar} className="w-8 h-8 rounded-full object-cover border border-gray-700" />
              <span className="material-symbols-outlined text-sm text-gray-400">expand_more</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-[#171717] border border-[#2D3139] rounded-xl shadow-2xl p-2 z-50 animate-slide-in">
                <div className="px-3 py-2 border-b border-[#262626] mb-1">
                  <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono truncate">{user?.email}</p>
                </div>
                <Link
                  to="/student/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-[#262626] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">person</span>
                  Profile & Settings
                </Link>
                <Link
                  to="/student/grievances"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-[#262626] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">folder</span>
                  My Grievances
                </Link>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1 border-t border-[#262626]"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="pt-20 pb-20 px-4 md:px-8 md:ml-64 flex-1 flex flex-col gap-6 max-w-7xl w-full mx-auto">
        {children}
      </main>

      {/* Floating Demo Role Switcher */}
      <DemoRoleSwitcher />
    </div>
  );
};

export default Layout;
