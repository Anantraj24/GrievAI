import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  icon: string;
  label: string;
  to: string;
}

interface LayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  userRoleLabel: string;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, navItems, userRoleLabel, userName }) => {
  const location = useLocation();

  return (
    <div className="bg-background text-on-surface font-body-md text-body-md antialiased overflow-x-hidden min-h-screen">
      {/* SideNavBar */}
      <aside className="bg-surface dark:bg-surface text-primary dark:text-primary font-body-md text-body-md font-headline-md text-headline-md font-bold text-primary h-screen w-64 fixed left-0 top-0 border-r border-outline-variant flex flex-col p-gutter z-50 hidden md:flex">
        {/* Header */}
        <div className="mb-stack-lg flex items-center gap-stack-sm">
          <div className="w-10 h-10 rounded bg-primary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">GrievAI</h1>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase">{userRoleLabel}</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 space-y-unit">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-stack-sm p-stack-sm rounded-lg cursor-pointer active:scale-95 duration-200 transition-colors ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-medium'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* CTA */}
        <div className="mt-auto pt-stack-md border-t border-outline-variant">
          <Link
            to="/student/submit"
            className="w-full bg-[#3B82F6] text-white font-body-md text-body-md font-medium py-2 px-4 rounded hover:bg-opacity-90 transition-colors cursor-pointer active:scale-95 duration-200 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            New Case
          </Link>
        </div>
      </aside>
      
      {/* TopAppBar */}
      <header className="bg-background dark:bg-background text-primary dark:text-primary font-label-md text-label-md font-headline-md text-headline-md font-semibold text-on-surface fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] h-16 border-b border-outline-variant flex items-center justify-between px-container-padding z-40 bg-opacity-90 backdrop-blur-md">
        <div className="md:hidden flex items-center">
          <span className="font-headline-md text-headline-md font-bold tracking-tight">GrievAI</span>
        </div>
        <div className="hidden md:flex"></div>
        <div className="flex items-center gap-stack-md">
          <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high focus-within:ring-2 focus-within:ring-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>settings</span>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high focus-within:ring-2 focus-within:ring-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>help</span>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high focus-within:ring-2 focus-within:ring-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="pt-24 pb-container-padding px-container-padding md:ml-64 w-full max-w-[1600px] mx-auto min-h-screen flex flex-col gap-container-padding">
        {children}
      </main>
    </div>
  );
};

export default Layout;
