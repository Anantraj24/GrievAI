import React from 'react';
import AuthorityLayout from '../components/AuthorityLayout';

const AuthorityDashboard: React.FC = () => {
  return (
    <AuthorityLayout>
      {/* Scrollable Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-container-padding">
        <div className="max-w-7xl mx-auto flex flex-col gap-card-gap">
          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-card-gap">
            {/* Metric 1 */}
            <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] flex flex-col gap-2">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Open Grievances</span>
              <div className="flex items-end justify-between">
                <span className="font-display-lg text-display-lg text-on-surface">1,248</span>
                <span className="material-symbols-outlined text-outline-variant mb-1" style={{ fontVariationSettings: "'FILL' 0" }}>assignment</span>
              </div>
            </div>
            {/* Metric 2 */}
            <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] flex flex-col gap-2 border-l-2 border-l-[#3b82f6]">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">High Priority</span>
              <div className="flex items-end justify-between">
                <span className="font-display-lg text-display-lg text-error">84</span>
                <span className="material-symbols-outlined text-error mb-1" style={{ fontVariationSettings: "'FILL' 0" }}>warning</span>
              </div>
            </div>
            {/* Metric 3 */}
            <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] flex flex-col gap-2">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">SLA At Risk</span>
              <div className="flex items-end justify-between">
                <span className="font-display-lg text-display-lg text-tertiary-container">156</span>
                <span className="material-symbols-outlined text-tertiary-container mb-1" style={{ fontVariationSettings: "'FILL' 0" }}>timer</span>
              </div>
            </div>
            {/* Metric 4 */}
            <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] flex flex-col gap-2">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Overdue</span>
              <div className="flex items-end justify-between">
                <span className="font-display-lg text-display-lg text-on-error-container">23</span>
                <span className="material-symbols-outlined text-on-error-container mb-1" style={{ fontVariationSettings: "'FILL' 0" }}>event_busy</span>
              </div>
            </div>
            {/* Metric 5 */}
            <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] flex flex-col gap-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/10 to-transparent pointer-events-none"></div>
              <span className="font-label-md text-label-md text-primary uppercase tracking-wider">Resolved Today</span>
              <div className="flex items-end justify-between">
                <span className="font-display-lg text-display-lg text-primary">42</span>
                <span className="material-symbols-outlined text-primary mb-1" style={{ fontVariationSettings: "'FILL' 0" }}>task_alt</span>
              </div>
            </div>
          </div>

          {/* Main Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-card-gap">
            {/* Needs Attention (Spans 8 cols) */}
            <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] lg:col-span-8 flex flex-col gap-4 border-l-2 border-l-[#3b82f6] relative">
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3b82f6]" style={{ fontVariationSettings: "'FILL' 0" }}>auto_awesome</span>
                  <h2 className="font-headline-lg text-headline-lg">Needs Attention</h2>
                </div>
                <button className="text-primary hover:text-blue-400 font-label-md text-label-md transition-colors">View All</button>
              </div>
              <div className="flex flex-col gap-2">
                {/* Case Item 1 */}
                <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/50 hover:bg-surface-variant transition-colors flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-error"></div>
                    <div className="flex flex-col">
                      <span className="font-body-md text-body-md font-semibold text-on-surface">GRV-2023-8921</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Academic Integrity Violation Appeal</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-1 bg-[rgba(245,158,11,0.1)] text-amber-500 rounded font-mono-sm text-mono-sm">SLA: 2h</span>
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
                  </div>
                </div>
                {/* Case Item 2 */}
                <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/50 hover:bg-surface-variant transition-colors flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-error"></div>
                    <div className="flex flex-col">
                      <span className="font-body-md text-body-md font-semibold text-on-surface">GRV-2023-8944</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Housing Facility Maintenance Escalation</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-1 bg-[rgba(245,158,11,0.1)] text-amber-500 rounded font-mono-sm text-mono-sm">SLA: 4h</span>
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
                  </div>
                </div>
                {/* Case Item 3 */}
                <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/50 hover:bg-surface-variant transition-colors flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>
                    <div className="flex flex-col">
                      <span className="font-body-md text-body-md font-semibold text-on-surface">GRV-2023-8950</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Financial Aid Disbursement Delay</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-1 bg-[rgba(59,130,246,0.1)] text-[#3b82f6] rounded font-mono-sm text-mono-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 0" }}>auto_awesome</span> AI Flag
                    </span>
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Distribution (Spans 4 cols) */}
            <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] lg:col-span-4 flex flex-col gap-4">
              <div className="border-b border-outline-variant/30 pb-3">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Category Distribution</h3>
              </div>
              <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
                {/* Placeholder for Donut Chart */}
                <div className="w-40 h-40 rounded-full border-[16px] border-surface-container-low relative flex items-center justify-center">
                  <div className="absolute inset-[-16px] rounded-full border-[16px] border-transparent border-t-[#3b82f6] border-r-[#3b82f6] rotate-45"></div>
                  <div className="absolute inset-[-16px] rounded-full border-[16px] border-transparent border-b-secondary rotate-12"></div>
                  <div className="text-center">
                    <span className="block font-headline-md text-headline-md font-bold">Total</span>
                    <span className="block font-body-sm text-body-sm text-outline-variant">Categories</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Workload (Spans 6 cols) */}
            <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] lg:col-span-6 flex flex-col gap-4">
              <div className="border-b border-outline-variant/30 pb-3">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Department Workload</h3>
              </div>
              <div className="flex flex-col gap-4 justify-center flex-1">
                {/* IT Support */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-body-sm text-body-sm text-on-surface">IT Support</span>
                    <span className="font-mono-sm text-mono-sm text-outline-variant">42%</span>
                  </div>
                  <div className="w-full bg-surface-container-low rounded-full h-2">
                    <div className="bg-[#3b82f6] h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                {/* HR */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-body-sm text-body-sm text-on-surface">HR</span>
                    <span className="font-mono-sm text-mono-sm text-outline-variant">28%</span>
                  </div>
                  <div className="w-full bg-surface-container-low rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                {/* Facilities */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-body-sm text-body-sm text-on-surface">Facilities</span>
                    <span className="font-mono-sm text-mono-sm text-outline-variant">15%</span>
                  </div>
                  <div className="w-full bg-surface-container-low rounded-full h-2">
                    <div className="bg-tertiary-container h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resolution Trend (Spans 6 cols) */}
            <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] lg:col-span-6 flex flex-col gap-4">
              <div className="border-b border-outline-variant/30 pb-3">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Resolution Trend</h3>
              </div>
              <div className="flex-1 flex items-end justify-between relative min-h-[150px] pb-4 px-2">
                {/* Faux Line Chart Area */}
                <div className="absolute inset-0 pt-10 pb-4 px-2 flex items-end">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,80 L20,60 L40,75 L60,30 L80,45 L100,20" fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                    <path d="M0,100 L0,80 L20,60 L40,75 L60,30 L80,45 L100,20 L100,100 Z" fill="url(#blue-grad)" opacity="0.1"></path>
                    <defs>
                      <linearGradient id="blue-grad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6"></stop>
                        <stop offset="100%" stopColor="transparent"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                {/* Axis Labels (Faux) */}
                <div className="w-full flex justify-between font-mono-sm text-mono-sm text-outline-variant absolute bottom-0 left-0 px-2">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthorityLayout>
  );
};

export default AuthorityDashboard;
