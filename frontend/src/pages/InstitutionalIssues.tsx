import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { AdminService } from '../services/adminService';
import { InstitutionalIssue } from '../types';
import { PriorityBadge } from '../components/common/Badge';

export const InstitutionalIssues: React.FC = () => {
  const [issues, setIssues] = useState<InstitutionalIssue[]>([]);

  useEffect(() => {
    setIssues(AdminService.getInstitutionalIssues());
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Institutional Issue Clusters</h1>
            <p className="text-xs text-gray-400 mt-1">
              Consolidated macro-issues aggregating multiple student grievances for campus-wide remediation.
            </p>
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 gap-4">
          {issues.map((iss) => (
            <div
              key={iss.id}
              className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 flex flex-col gap-4 shadow-xl hover:border-amber-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262626] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400">{iss.id}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-xs text-gray-300 font-semibold">{iss.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {iss.affectedStudentsCount} Students Impacted
                  </span>
                  <PriorityBadge priority={iss.severity} />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{iss.title}</h3>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">{iss.description}</p>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-[#262626]">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                  <span>Linked Cases ({(iss.linkedGrievanceIds || []).length}):</span>
                  {(iss.linkedGrievanceIds || []).map((gid) => (
                    <span key={gid} className="px-2 py-0.5 rounded bg-[#262626] text-blue-400">
                      {gid}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/admin/issues/${iss.id}`}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/30 flex items-center gap-1.5"
                >
                  <span>Open Master Cluster</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default InstitutionalIssues;
