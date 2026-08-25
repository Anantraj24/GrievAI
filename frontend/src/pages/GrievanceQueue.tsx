import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const GrievanceQueue: React.FC = () => {
  const navigate = useNavigate();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const res = await api.get('/api/v1/grievances/');
        setGrievances(res.data);
      } catch (err) {
        console.error("Failed to fetch grievances", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrievances();
  }, []);

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

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-on-surface-variant">Loading grievances...</div>
            ) : grievances.length === 0 ? (
              <div className="p-4 text-center text-on-surface-variant">No grievances found.</div>
            ) : (
              grievances.map((g) => (
                <div 
                  key={g.id}
                  onClick={() => navigate(`/authority/workspace/${g.id}`)}
                  className="grid grid-cols-12 gap-4 px-[20px] py-4 border-b border-[#262626] hover:bg-[#262626] items-center transition-colors relative cursor-pointer group"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${g.priority === 'Critical' ? 'bg-error' : g.priority === 'High' ? 'bg-primary' : 'bg-transparent'}`}></div>
                  <div className="col-span-2 flex items-center gap-2">
                    <input className="w-4 h-4 rounded bg-[#0a0a0a] border-[#424754] text-primary focus:ring-primary/50 focus:ring-offset-0" type="checkbox" onClick={(e) => e.stopPropagation()} />
                    <span className="font-mono-sm text-mono-sm text-on-surface group-hover:text-primary transition-colors">{g.grievance_code || g.id.substring(0,8)}</span>
                  </div>
                  <div className="col-span-3 pr-4">
                    <p className="font-body-sm text-body-sm text-on-surface truncate">{g.title || g.description.substring(0, 50)}</p>
                    <p className="font-body-sm text-body-sm text-outline-variant text-[11px] mt-0.5 truncate">Submitted by: Student</p>
                  </div>
                  <div className="col-span-1">
                    <span className="px-2 py-1 rounded bg-surface-variant text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider">Unknown</span>
                  </div>
                  <div className="col-span-2 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-outline-variant text-xs" style={{ fontVariationSettings: "'FILL' 0" }}>auto_awesome</span>
                      <span className="font-label-md text-label-md text-outline-variant">--</span>
                    </div>
                  </div>
                  <div className="col-span-1">
                    {g.priority && (
                      <span className={`px-2 py-1 rounded border font-label-md text-[10px] uppercase tracking-wider flex items-center justify-center w-fit gap-1
                        ${g.priority === 'Critical' ? 'bg-error/10 text-error border-error/20' : 
                          g.priority === 'High' ? 'bg-primary/10 text-primary border-primary/20' : 
                          'bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20'}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${g.priority === 'Critical' ? 'bg-error' : g.priority === 'High' ? 'bg-primary' : 'bg-tertiary-container'}`}></span>
                        {g.priority}
                      </span>
                    )}
                  </div>
                  <div className="col-span-1">
                    <span className="font-body-sm text-body-sm text-on-surface capitalize">{g.status.replace('_', ' ')}</span>
                  </div>
                  <div className="col-span-2 flex flex-col items-end justify-center">
                    {g.sla_deadline ? (
                      <span className="font-mono-sm text-mono-sm text-error font-medium">{new Date(g.sla_deadline).toLocaleDateString()}</span>
                    ) : (
                      <span className="font-mono-sm text-mono-sm text-on-surface-variant">No SLA</span>
                    )}
                    <span className="font-body-sm text-[11px] text-outline-variant">{new Date(g.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Table Footer / Pagination */}
          <div className="border-t border-[#262626] p-4 flex justify-between items-center bg-[#171717] mt-auto">
            <span className="font-body-sm text-body-sm text-outline-variant">Showing 1-{grievances.length} of {grievances.length} cases</span>
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
