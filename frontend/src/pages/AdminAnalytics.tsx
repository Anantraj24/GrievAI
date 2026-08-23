import React from 'react';
import AdminLayout from '../components/AdminLayout';

const AdminAnalytics: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-4 flex-1 w-full max-w-7xl mx-auto">
        {/* Context & Filters Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-surface tracking-tight mb-1">Analytics Dashboard</h2>
            <p className="text-body-md font-body-md text-on-surface-muted">Comprehensive data-driven oversight view of institutional metrics.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center bg-[#171717] border border-[#262626] rounded-md px-3 py-1.5 text-body-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <span className="material-symbols-outlined text-on-surface-muted text-sm mr-2" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_today</span>
              <select className="bg-transparent text-on-surface border-none p-0 focus:ring-0 cursor-pointer outline-none">
                <option>Last 30 Days</option>
                <option>Last Quarter</option>
                <option>Year to Date</option>
              </select>
            </div>
            <div className="flex items-center bg-[#171717] border border-[#262626] rounded-md px-3 py-1.5 text-body-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <span className="material-symbols-outlined text-on-surface-muted text-sm mr-2" style={{ fontVariationSettings: "'FILL' 0" }}>domain</span>
              <select className="bg-transparent text-on-surface border-none p-0 focus:ring-0 cursor-pointer outline-none">
                <option>All Departments</option>
                <option>Academic Affairs</option>
                <option>Student Services</option>
              </select>
            </div>
            <div className="flex items-center bg-[#171717] border border-[#262626] rounded-md px-3 py-1.5 text-body-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <span className="material-symbols-outlined text-on-surface-muted text-sm mr-2" style={{ fontVariationSettings: "'FILL' 0" }}>category</span>
              <select className="bg-transparent text-on-surface border-none p-0 focus:ring-0 cursor-pointer outline-none">
                <option>All Categories</option>
                <option>Harassment</option>
                <option>Grade Dispute</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bento Grid Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Grievance Volume & Velocity (Spans 8 cols on desktop) */}
          <section className="md:col-span-8 bg-[#171717] border border-[#262626] rounded-xl p-[20px] flex flex-col relative overflow-hidden group hover:border-primary/40 hover:-translate-y-0.5 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)] border-l-2 border-l-[#3B82F6] transition-all">
            {/* Subtle ambient glow in background */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>
            
            <div className="flex justify-between items-start mb-6 z-10">
              <div>
                <h3 className="text-label-caps font-label-caps text-on-surface-muted mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>monitoring</span>
                  GRIEVANCE VOLUME & VELOCITY
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-headline-lg font-headline-lg text-on-surface">1,248</span>
                  <span className="text-body-sm font-data-mono text-[#F59E0B] flex items-center">
                    <span className="material-symbols-outlined text-xs mr-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>trending_up</span> +12%
                  </span>
                </div>
              </div>
              <button className="text-on-surface-muted hover:text-primary transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>more_vert</span>
              </button>
            </div>
            
            <div className="flex-1 min-h-[240px] w-full relative z-10">
              {/* Abstract Chart Representation */}
              <div className="absolute inset-0 flex items-end justify-between px-2 pb-6 pt-4 gap-1 opacity-70">
                {/* Bars */}
                <div className="w-full bg-surface-bright rounded-t-sm h-[30%] hover:bg-primary/40 transition-colors cursor-crosshair"></div>
                <div className="w-full bg-surface-bright rounded-t-sm h-[45%] hover:bg-primary/40 transition-colors cursor-crosshair"></div>
                <div className="w-full bg-surface-bright rounded-t-sm h-[20%] hover:bg-primary/40 transition-colors cursor-crosshair"></div>
                <div className="w-full bg-surface-bright rounded-t-sm h-[60%] hover:bg-primary/40 transition-colors cursor-crosshair"></div>
                <div className="w-full bg-surface-bright rounded-t-sm h-[80%] bg-primary/20 hover:bg-primary/50 transition-colors cursor-crosshair"></div>
                <div className="w-full bg-surface-bright rounded-t-sm h-[50%] hover:bg-primary/40 transition-colors cursor-crosshair"></div>
                <div className="w-full bg-surface-bright rounded-t-sm h-[35%] hover:bg-primary/40 transition-colors cursor-crosshair"></div>
                <div className="w-full bg-surface-bright rounded-t-sm h-[70%] hover:bg-primary/40 transition-colors cursor-crosshair"></div>
                <div className="w-full bg-surface-bright rounded-t-sm h-[90%] bg-[#F59E0B]/30 hover:bg-[#F59E0B]/60 transition-colors cursor-crosshair"></div>
                <div className="w-full bg-surface-bright rounded-t-sm h-[65%] hover:bg-primary/40 transition-colors cursor-crosshair"></div>
                <div className="w-full bg-surface-bright rounded-t-sm h-[40%] hover:bg-primary/40 transition-colors cursor-crosshair"></div>
                <div className="w-full bg-surface-bright rounded-t-sm h-[25%] hover:bg-primary/40 transition-colors cursor-crosshair"></div>
              </div>
              
              {/* Overlay Line */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none drop-shadow-md opacity-90" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M 0 80 Q 10 70 20 60 T 40 50 T 60 70 T 80 40 T 100 20" fill="none" stroke="#3B82F6" strokeLinecap="round" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
              </svg>
              
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-border-muted w-full h-0"></div>
                <div className="border-b border-border-muted w-full h-0"></div>
                <div className="border-b border-border-muted w-full h-0"></div>
                <div className="border-b border-border-muted w-full h-0"></div>
                <div className="border-b border-border-muted w-full h-0"></div>
              </div>
            </div>
          </section>

          {/* Category Intensity (Spans 4 cols on desktop) */}
          <section className="md:col-span-4 bg-[#171717] border border-[#262626] rounded-xl p-[20px] flex flex-col">
            <h3 className="text-label-caps font-label-caps text-on-surface-muted mb-4">CATEGORY INTENSITY</h3>
            <div className="flex-1 w-full flex flex-col gap-2 min-h-[240px]">
              {/* Treemap representation */}
              <div className="flex w-full gap-2 h-1/2">
                <div className="bg-primary/20 hover:bg-primary/30 transition-colors border border-primary/30 rounded-md w-[60%] p-3 flex flex-col justify-between cursor-pointer group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-body-sm font-body-sm text-on-surface">Academic<br />Disputes</span>
                  <span className="font-data-mono text-primary text-xs">42%</span>
                </div>
                <div className="bg-[#FFB4AB]/10 hover:bg-[#FFB4AB]/20 transition-colors border border-[#FFB4AB]/30 rounded-md w-[40%] p-3 flex flex-col justify-between cursor-pointer relative overflow-hidden">
                  <span className="text-body-sm font-body-sm text-on-surface">Conduct<br />Violations</span>
                  <span className="font-data-mono text-[#FFB4AB] text-xs">28%</span>
                </div>
              </div>
              <div className="flex w-full gap-2 h-1/2">
                <div className="bg-surface-bright hover:bg-surface-container-highest transition-colors border border-border-muted rounded-md w-[35%] p-3 flex flex-col justify-between cursor-pointer">
                  <span className="text-body-sm font-body-sm text-on-surface truncate">Facilities</span>
                  <span className="font-data-mono text-on-surface-muted text-xs">15%</span>
                </div>
                <div className="flex flex-col gap-2 w-[65%]">
                  <div className="bg-surface-bright hover:bg-surface-container-highest transition-colors border border-border-muted rounded-md w-full h-1/2 p-2 flex items-center justify-between cursor-pointer">
                    <span className="text-xs text-on-surface truncate">HR</span>
                    <span className="font-data-mono text-on-surface-muted text-[10px]">10%</span>
                  </div>
                  <div className="bg-surface-bright hover:bg-surface-container-highest transition-colors border border-border-muted rounded-md w-full h-1/2 p-2 flex items-center justify-between cursor-pointer">
                    <span className="text-xs text-on-surface truncate">Other</span>
                    <span className="font-data-mono text-on-surface-muted text-[10px]">5%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SLA Performance (Spans 6 cols) */}
          <section className="md:col-span-6 bg-[#171717] border border-[#262626] rounded-xl p-[20px] flex flex-col">
            <h3 className="text-label-caps font-label-caps text-on-surface-muted mb-6">SLA PERFORMANCE BY DEPT</h3>
            <div className="flex-1 space-y-4">
              {/* Bar Item 1 */}
              <div>
                <div className="flex justify-between text-body-sm text-on-surface mb-1">
                  <span>Academic Affairs</span>
                  <span className="font-data-mono">94%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
              {/* Bar Item 2 */}
              <div>
                <div className="flex justify-between text-body-sm text-on-surface mb-1">
                  <span>Student Services</span>
                  <span className="font-data-mono">88%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                  <div className="bg-primary/70 h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
              {/* Bar Item 3 */}
              <div>
                <div className="flex justify-between text-body-sm text-on-surface mb-1">
                  <span className="flex items-center gap-2">Facilities <span className="w-2 h-2 rounded-full bg-[#FFB4AB] shadow-[0_0_8px_rgba(255,180,171,0.6)]"></span></span>
                  <span className="font-data-mono text-[#FFB4AB]">62%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                  <div className="bg-[#FFB4AB] h-2 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>
              {/* Bar Item 4 */}
              <div>
                <div className="flex justify-between text-body-sm text-on-surface mb-1">
                  <span>Human Resources</span>
                  <span className="font-data-mono">75%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                  <div className="bg-[#F59E0B] h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Satisfaction & Feedback (Spans 6 cols) */}
          <section className="md:col-span-6 bg-[#171717] border border-[#262626] rounded-xl p-[20px] flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className="text-label-caps font-label-caps text-on-surface-muted">SENTIMENT ANALYSIS</h3>
              <div className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-data-mono text-primary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> LIVE
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-7 gap-1 mt-2">
              {/* Heatmap cells (Simulated with React array mapping) */}
              {Array.from({ length: 5 }).map((_, i) => (
                <React.Fragment key={`row-${i}`}>
                  {Array.from({ length: 7 }).map((_, j) => {
                    const isAnomaly = i === 2 && j === 4;
                    const intensity = Math.random();
                    let colorClass = 'bg-surface-bright';
                    
                    if (isAnomaly) colorClass = 'bg-[#FFB4AB]/70';
                    else if (intensity > 0.8) colorClass = 'bg-primary/80';
                    else if (intensity > 0.6) colorClass = 'bg-primary/50';
                    else if (intensity > 0.4) colorClass = 'bg-primary/30';
                    else if (intensity > 0.2) colorClass = 'bg-surface-container-highest';

                    return (
                      <div 
                        key={`cell-${i}-${j}`} 
                        className={`w-full aspect-square rounded-sm ${colorClass} hover:ring-1 hover:ring-white/50 cursor-crosshair transition-all`} 
                        title="Data point"
                      ></div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            
            <div className="mt-4 flex justify-between items-center text-xs text-on-surface-muted font-data-mono border-t border-border-muted pt-3">
              <div className="flex items-center gap-2">
                <span>Negative</span>
                <div className="w-16 h-2 rounded-full bg-gradient-to-r from-surface-bright to-primary/80"></div>
                <span>Positive</span>
              </div>
              <span className="text-[#FFB4AB] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 0" }}>warning</span> Anomaly detected
              </span>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
