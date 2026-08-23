import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-on-background font-sans selection:bg-primary/30">
      {/* TopAppBar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-outline-variant px-4 lg:px-10 py-3 bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4 lg:gap-8">
          <button 
            className="lg:hidden text-on-surface-variant flex items-center justify-center p-1 rounded-lg hover:bg-surface-variant transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="flex items-center gap-3 lg:gap-4 text-primary">
            <div className="w-5 h-5 lg:w-6 lg:h-6">
              <svg className="text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-white text-base lg:text-lg font-bold leading-tight tracking-[-0.015em]">GrievAI Admin</h2>
          </div>
          <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-[#90a7cb] flex border-none bg-surface-container items-center justify-center pl-4 rounded-l-lg border-r-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
              </div>
              <input 
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-surface-container focus:border-none h-full placeholder:text-[#90a7cb] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" 
                placeholder="Search grievances..." 
              />
            </div>
          </label>
        </div>
        <div className="flex flex-1 justify-end gap-2 lg:gap-4 lg:gap-8">
          <div className="flex gap-1 lg:gap-2">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 w-8 lg:h-10 lg:w-10 bg-surface-container text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 hover:bg-surface-variant transition-colors">
              <div className="text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-sm lg:text-base" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
              </div>
            </button>
            <button className="hidden sm:flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-surface-container text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 hover:bg-surface-variant transition-colors">
              <div className="text-white flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>settings</span>
              </div>
            </button>
          </div>
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 h-8 lg:w-10 lg:h-10 border-2 border-primary/20" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuARCROeGwq7YtCGd4akJj3j5kyprgU5XpfjzHIxHdjqZRc709cHkNNU5VZH3mgs6bT55AzgABzHYEvNFWmKGXzWQUaIojzil15xSzP80cJa0r3O-OrHpneP2fN4M4Xx1rU0J2kklTIkfm1vEw0N_ebyGOhCIIAk4_lgYkpPs6T8bmagek8Lztn35Mt3_aRl9e4YbDHmWHiyVW31t79LGzcmgJfG5_3bqIkF1aFLJdofxw3pNIrZ3SPs")' }}
          ></div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="relative flex flex-col w-64 h-full bg-[#171717] border-r border-[#262626] p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-primary">
                <div className="w-5 h-5">
                  <svg className="text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
                  </svg>
                </div>
                <h2 className="text-white text-sm font-bold leading-tight">Admin</h2>
              </div>
              <button className="text-on-surface-variant" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex flex-col gap-1 w-full">
              <Link 
                to="/admin/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard') ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'}`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/admin/dashboard') ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
                <p className="text-sm font-medium">Dashboard</p>
              </Link>
              <Link 
                to="/admin/analytics"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive('/admin/analytics') ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'}`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/admin/analytics') ? "'FILL' 1" : "'FILL' 0" }}>analytics</span>
                <p className="text-sm font-medium">Analytics</p>
              </Link>
              <Link 
                to="/admin/insights"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive('/admin/insights') ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'}`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/admin/insights') ? "'FILL' 1" : "'FILL' 0" }}>insights</span>
                <p className="text-sm font-medium">System Insights</p>
              </Link>
              <Link 
                to="/admin/institutional-issues"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive('/admin/institutional-issues') ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'}`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/admin/institutional-issues') ? "'FILL' 1" : "'FILL' 0" }}>account_tree</span>
                <p className="text-sm font-medium">Institutional Issues</p>
              </Link>
            </div>
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto p-4 lg:p-6 gap-6">
        {/* Left Navigation Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 gap-6 shrink-0">
          <div className="flex flex-col gap-1 bg-[#171717] p-4 rounded-xl border border-[#262626]">
            <Link 
              to="/admin/dashboard"
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard') ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'}`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/admin/dashboard') ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
              <p className="text-sm font-medium">Dashboard</p>
            </Link>
            <Link 
              to="/admin/analytics"
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive('/admin/analytics') ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'}`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/admin/analytics') ? "'FILL' 1" : "'FILL' 0" }}>analytics</span>
              <p className="text-sm font-medium">Analytics</p>
            </Link>
            <Link 
              to="/admin/insights"
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive('/admin/insights') ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'}`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/admin/insights') ? "'FILL' 1" : "'FILL' 0" }}>insights</span>
              <p className="text-sm font-medium">System Insights</p>
            </Link>
            <Link 
              to="/admin/institutional-issues"
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive('/admin/institutional-issues') ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'}`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/admin/institutional-issues') ? "'FILL' 1" : "'FILL' 0" }}>account_tree</span>
              <p className="text-sm font-medium">Institutional Issues</p>
            </Link>
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors cursor-not-allowed opacity-50">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>corporate_fare</span>
              <p className="text-sm font-medium">Departments</p>
            </div>
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors cursor-not-allowed opacity-50">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>group</span>
              <p className="text-sm font-medium">Users</p>
            </div>
          </div>
          
          <div className="bg-[#171717] p-4 rounded-xl border border-[#262626] flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-outline">System Health</h4>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">AI Engine</span>
                <span className="text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span> Optimal
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">API Latency</span>
                <span className="text-on-surface font-mono">24ms</span>
              </div>
            </div>
          </div>
          
          <div className="relative h-40 rounded-xl overflow-hidden group border border-[#262626]">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD7O2P8XWBOrJk-b8mBDlGHppLvIEZ6UXR7tXAOQMPODT_nGTVFZsDuvD_NgrJf8rU_7RapPEMvBSQJYkYYTtlzZsX0K0rdg66yE-QbS12Tgf4wXaHbYJSJ60gtPajdGbfgS1eFdBk8WqJu9gJCeZRblNQqpD2gsds9iGMjUicrlhZ8gO4cXLSUVoZ3cOrHEUZmklZKjN4cF2xVR2V3UL3MhNRSODRRw4x9Vu_Ze2kKrwpqYXJAlus2')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-transparent to-transparent"></div>
            <div className="absolute bottom-3 left-3">
              <p className="text-white text-xs font-bold uppercase">Pro Insights</p>
              <p className="text-primary text-[10px]">Unlock AI Predictive Trends</p>
            </div>
          </div>
        </aside>

        {/* Main Dashboard Area */}
        <div className="flex-1 flex flex-col gap-6">
          {children}
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="mt-auto px-6 lg:px-10 py-4 border-t border-outline-variant bg-surface flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#8C909F] uppercase font-bold tracking-widest">
        <div className="flex items-center gap-6">
          <span>© 2024 GrievAI Institutional</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Live Stream Active
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a className="hover:text-primary transition-colors" href="#">Privacy Protocol</a>
          <a className="hover:text-primary transition-colors" href="#">Audit Logs</a>
          <a className="hover:text-primary transition-colors" href="#">Support Node</a>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
