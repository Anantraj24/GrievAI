import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationService } from '../services/notificationService';
import { DemoRoleSwitcher } from './common/DemoRoleSwitcher';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  { icon: 'dashboard', label: 'Executive Dashboard', to: '/admin/dashboard' },
  { icon: 'analytics', label: 'Analytics & Trends', to: '/admin/analytics' },
  { icon: 'insights', label: 'System Insights', to: '/admin/insights' },
  { icon: 'account_tree', label: 'Institutional Issues', to: '/admin/issues' },
  { icon: 'corporate_fare', label: 'Departments', to: '/admin/departments' },
  { icon: 'category', label: 'Categories & Routing', to: '/admin/categories' },
  { icon: 'group', label: 'User Directory', to: '/admin/users' },
  { icon: 'timer', label: 'SLA Escalations', to: '/admin/sla' },
  { icon: 'policy', label: 'Audit Trail Logs', to: '/admin/audit-logs' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(NotificationService.getUnreadCount('admin', user?.id));
  }, [location.pathname, user?.id]);

  const isActive = (path: string) => location.pathname === path || (path !== '/admin/dashboard' && location.pathname.startsWith(path));

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#0b0e14] text-on-background font-sans">
      {/* TopAppBar */}
      <header className="flex items-center justify-between border-b border-[#262626] px-6 py-3 bg-[#10131a]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4 lg:gap-8">
          <button
            className="lg:hidden text-gray-400 p-1 rounded-lg hover:bg-[#171717] transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Link to="/admin/dashboard" className="flex items-center gap-3 text-amber-400">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield
              </span>
            </div>
            <div>
              <h2 className="text-white text-base font-bold leading-tight tracking-tight">GrievAI Admin</h2>
              <p className="text-[10px] text-gray-400 font-mono uppercase">Ombudsman Control Center</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AI Classification Engine Active (24ms)</span>
          </div>

          <div className="flex items-center gap-3 border-l border-[#262626] pl-4">
            <img alt="" src={user?.avatar} className="w-8 h-8 rounded-full object-cover border border-amber-500/40" />
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-white leading-tight">{user?.name}</p>
              <p className="text-[10px] text-gray-400 font-mono">System Administrator</p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-[#171717] transition-colors ml-1"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="relative flex flex-col w-72 h-full bg-[#10131a] border-r border-[#262626] p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-amber-400">
                <span className="material-symbols-outlined text-xl">shield</span>
                <h2 className="text-white text-base font-bold">Admin Center</h2>
              </div>
              <button className="text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1 w-full">
              {adminNavItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-colors ${
                    isActive(item.to)
                      ? 'bg-amber-600/20 text-amber-300 font-semibold border border-amber-500/30'
                      : 'hover:bg-[#171717] text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto p-4 lg:p-8 gap-8 pb-24">
        {/* Left Navigation Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 gap-6 shrink-0">
          <div className="flex flex-col gap-1 bg-[#10131a] p-3 rounded-2xl border border-[#262626] shadow-xl">
            {adminNavItems.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    active
                      ? 'bg-amber-600/20 text-amber-300 font-semibold border border-amber-500/30 shadow-sm'
                      : 'hover:bg-[#171717] text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* System Health Widget */}
          <div className="bg-[#10131a] p-4 rounded-2xl border border-[#262626] flex flex-col gap-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">System Integrity</h4>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Autonomous Triage</span>
                <span className="text-emerald-400 font-bold font-mono">98.4% SLA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Active Nodes</span>
                <span className="text-white font-mono">6 Departments</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">NLP Latency</span>
                <span className="text-purple-400 font-mono">184ms</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Dynamic Main Body */}
        <main className="flex-1 flex flex-col gap-6 min-w-0">
          {children}
        </main>
      </div>

      <DemoRoleSwitcher />
    </div>
  );
};

export default AdminLayout;
