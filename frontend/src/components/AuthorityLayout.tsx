import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  icon: string;
  label: string;
  to: string;
}

interface AuthorityLayoutProps {
  children: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  { icon: 'grid_view', label: 'Dashboard', to: '/authority/dashboard' },
  { icon: 'assignment_late', label: 'Queue', to: '/authority/queue' },
  { icon: 'query_stats', label: 'Analytics', to: '/authority/analytics' },
  { icon: 'group', label: 'Students', to: '/authority/students' },
  { icon: 'account_balance', label: 'Institutions', to: '/authority/institutions' },
  { icon: 'settings', label: 'Settings', to: '/authority/settings' },
];

const AuthorityLayout: React.FC<AuthorityLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden font-body-md text-body-md bg-background text-on-background antialiased">
      {/* SideNavBar */}
      <nav className="fixed left-0 top-0 h-full w-20 hidden md:flex flex-col items-center justify-between py-6 z-50 bg-surface-container-lowest border-r border-outline-variant">
        <div className="flex flex-col items-center w-full gap-8">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
            <span className="font-headline-md text-headline-md font-bold text-primary">G</span>
          </div>
          <div className="flex flex-col items-center gap-4 w-full px-2">
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  title={item.label}
                  className={`w-full h-12 flex items-center justify-center rounded-xl transition-all scale-95 active:scale-90 ${
                    isActive
                      ? 'text-primary bg-primary-container/20'
                      : 'text-on-surface-variant hover:bg-surface-variant/50'
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {item.icon}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 w-full px-2">
          {/* Notifications */}
          <button className="w-full h-12 flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 transition-colors rounded-xl scale-95 active:scale-90" title="Notifications">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
          </button>
          {/* Profile */}
          <button className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant hover:border-primary transition-colors scale-95 active:scale-90" title="Profile">
            <img alt="Administrator Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuOWhjXtXIqRgz55u0REpzA3Vp1kTpOIChekmabOCrqV9dQo8YLlNK4pMfoHjxLPOQ1uFgiJhF8ff8lrVXOq71agbF4pisKIDinKb-cY1yq7c7Ew3pFvOkCNALdZeGMJXUhdkYiYiHXBOO1WaiFqcOxyeCUe1WvvCPhW96jyL2J3WxuACsPVvXpTbvKAiMBFXOhpVdfq3vLpmRYnCGJehubP-3shwQUPj-h6Sp_o5d97b0iqhNTEfZ" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="relative flex flex-col w-64 h-full bg-surface-container-lowest border-r border-outline-variant p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
                <span className="font-headline-md text-headline-md font-bold text-primary">G</span>
              </div>
              <button className="text-on-surface-variant" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex flex-col gap-2 w-full">
              {mainNavItems.map((item) => {
                const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full h-12 flex items-center gap-4 px-4 rounded-xl transition-all ${
                      isActive
                        ? 'text-primary bg-primary-container/20'
                        : 'text-on-surface-variant hover:bg-surface-variant/50'
                    }`}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="ml-0 md:ml-20 flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* TopAppBar */}
        <header className="sticky top-0 z-40 w-full flex justify-between items-center px-4 md:px-container-padding py-4 bg-background/80 backdrop-blur-xl border-b border-outline-variant/30">
          <div className="flex items-center gap-4 md:gap-8">
            <button className="md:hidden text-on-surface-variant flex items-center justify-center" onClick={() => setIsMobileMenuOpen(true)}>
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="font-headline-md text-headline-md font-black text-on-background">Case Intelligence</h1>
            <nav className="hidden md:flex gap-6">
              <Link to="/authority/queue" className="font-label-md text-label-md text-primary font-bold border-b-2 border-primary pb-2 opacity-100 transition-opacity">Queue</Link>
              <Link to="/authority/in-review" className="font-label-md text-label-md text-on-surface-variant pb-2 hover:text-primary transition-colors opacity-80 hover:opacity-100">In-Review</Link>
              <Link to="/authority/resolved" className="font-label-md text-label-md text-on-surface-variant pb-2 hover:text-primary transition-colors opacity-80 hover:opacity-100">Resolved</Link>
              <Link to="/authority/urgent" className="font-label-md text-label-md text-on-surface-variant pb-2 hover:text-primary transition-colors opacity-80 hover:opacity-100">Urgent</Link>
            </nav>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-sm">search</span>
              <input className="pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/50 transition-all w-64 placeholder-on-surface-variant/50" placeholder="Search cases..." type="text" />
            </div>
            <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>filter_list</span>
            </button>
            <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors hidden sm:flex">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>help_outline</span>
            </button>
            <button className="px-3 py-1.5 md:px-4 md:py-2 bg-[#3b82f6] text-white rounded-lg font-label-md text-label-md hover:bg-blue-600 transition-colors ml-2 md:ml-4 shadow-[0_0_15px_rgba(59,130,246,0.3)] whitespace-nowrap">
              New Case
            </button>
          </div>
        </header>
        
        {children}
      </main>
    </div>
  );
};

export default AuthorityLayout;
