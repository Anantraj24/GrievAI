import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthorityLayout from '../components/AuthorityLayout';
import { api } from '../api/api';

interface Grievance {
  id: string;
  grievance_code: string;
  title: string | null;
  description: string;
  status: string;
  priority: string | null;
  created_at: string;
  sla_deadline: string | null;
}

const ResolutionWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    const fetchGrievance = async () => {
      try {
        const res = await api.get(`/api/v1/grievances/${id}`);
        setGrievance(res.data);
      } catch (err) {
        console.error("Failed to fetch grievance", err);
      }
    };
    if (id) fetchGrievance();
  }, [id]);

  const handleAIDraft = async () => {
    if (!internalNotes.trim()) {
      alert("Please provide some internal notes to generate a draft.");
      return;
    }
    setIsDrafting(true);
    try {
      const res = await api.post(`/api/v1/grievances/${id}/draft-response`, {
        resolution_notes: internalNotes
      });
      setResolutionSummary(res.data.draft);
    } catch (err) {
      console.error("Drafting failed", err);
      alert("Failed to generate draft. Ensure you have authority permissions.");
    } finally {
      setIsDrafting(false);
    }
  };

  const handleResolve = async () => {
    if (!resolutionSummary.trim()) {
      alert("Please provide a resolution summary.");
      return;
    }
    setIsResolving(true);
    try {
      await api.patch(`/api/v1/grievances/${id}/status`, {
        status: 'Resolved',
        resolution_notes: resolutionSummary
      });
      navigate('/authority/queue');
    } catch (err) {
      console.error("Resolution failed", err);
      alert("Failed to resolve grievance.");
    } finally {
      setIsResolving(false);
    }
  };

  if (!grievance) {
    return (
      <AuthorityLayout>
        <div className="flex-1 p-8 text-on-surface-variant flex items-center justify-center">Loading resolution workspace...</div>
      </AuthorityLayout>
    );
  }

  return (
    <AuthorityLayout>
      <div className="p-6 w-full max-w-7xl mx-auto flex-1 overflow-y-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="font-mono text-sm text-on-surface-variant mb-1">{grievance.grievance_code || grievance.id.substring(0,8)}</p>
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
                <span className="text-xs font-bold bg-[#272a31] px-2 py-1 rounded text-primary capitalize">{grievance.status.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#363941] pb-2">
                <span className="text-sm text-on-surface-variant">Priority</span>
                <span className="text-xs font-bold text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-1 rounded">{grievance.priority || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#363941] pb-2">
                <span className="text-sm text-on-surface-variant">Created</span>
                <span className="text-sm text-on-surface truncate max-w-[150px]">{new Date(grievance.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Assignee</span>
                <span className="text-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">account_circle</span>
                  Current User
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

              {/* Additional Notes */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-on-surface-variant">Internal Notes & Context</label>
                  <button 
                    type="button" 
                    onClick={handleAIDraft}
                    disabled={isDrafting}
                    className="text-xs font-bold text-primary flex items-center gap-1 hover:text-primary/80 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    {isDrafting ? 'Drafting...' : 'AI Auto-Draft'}
                  </button>
                </div>
                <input 
                  className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-3 text-sm text-on-surface w-full focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all" 
                  placeholder="E.g., Spoke to maintenance, part arrives tomorrow." 
                  type="text"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                />
              </div>

              {/* Resolution Summary */}
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm text-on-surface-variant">Resolution Summary <span className="text-[#ffb4ab]">*</span></label>
                <textarea 
                  className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-3 text-sm text-on-surface w-full flex-1 min-h-[200px] resize-none focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all" 
                  placeholder="Provide a detailed summary of how the grievance was addressed. You can use the AI Auto-Draft button above to generate this from your notes."
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex justify-end items-center gap-4 mt-4 pt-4 border-t border-[#363941]">
                <button 
                  className="text-xs font-bold text-on-surface-variant uppercase tracking-wider hover:text-on-surface transition-colors" 
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button 
                  className="bg-primary text-[#0a0a0a] px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50" 
                  type="button"
                  onClick={handleResolve}
                  disabled={isResolving}
                >
                  <span className="material-symbols-outlined text-[18px]">task_alt</span>
                  {isResolving ? 'Resolving...' : 'Mark as Resolved'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </AuthorityLayout>
  );
};

export default ResolutionWorkspace;
