import React from 'react';
import { Link } from 'react-router-dom';

const InstitutionalIssues: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-2 font-display-lg tracking-tight">Institutional Issues</h1>
        <p className="text-base font-normal text-on-surface-muted max-w-2xl">
          AI-clustered systemic problems derived from individual grievances. High-density view for administrative triage and root-cause analysis.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Issue Hierarchy Contextual Visual (Full Width Header Card) */}
        <div className="col-span-1 md:col-span-12 bg-[#171717] border border-[#262626] rounded-xl flex items-center justify-between py-4 px-6 shadow-[inset_0_0_20px_rgba(173,198,255,0.1)]">
          <div className="flex items-center gap-4 w-full justify-between opacity-80">
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-on-surface-muted mb-1 text-3xl">person</span>
              <span className="text-[12px] font-bold tracking-widest text-on-surface-muted uppercase">Individual Complaints</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#262626] to-transparent relative">
              <span className="material-symbols-outlined absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-on-surface-variant text-sm bg-[#171717] px-2">arrow_forward</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-primary mb-1 text-3xl">hub</span>
              <span className="text-[12px] font-bold tracking-widest text-primary uppercase">AI Clustering</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent relative">
              <span className="material-symbols-outlined absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary text-sm bg-[#171717] px-2">arrow_forward</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-[#FFB4AB] mb-1 text-3xl">account_tree</span>
              <span className="text-[12px] font-bold tracking-widest text-on-surface uppercase">Institutional Issue</span>
            </div>
          </div>
        </div>

        {/* High Priority Card: Hostel Water Supply */}
        <div className="col-span-1 md:col-span-6 lg:col-span-4 bg-[#171717] border border-[#262626] border-l-2 border-l-[#FFB4AB] rounded-xl p-5 relative overflow-hidden group hover:border-[#8c909f] transition-colors duration-300 shadow-[inset_0_0_20px_rgba(173,198,255,0.1)] flex flex-col">
          <div className="absolute top-0 right-0 p-3">
            <span className="inline-flex items-center px-2 py-1 rounded bg-[#FFB4AB]/15 text-[#FFB4AB] text-xs font-medium font-mono">
              <span className="material-symbols-outlined text-[14px] mr-1">warning</span> HIGH
            </span>
          </div>
          <div className="mb-4">
            <span className="text-[12px] font-bold tracking-widest text-on-surface-muted uppercase block mb-1">ISS-9901-WTR</span>
            <h3 className="text-xl font-medium text-on-surface mb-2 pr-16">Hostel Water Supply</h3>
            <p className="text-[13px] text-on-surface-variant">Intermittent pressure and discoloration reported across multiple blocks.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#191b23] p-3 rounded-lg border border-[#363941]">
              <div className="text-[12px] font-bold tracking-widest text-on-surface-muted uppercase mb-1">Grievances</div>
              <div className="text-2xl font-semibold text-primary">17</div>
            </div>
            <div className="bg-[#191b23] p-3 rounded-lg border border-[#363941]">
              <div className="text-[12px] font-bold tracking-widest text-on-surface-muted uppercase mb-1">Department</div>
              <div className="text-[13px] text-on-surface truncate">Hostel Admin</div>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[12px] font-bold tracking-widest text-on-surface-muted uppercase">Trend (7d)</span>
              <span className="text-[12px] font-medium font-mono text-[#FFB4AB]">+4 today</span>
            </div>
            <div className="h-10 w-full bg-[#191b23] rounded border border-[#363941] flex items-end px-1 pt-2 pb-1 gap-1">
              {/* CSS Sparkline Bars */}
              <div className="w-full bg-primary/20 rounded-t h-[20%]"></div>
              <div className="w-full bg-primary/20 rounded-t h-[30%]"></div>
              <div className="w-full bg-primary/40 rounded-t h-[25%]"></div>
              <div className="w-full bg-primary/40 rounded-t h-[50%]"></div>
              <div className="w-full bg-primary/60 rounded-t h-[40%]"></div>
              <div className="w-full bg-[#F59E0B]/60 rounded-t h-[70%]"></div>
              <div className="w-full bg-[#FFB4AB]/80 rounded-t h-[90%]"></div>
            </div>
          </div>
          <div className="border-t border-[#262626] pt-3 mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
              <span className="text-[12px] font-bold tracking-widest text-primary uppercase">Clustered Insights</span>
            </div>
            <p className="text-[13px] text-on-surface-variant">AI grouped these based on semantic similarity of "rusty water" and temporal spike in Block B.</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-1 rounded-full border border-[#363941] text-xs font-medium font-mono text-on-surface-muted">
              Status: Under Investigation
            </span>
            <Link to="/admin/institutional-issues/ISS-9901-WTR" className="text-primary hover:text-[#adc6ff] transition-colors">
              <span className="material-symbols-outlined">open_in_new</span>
            </Link>
          </div>
        </div>

        {/* Medium Priority Card: Campus Wi-Fi */}
        <div className="col-span-1 md:col-span-6 lg:col-span-4 bg-[#171717] border border-[#262626] border-l-2 border-l-[#F59E0B] rounded-xl p-5 relative overflow-hidden group hover:border-[#8c909f] transition-colors duration-300 flex flex-col">
          <div className="absolute top-0 right-0 p-3">
            <span className="inline-flex items-center px-2 py-1 rounded bg-[#F59E0B]/15 text-[#F59E0B] text-xs font-medium font-mono">
              <span className="material-symbols-outlined text-[14px] mr-1">error</span> MED
            </span>
          </div>
          <div className="mb-4">
            <span className="text-[12px] font-bold tracking-widest text-on-surface-muted uppercase block mb-1">ISS-8842-NET</span>
            <h3 className="text-xl font-medium text-on-surface mb-2 pr-16">Campus Wi-Fi Stability</h3>
            <p className="text-[13px] text-on-surface-variant">Frequent disconnections and high latency during peak hours.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#191b23] p-3 rounded-lg border border-[#363941]">
              <div className="text-[12px] font-bold tracking-widest text-on-surface-muted uppercase mb-1">Grievances</div>
              <div className="text-2xl font-semibold text-primary">42</div>
            </div>
            <div className="bg-[#191b23] p-3 rounded-lg border border-[#363941]">
              <div className="text-[12px] font-bold tracking-widest text-on-surface-muted uppercase mb-1">Department</div>
              <div className="text-[13px] text-on-surface truncate">IT Services</div>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[12px] font-bold tracking-widest text-on-surface-muted uppercase">Trend (7d)</span>
              <span className="text-[12px] font-medium font-mono text-on-surface-muted">-2 today</span>
            </div>
            <div className="h-10 w-full bg-[#191b23] rounded border border-[#363941] flex items-end px-1 pt-2 pb-1 gap-1">
              <div className="w-full bg-primary/60 rounded-t h-[80%]"></div>
              <div className="w-full bg-primary/50 rounded-t h-[75%]"></div>
              <div className="w-full bg-primary/60 rounded-t h-[85%]"></div>
              <div className="w-full bg-primary/40 rounded-t h-[60%]"></div>
              <div className="w-full bg-primary/50 rounded-t h-[65%]"></div>
              <div className="w-full bg-primary/30 rounded-t h-[40%]"></div>
              <div className="w-full bg-primary/30 rounded-t h-[35%]"></div>
            </div>
          </div>
          <div className="border-t border-[#262626] pt-3 mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
              <span className="text-[12px] font-bold tracking-widest text-primary uppercase">Clustered Insights</span>
            </div>
            <p className="text-[13px] text-on-surface-variant">High volume of complaints localized to Library and Science blocks between 10 AM - 2 PM.</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-1 rounded-full border border-[#363941] text-xs font-medium font-mono text-on-surface-muted">
              Status: Mitigating
            </span>
            <Link to="/admin/institutional-issues/ISS-8842-NET" className="text-primary hover:text-[#adc6ff] transition-colors">
              <span className="material-symbols-outlined">open_in_new</span>
            </Link>
          </div>
        </div>

        {/* Low Priority Card: Library Books */}
        <div className="col-span-1 md:col-span-6 lg:col-span-4 bg-[#171717] border border-[#262626] border-l-2 border-l-[#8c909f] rounded-xl p-5 relative overflow-hidden group hover:border-[#8c909f] transition-colors duration-300 flex flex-col">
          <div className="absolute top-0 right-0 p-3">
            <span className="inline-flex items-center px-2 py-1 rounded bg-[#32353c] text-on-surface-variant text-xs font-medium font-mono">
              <span className="material-symbols-outlined text-[14px] mr-1">info</span> LOW
            </span>
          </div>
          <div className="mb-4">
            <span className="text-[12px] font-bold tracking-widest text-on-surface-muted uppercase block mb-1">ISS-7721-LIB</span>
            <h3 className="text-xl font-medium text-on-surface mb-2 pr-16">Library Book Availability</h3>
            <p className="text-[13px] text-on-surface-variant">Shortage of core textbooks for incoming Computer Science batch.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#191b23] p-3 rounded-lg border border-[#363941]">
              <div className="text-[12px] font-bold tracking-widest text-on-surface-muted uppercase mb-1">Grievances</div>
              <div className="text-2xl font-semibold text-primary">8</div>
            </div>
            <div className="bg-[#191b23] p-3 rounded-lg border border-[#363941]">
              <div className="text-[12px] font-bold tracking-widest text-on-surface-muted uppercase mb-1">Department</div>
              <div className="text-[13px] text-on-surface truncate">Library</div>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[12px] font-bold tracking-widest text-on-surface-muted uppercase">Trend (7d)</span>
              <span className="text-[12px] font-medium font-mono text-on-surface-muted">Stable</span>
            </div>
            <div className="h-10 w-full bg-[#191b23] rounded border border-[#363941] flex items-end px-1 pt-2 pb-1 gap-1">
              <div className="w-full bg-primary/20 rounded-t h-[20%]"></div>
              <div className="w-full bg-primary/20 rounded-t h-[20%]"></div>
              <div className="w-full bg-primary/20 rounded-t h-[25%]"></div>
              <div className="w-full bg-primary/20 rounded-t h-[20%]"></div>
              <div className="w-full bg-primary/20 rounded-t h-[20%]"></div>
              <div className="w-full bg-primary/20 rounded-t h-[30%]"></div>
              <div className="w-full bg-primary/20 rounded-t h-[25%]"></div>
            </div>
          </div>
          <div className="border-t border-[#262626] pt-3 mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
              <span className="text-[12px] font-bold tracking-widest text-primary uppercase">Clustered Insights</span>
            </div>
            <p className="text-[13px] text-on-surface-variant">Keywords matched specific course codes (CS101) across 1st-year student profiles.</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-1 rounded-full border border-[#363941] text-xs font-medium font-mono text-on-surface-muted">
              Status: Monitoring
            </span>
            <Link to="/admin/institutional-issues/ISS-7721-LIB" className="text-primary hover:text-[#adc6ff] transition-colors">
              <span className="material-symbols-outlined">open_in_new</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstitutionalIssues;
