import React from 'react';
import AuthorityLayout from '../components/AuthorityLayout';

const GrievanceQueue: React.FC = () => {
  return (
    <AuthorityLayout>
      {/* Canvas */}
      <div className="flex-1 overflow-auto p-container-padding flex flex-col gap-card-gap">
        {/* Page Header & Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div className="flex gap-2 bg-[#171717] p-1 rounded-lg border border-[#262626] overflow-x-auto w-full sm:w-auto hide-scrollbar">
            <button className="px-3 py-1.5 rounded-md bg-[#262626] text-primary font-label-md text-label-md whitespace-nowrap">All Grievances (142)</button>
            <button className="px-3 py-1.5 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-[#262626]/50 transition-colors font-label-md text-label-md whitespace-nowrap">Needs Review (28)</button>
            <button className="px-3 py-1.5 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-[#262626]/50 transition-colors font-label-md text-label-md whitespace-nowrap">Assigned to Me (5)</button>
            <button className="px-3 py-1.5 rounded-md text-error hover:text-error hover:bg-error/10 transition-colors font-label-md text-label-md whitespace-nowrap flex items-center gap-1">
              High Priority
              <span className="w-4 h-4 bg-error/20 text-error rounded-full flex items-center justify-center text-[10px]">12</span>
            </button>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#262626] text-on-surface-variant hover:text-on-surface hover:border-outline-variant transition-colors font-label-md text-label-md w-full sm:w-auto justify-center">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>sort</span>
              Sort: Urgency
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#262626] text-on-surface-variant hover:text-on-surface hover:border-outline-variant transition-colors font-label-md text-label-md w-full sm:w-auto justify-center">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>view_column</span>
              Columns
            </button>
          </div>
        </div>

        {/* Bento Data Table */}
        <div className="bg-[#171717] border border-[#262626] rounded-xl flex-1 flex flex-col min-h-[500px] overflow-hidden relative">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-[20px] py-3 bg-[#171717] border-b border-[#262626] sticky top-0 z-10">
            <div className="col-span-2 flex items-center gap-2">
              <input className="w-4 h-4 rounded bg-[#0a0a0a] border-[#424754] text-primary focus:ring-primary/50 focus:ring-offset-0" type="checkbox" />
              <span className="font-label-md text-label-md text-outline">REFERENCE</span>
            </div>
            <div className="col-span-3 flex items-center">
              <span className="font-label-md text-label-md text-outline">COMPLAINT SNIPPET</span>
            </div>
            <div className="col-span-1 flex items-center">
              <span className="font-label-md text-label-md text-outline">CATEGORY</span>
            </div>
            <div className="col-span-2 flex items-center">
              <span className="font-label-md text-label-md text-outline">AI INSIGHT</span>
            </div>
            <div className="col-span-1 flex items-center">
              <span className="font-label-md text-label-md text-outline">PRIORITY</span>
            </div>
            <div className="col-span-1 flex items-center">
              <span className="font-label-md text-label-md text-outline">STATUS</span>
            </div>
            <div className="col-span-2 flex items-center justify-end">
              <span className="font-label-md text-label-md text-outline">SLA / CREATED</span>
            </div>
          </div>

          {/* Table Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto">
            {/* Row 1: Critical */}
            <div className="grid grid-cols-12 gap-4 px-[20px] py-4 border-b border-[#262626] hover:bg-[#262626] items-center transition-colors relative cursor-pointer group">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-error"></div>
              <div className="col-span-2 flex items-center gap-2">
                <input className="w-4 h-4 rounded bg-[#0a0a0a] border-[#424754] text-primary focus:ring-primary/50 focus:ring-offset-0" type="checkbox" />
                <span className="font-mono-sm text-mono-sm text-on-surface group-hover:text-primary transition-colors">GRV-24-0891</span>
              </div>
              <div className="col-span-3 pr-4">
                <p className="font-body-sm text-body-sm text-on-surface truncate">Alleged discrimination in grading by Prof. Smith during final exams.</p>
                <p className="font-body-sm text-body-sm text-outline-variant text-[11px] mt-0.5 truncate">Submitted by: Jane D. (Student ID: 89012)</p>
              </div>
              <div className="col-span-1">
                <span className="px-2 py-1 rounded bg-surface-variant text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider">Academic</span>
              </div>
              <div className="col-span-2 flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <span className="font-label-md text-label-md text-primary">98% Match</span>
                </div>
                <span className="font-body-sm text-[11px] text-outline-variant truncate">Pattern detected: 3 similar cases</span>
              </div>
              <div className="col-span-1">
                <span className="px-2 py-1 rounded bg-error/10 text-error border border-error/20 font-label-md text-[10px] uppercase tracking-wider flex items-center justify-center w-fit gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                  Critical
                </span>
              </div>
              <div className="col-span-1">
                <span className="font-body-sm text-body-sm text-on-surface">In-Review</span>
              </div>
              <div className="col-span-2 flex flex-col items-end justify-center">
                <span className="font-mono-sm text-mono-sm text-error font-medium">0h 45m left</span>
                <span className="font-body-sm text-[11px] text-outline-variant">Today, 08:30 AM</span>
              </div>
            </div>

            {/* Row 2: Medium */}
            <div className="grid grid-cols-12 gap-4 px-[20px] py-4 border-b border-[#262626] hover:bg-[#262626] items-center transition-colors cursor-pointer group">
              <div className="col-span-2 flex items-center gap-2">
                <input className="w-4 h-4 rounded bg-[#0a0a0a] border-[#424754] text-primary focus:ring-primary/50 focus:ring-offset-0" type="checkbox" />
                <span className="font-mono-sm text-mono-sm text-on-surface group-hover:text-primary transition-colors">GRV-24-0889</span>
              </div>
              <div className="col-span-3 pr-4">
                <p className="font-body-sm text-body-sm text-on-surface truncate">Maintenance request for broken heater in Dorm B, Room 402.</p>
                <p className="font-body-sm text-body-sm text-outline-variant text-[11px] mt-0.5 truncate">Submitted by: Mark T. (Student ID: 44321)</p>
              </div>
              <div className="col-span-1">
                <span className="px-2 py-1 rounded bg-surface-variant text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider">Facilities</span>
              </div>
              <div className="col-span-2 flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-outline-variant text-xs" style={{ fontVariationSettings: "'FILL' 0" }}>auto_awesome</span>
                  <span className="font-label-md text-label-md text-outline-variant">65% Match</span>
                </div>
                <span className="font-body-sm text-[11px] text-outline-variant truncate">Standard routing applied</span>
              </div>
              <div className="col-span-1">
                <span className="px-2 py-1 rounded bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20 font-label-md text-[10px] uppercase tracking-wider flex items-center justify-center w-fit gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                  Medium
                </span>
              </div>
              <div className="col-span-1">
                <span className="font-body-sm text-body-sm text-on-surface">Assigned</span>
              </div>
              <div className="col-span-2 flex flex-col items-end justify-center">
                <span className="font-mono-sm text-mono-sm text-on-surface">12h 30m left</span>
                <span className="font-body-sm text-[11px] text-outline-variant">Yesterday, 14:15</span>
              </div>
            </div>

            {/* Row 3: High */}
            <div className="grid grid-cols-12 gap-4 px-[20px] py-4 border-b border-[#262626] hover:bg-[#262626] items-center transition-colors relative cursor-pointer group">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"></div>
              <div className="col-span-2 flex items-center gap-2">
                <input className="w-4 h-4 rounded bg-[#0a0a0a] border-[#424754] text-primary focus:ring-primary/50 focus:ring-offset-0" type="checkbox" />
                <span className="font-mono-sm text-mono-sm text-on-surface group-hover:text-primary transition-colors">GRV-24-0885</span>
              </div>
              <div className="col-span-3 pr-4">
                <p className="font-body-sm text-body-sm text-on-surface truncate">Dispute over tuition fee refund policy misinterpretation.</p>
                <p className="font-body-sm text-body-sm text-outline-variant text-[11px] mt-0.5 truncate">Submitted by: Sarah K. (Student ID: 11290)</p>
              </div>
              <div className="col-span-1">
                <span className="px-2 py-1 rounded bg-surface-variant text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider">Financial</span>
              </div>
              <div className="col-span-2 flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <span className="font-label-md text-label-md text-primary">82% Match</span>
                </div>
                <span className="font-body-sm text-[11px] text-primary truncate">Policy exception likely</span>
              </div>
              <div className="col-span-1">
                <span className="px-2 py-1 rounded bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20 font-label-md text-[10px] uppercase tracking-wider flex items-center justify-center w-fit gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                  High
                </span>
              </div>
              <div className="col-span-1">
                <span className="font-body-sm text-body-sm text-on-surface">New</span>
              </div>
              <div className="col-span-2 flex flex-col items-end justify-center">
                <span className="font-mono-sm text-mono-sm text-tertiary-container font-medium">3h 15m left</span>
                <span className="font-body-sm text-[11px] text-outline-variant">Yesterday, 09:00</span>
              </div>
            </div>
          </div>

          {/* Table Footer / Pagination */}
          <div className="border-t border-[#262626] p-4 flex justify-between items-center bg-[#171717] mt-auto">
            <span className="font-body-sm text-body-sm text-outline-variant">Showing 1-10 of 142 cases</span>
            <div className="flex gap-2">
              <button className="p-1 rounded bg-[#262626] text-outline-variant hover:text-on-surface disabled:opacity-50"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_left</span></button>
              <button className="p-1 rounded bg-[#262626] text-outline-variant hover:text-on-surface"><span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span></button>
            </div>
          </div>
        </div>
      </div>
    </AuthorityLayout>
  );
};

export default GrievanceQueue;
