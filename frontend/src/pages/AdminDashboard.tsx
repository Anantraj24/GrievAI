import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { GrievanceService } from '../services/grievanceService';
import { AdminService } from '../services/adminService';
import { Grievance, Department, InstitutionalIssue } from '../types';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';

const AdminDashboard: React.FC = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [issues, setIssues] = useState<InstitutionalIssue[]>([]);

  useEffect(() => {
    setGrievances(GrievanceService.getAll());
    setDepartments(AdminService.getDepartments());
    setIssues(AdminService.getInstitutionalIssues());
  }, []);

  const total = grievances.length;
  const critical = grievances.filter((g) => g.priority === 'CRITICAL' && g.status !== 'resolved').length;
  const resolved = grievances.filter((g) => g.status === 'resolved').length;
  const inProgress = grievances.filter((g) => g.status === 'in_progress' || g.status === 'under_review').length;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Institutional Governance & Ombudsman Node
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Executive Command Center</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/analytics"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">analytics</span>
              Open Deep Analytics
            </Link>
          </div>
        </div>

        {/* Executive KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Institutional Volume */}
          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[10px] font-mono uppercase tracking-wider">Total Volume</span>
              <span className="material-symbols-outlined text-blue-400 text-xl">folder_shared</span>
            </div>
            <div className="text-3xl font-bold font-mono text-white mt-4">{total}</div>
            <p className="text-[10px] text-gray-500 font-mono mt-1">+14% vs previous semester</p>
          </div>

          {/* Critical Open Emergencies */}
          <div className="bg-[#10131a] border border-red-500/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold">Active Critical</span>
              <span className="material-symbols-outlined text-red-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                emergency
              </span>
            </div>
            <div className="text-3xl font-bold font-mono text-red-400 mt-4">{critical}</div>
            <p className="text-[10px] text-red-400/80 font-mono mt-1">Requires Ombudsman review</p>
          </div>

          {/* AI Auto-Triage Accuracy */}
          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[10px] font-mono uppercase tracking-wider">AI Triage Rate</span>
              <span className="material-symbols-outlined text-purple-400 text-xl">auto_awesome</span>
            </div>
            <div className="text-3xl font-bold font-mono text-purple-400 mt-4">98.4%</div>
            <p className="text-[10px] text-gray-500 font-mono mt-1">Autonomous category assignment</p>
          </div>

          {/* Resolved & Closed */}
          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[10px] font-mono uppercase tracking-wider">Resolved Cases</span>
              <span className="material-symbols-outlined text-emerald-400 text-xl">task_alt</span>
            </div>
            <div className="text-3xl font-bold font-mono text-emerald-400 mt-4">{resolved}</div>
            <p className="text-[10px] text-emerald-400/80 font-mono mt-1">{inProgress} currently in remediation</p>
          </div>
        </div>

        {/* Systemic Institutional Issue Alert Banner */}
        {issues.length > 0 && (
          <div className="bg-gradient-to-r from-amber-950/40 via-[#10131a] to-[#10131a] border border-amber-500/40 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">Campus Anomaly Cluster Detected</h4>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                    {issues[0].affectedStudentsCount} Students Impacted
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1">{issues[0].title}</p>
              </div>
            </div>

            <Link
              to={`/admin/issues/${issues[0].id}`}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/30 shrink-0"
            >
              Inspect Cluster →
            </Link>
          </div>
        )}

        {/* 2-Column Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Live Grievance Feed (Left 8 cols) */}
          <div className="lg:col-span-8 bg-[#10131a] border border-[#2D3139] rounded-2xl flex flex-col overflow-hidden shadow-xl">
            <div className="p-5 border-b border-[#262626] flex justify-between items-center bg-[#12151c]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-lg">stream</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Institutional Grievance Stream</h3>
              </div>
              <span className="text-[10px] font-mono text-gray-500 uppercase">Real-Time Ingestion</span>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[620px]">
                <thead>
                  <tr className="border-b border-[#262626] bg-[#0d1017] text-[10px] font-mono uppercase text-gray-400 tracking-wider">
                    <th className="py-3 px-5">Docket ID & Student</th>
                    <th className="py-3 px-4">Category & Department</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-5 text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c202a] text-xs">
                  {grievances.slice(0, 6).map((g) => (
                    <tr key={g.id} className="hover:bg-[#171b26] transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="font-mono text-amber-400 font-bold block">{g.id}</span>
                        <span className="text-gray-200 font-medium">{g.studentName}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-gray-200 font-semibold block">{g.department}</span>
                        <span className="text-[11px] text-gray-400">{g.subcategory}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={g.priority} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={g.status} />
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          to={`/authority/workspace/${g.id}`}
                          className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-semibold transition-all inline-flex items-center gap-1"
                        >
                          Dossier
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Department Efficiency Leaderboard (Right 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 flex flex-col gap-3 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase text-gray-400">Department SLA Index</h3>
                <Link to="/admin/departments" className="text-xs text-amber-400 hover:underline">
                  Manage →
                </Link>
              </div>

              <div className="flex flex-col gap-3">
                {departments.map((d) => (
                  <div key={d.id} className="p-3 rounded-xl bg-[#171717] border border-[#262626] flex flex-col gap-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white truncate">{d.name}</span>
                      <span className="font-mono text-emerald-400 font-bold">{d.slaComplianceRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                      <span>Caseload: {d.activeCaseload} active</span>
                      <span>Target: {d.targetResolutionHours}h</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          d.slaComplianceRate > 92 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${d.slaComplianceRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
