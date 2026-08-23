import React from 'react';
import { useParams } from 'react-router-dom';

const ResolutionWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6 w-full max-w-7xl mx-auto flex-1 overflow-y-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="font-mono text-sm text-on-surface-variant mb-1">{id || 'GRV-2023-891'}</p>
          <h1 className="text-3xl font-bold text-on-surface font-display-lg">Resolution Workspace</h1>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-[#424754] text-on-surface rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#32353c] transition-colors">
            Save Draft
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Context & Metadata (Left Column) */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-4">
          
          {/* SLA Card */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-5 flex flex-col gap-4">
            <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">SLA Status</h2>
            <div className="flex items-center gap-3 bg-[#10b981]/10 p-3 rounded-lg border border-[#10b981]/20">
              <span className="material-symbols-outlined text-[#10b981]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <div>
                <p className="text-xs font-bold text-[#10b981] uppercase tracking-wider">On Track</p>
                <p className="font-mono text-xs text-on-surface-variant">Due: 24h 15m</p>
              </div>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-5 flex flex-col gap-4">
            <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Case Metadata</h2>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-[#363941] pb-2">
                <span className="text-sm text-on-surface-variant">Status</span>
                <span className="text-xs font-bold bg-[#272a31] px-2 py-1 rounded text-primary">In Progress</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#363941] pb-2">
                <span className="text-sm text-on-surface-variant">Priority</span>
                <span className="text-xs font-bold text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-1 rounded">High</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#363941] pb-2">
                <span className="text-sm text-on-surface-variant">Institution</span>
                <span className="text-sm text-on-surface truncate max-w-[150px]">Dept. of Transport</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Assignee</span>
                <span className="text-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">account_circle</span>
                  J. Doe
                </span>
              </div>
            </div>
          </div>

          {/* AI Context Card */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-5 border-l-2 border-l-primary shadow-[0_0_15px_rgba(173,198,255,0.1)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <span className="material-symbols-outlined text-primary text-[18px]">smart_toy</span>
              <h2 className="text-xs font-bold text-primary uppercase tracking-wider">AI Insight</h2>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed relative z-10">
              Based on similar resolved cases (GRV-2023-112, GRV-2022-84), recommended action involves issuing formal written communication and updating policy guidelines regarding operational delays.
            </p>
          </div>
        </div>

        {/* Resolution Form (Right Column) */}
        <div className="col-span-1 md:col-span-8 flex flex-col gap-4">
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-5 h-full flex flex-col">
            <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-6">Resolution Details</h2>
            <form className="flex flex-col gap-6 flex-1">
              
              {/* Actions Taken (Chips) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-on-surface-variant">Actions Taken</label>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-primary/20 border border-primary/30 text-primary rounded-full text-sm cursor-pointer flex items-center gap-1">
                    Policy Review <span className="material-symbols-outlined text-[14px]">close</span>
                  </span>
                  <span className="px-3 py-1.5 bg-primary/20 border border-primary/30 text-primary rounded-full text-sm cursor-pointer flex items-center gap-1">
                    Direct Communication <span className="material-symbols-outlined text-[14px]">close</span>
                  </span>
                  <span className="px-3 py-1.5 bg-[#1d2027] border border-[#424754] text-on-surface-variant rounded-full text-sm cursor-pointer hover:bg-[#272a31] transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">add</span> Add Action
                  </span>
                </div>
              </div>

              {/* Resolution Summary */}
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm text-on-surface-variant">Resolution Summary <span className="text-[#ffb4ab]">*</span></label>
                <textarea 
                  className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-3 text-sm text-on-surface w-full flex-1 min-h-[200px] resize-none focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all" 
                  placeholder="Provide a detailed summary of how the grievance was addressed..."
                ></textarea>
              </div>

              {/* Additional Notes */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-on-surface-variant">Internal Notes (Optional)</label>
                <input 
                  className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-3 text-sm text-on-surface w-full focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all" 
                  placeholder="Any internal metadata or non-public notes..." 
                  type="text"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end items-center gap-4 mt-4 pt-4 border-t border-[#363941]">
                <button className="text-xs font-bold text-on-surface-variant uppercase tracking-wider hover:text-on-surface transition-colors" type="button">
                  Cancel
                </button>
                <button className="bg-primary text-[#0a0a0a] px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors flex items-center gap-2" type="button">
                  <span className="material-symbols-outlined text-[18px]">task_alt</span>
                  Mark as Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResolutionWorkspace;
