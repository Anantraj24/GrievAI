import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EscalationWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="p-6 w-full max-w-7xl mx-auto flex-1 overflow-y-auto">
      {/* Page Header */}
      <div className="mb-8 mt-4">
        <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-2">
          <button onClick={() => navigate(-1)} className="hover:text-primary transition-colors cursor-pointer">
            Grievances
          </button>
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
          <span>{id || 'GRV-2023-8942'}</span>
        </div>
        
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-on-surface flex items-center gap-3">
              Escalation Workspace
              <span className="px-2.5 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#df7412] border border-[#f59e0b]/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span> 
                Action Required
              </span>
            </h2>
            <p className="text-sm text-on-surface-variant mt-1 max-w-2xl">
              Review case details and select target authority level. This action will transfer primary custody of the grievance.
            </p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#262626] border border-[#424754] text-on-surface px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#1d2027] transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>close</span> Cancel
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Details & Form (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Routing Info Bento */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-5">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>route</span> Custody Transfer Request
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-6 relative">
              {/* Connecting Line (Visual) */}
              <div className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-px bg-[#424754] z-0"></div>
              <div className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border border-[#424754] flex items-center justify-center z-10">
                <span className="material-symbols-outlined text-xs text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
              </div>
              
              {/* Current Authority */}
              <div className="flex-1 bg-[#191b23] border border-[#424754] rounded-lg p-4 z-10">
                <span className="text-xs font-bold text-on-surface-variant block mb-2 uppercase">Current Authority</span>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded bg-[#32353c] flex items-center justify-center text-on-surface text-sm font-bold">L1</div>
                  <div>
                    <h4 className="text-sm font-medium text-on-surface">Regional Support Desk</h4>
                    <p className="font-mono text-xs text-on-surface-variant">Dept: Customer Ops</p>
                  </div>
                </div>
              </div>
              
              {/* Target Authority */}
              <div className="flex-1 bg-[#f59e0b]/5 border border-[#df7412]/30 rounded-lg p-4 relative overflow-hidden z-10">
                {/* Subtle gradient for warning focus */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#df7412]/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                <span className="text-xs font-bold text-[#df7412] block mb-2 flex items-center gap-1 uppercase">
                  Escalation Target <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 0" }}>edit</span>
                </span>
                <div className="relative">
                  <select className="w-full bg-[#0a0a0a] border border-[#262626] rounded-md px-3 py-2 text-sm text-on-surface focus:border-[#df7412] focus:ring-1 focus:ring-[#df7412] outline-none appearance-none cursor-pointer">
                    <option>L2 - Compliance Review Board</option>
                    <option>L3 - Executive Steering Committee</option>
                    <option>Legal Counsel (External)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Escalation Form Bento */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-5">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>description</span> Escalation Justification
            </h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-on-surface mb-2">Primary Escalation Reason</label>
                <div className="relative">
                  <select className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer" defaultValue="">
                    <option disabled value="">Select primary reason...</option>
                    <option value="sla">SLA Breach Imminent (High Risk)</option>
                    <option value="complexity">Complexity Exceeds Current Tier</option>
                    <option value="regulatory">Requires Regulatory Intervention</option>
                    <option value="blockers">Cross-Departmental Blockers</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-on-surface mb-2">Detailed Synopsis (Internal Only)</label>
                <textarea 
                  className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none" 
                  placeholder="Provide context for the next tier. Why is standard resolution not viable?" 
                  rows={4}
                ></textarea>
              </div>
              
              {/* AI Context Suggestion */}
              <div className="bg-[#3b82f6]/5 border border-[#3b82f6]/20 rounded-lg p-4 flex gap-3 mt-2 border-l-2 border-l-primary">
                <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <div>
                  <p className="text-sm text-on-surface"><strong>AI Suggestion:</strong> Based on the grievance text, this case involves potential PII exposure. Consider adding "Data Privacy Review Needed" to the synopsis.</p>
                  <button className="text-primary text-xs font-bold uppercase mt-2 hover:underline">Apply Context</button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Bar */}
          <div className="flex justify-end pt-4">
            <button className="bg-[#df7412] hover:bg-[#c2640e] text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(223,116,18,0.3)]">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>upload</span> Escalate Grievance
            </button>
          </div>
        </div>

        {/* Right Column: SLA & History (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* SLA Status Bento */}
          <div className="bg-[#171717] border border-[#df7412]/30 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 bg-[#df7412] h-full"></div>
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>timer</span> SLA Countdown
            </h3>
            
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl text-[#df7412] font-bold leading-none font-display-lg">04</span>
              <span className="text-sm text-on-surface-variant pb-1">hrs</span>
              <span className="text-4xl text-[#df7412] font-bold leading-none font-display-lg ml-2">12</span>
              <span className="text-sm text-on-surface-variant pb-1">mins</span>
            </div>
            
            <p className="text-sm text-on-surface-variant mb-4">Until mandatory L1 resolution breach.</p>
            
            <div className="w-full bg-[#262626] rounded-full h-1.5 mb-2">
              <div className="bg-[#df7412] h-1.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
            
            <div className="flex justify-between font-mono text-[10px] text-on-surface-variant">
              <span>Created: Oct 24</span>
              <span className="text-[#df7412]">Breach: Today, 17:00</span>
            </div>
          </div>
          
          {/* History Timeline Bento */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-5 flex-1">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>history</span> Escalation History
            </h3>
            
            <div className="relative border-l border-[#262626] ml-3 space-y-6">
              {/* Timeline Item 1 */}
              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#262626] border-2 border-background"></div>
                <div className="mb-1 flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Assigned to L1</span>
                  <span className="font-mono text-on-surface-variant text-[10px]">Oct 24, 09:15</span>
                </div>
                <p className="text-sm text-on-surface-variant">System auto-routed based on initial categorization.</p>
              </div>
              
              {/* Timeline Item 2 */}
              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#262626] border-2 border-background"></div>
                <div className="mb-1 flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Status: In Progress</span>
                  <span className="font-mono text-on-surface-variant text-[10px]">Oct 25, 11:30</span>
                </div>
                <p className="text-sm text-on-surface-variant">Agent Sarah J. began review process.</p>
              </div>
              
              {/* Timeline Item 3 (Current) */}
              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#df7412] border-2 border-background shadow-[0_0_8px_rgba(223,116,18,0.5)]"></div>
                <div className="mb-1 flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#df7412]">Escalation Initiated</span>
                  <span className="font-mono text-on-surface-variant text-[10px]">Just Now</span>
                </div>
                <p className="text-sm text-on-surface-variant">Drafting transfer request to higher tier.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EscalationWorkspace;
