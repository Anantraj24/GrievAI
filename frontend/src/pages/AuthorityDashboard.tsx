import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthorityLayout from '../components/AuthorityLayout';
import { useAuth } from '../context/AuthContext';
import { GrievanceService } from '../services/grievanceService';
import { Grievance } from '../types';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';

const AuthorityDashboard: React.FC = () => {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState<Grievance[]>([]);

  useEffect(() => {
    const list = GrievanceService.getAll();
    setGrievances(list);
  }, []);

  const urgentQueue = grievances
    .filter((g) => g.status !== 'resolved' && g.status !== 'duplicate_closed' && g.status !== 'closed')
    .sort((a, b) => (a.priority === 'CRITICAL' ? -1 : b.priority === 'CRITICAL' ? 1 : 0));

  const pendingCount = grievances.filter((g) => g.status === 'submitted' || g.status === 'under_review').length;
  const inProgressCount = grievances.filter((g) => g.status === 'in_progress').length;
  const criticalCount = grievances.filter((g) => g.priority === 'CRITICAL' && g.status !== 'resolved').length;
  const resolvedCount = grievances.filter((g) => g.status === 'resolved').length;

  return (
    <AuthorityLayout>
      <div className="flex flex-col gap-6 w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              {user?.department || 'Department Review Authority'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Operational Case Command
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/authority/queue"
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">assignment_late</span>
              Review Active Queue ({urgentQueue.length})
            </Link>
          </div>
        </div>

        {/* Operational Metrics Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Critical Attention */}
          <div className="bg-[#10131a] border border-red-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold">Critical Priority</span>
              <span className="material-symbols-outlined text-red-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                emergency
              </span>
            </div>
            <div className="text-3xl font-bold font-mono text-red-400 mt-4">{criticalCount}</div>
            <span className="text-[10px] text-gray-400 font-mono mt-1">&lt;12h resolution SLA threshold</span>
          </div>

          {/* Pending Triage */}
          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Pending Review</span>
              <span className="material-symbols-outlined text-amber-400 text-xl">pending_actions</span>
            </div>
            <div className="text-3xl font-bold font-mono text-white mt-4">{pendingCount}</div>
            <span className="text-[10px] text-gray-400 font-mono mt-1">Awaiting authority validation</span>
          </div>

          {/* In Remediation */}
          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">In Remediation</span>
              <span className="material-symbols-outlined text-blue-400 text-xl">construction</span>
            </div>
            <div className="text-3xl font-bold font-mono text-blue-400 mt-4">{inProgressCount}</div>
            <span className="text-[10px] text-gray-400 font-mono mt-1">Work permit dispatched</span>
          </div>

          {/* Resolved Month-to-Date */}
          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Resolved</span>
              <span className="material-symbols-outlined text-emerald-400 text-xl">verified</span>
            </div>
            <div className="text-3xl font-bold font-mono text-emerald-400 mt-4">{resolvedCount}</div>
            <span className="text-[10px] text-gray-400 font-mono mt-1">94.8% CSAT satisfaction</span>
          </div>
        </div>

        {/* Urgent Triage Queue & Department Workload */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Urgent Cases Table (Left 8 cols) */}
          <div className="lg:col-span-8 bg-[#10131a] border border-[#2D3139] rounded-2xl flex flex-col overflow-hidden shadow-xl">
            <div className="p-5 border-b border-[#262626] flex justify-between items-center bg-[#12151c]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-400 text-lg">bolt</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Priority Triage Queue</h3>
              </div>
              <Link to="/authority/queue" className="text-xs text-purple-400 hover:text-purple-300 font-semibold">
                Open Queue Matrix →
              </Link>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[620px]">
                <thead>
                  <tr className="border-b border-[#262626] bg-[#0d1017] text-[10px] font-mono uppercase text-gray-400 tracking-wider">
                    <th className="py-3.5 px-5">Case Identifier</th>
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c202a] text-xs">
                  {urgentQueue.slice(0, 5).map((g) => (
                    <tr key={g.id} className="hover:bg-[#171b26] transition-colors group">
                      <td className="py-3.5 px-5">
                        <Link to={`/authority/workspace/${g.id}`} className="font-mono text-purple-400 font-bold group-hover:text-purple-300">
                          {g.id}
                        </Link>
                        <span className="text-[10px] text-gray-500 block font-mono">{g.studentName}</span>
                      </td>
                      <td className="py-3.5 px-4 min-w-[200px]">
                        <p className="text-gray-200 font-medium truncate max-w-xs">{g.title}</p>
                        <p className="text-[10px] text-gray-400 truncate">{g.location}</p>
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
                          className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold transition-all inline-flex items-center gap-1"
                        >
                          Review Case
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fast Actions & AI Insights (Right 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* AI Autonomous Triage Summary */}
            <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 flex flex-col gap-3 shadow-xl">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold uppercase text-purple-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                  NLP Triage Engine
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Online</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                98.2% of newly submitted complaints this week were auto-routed with zero manual sorting delay.
              </p>
              <div className="pt-2 border-t border-[#262626] flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Mean Routing Time:</span>
                <span className="text-white font-bold">140ms</span>
              </div>
            </div>

            {/* Quick Authority Navigation */}
            <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 flex flex-col gap-3 shadow-xl">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400">Authority Workspaces</h4>
              <div className="flex flex-col gap-2">
                <Link
                  to="/authority/queue"
                  className="p-3 rounded-xl bg-[#171717] hover:bg-[#202430] border border-[#262626] text-xs font-semibold text-white flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-purple-400">list_alt</span>
                    Assigned Grievances Queue
                  </span>
                  <span className="material-symbols-outlined text-sm text-gray-500">chevron_right</span>
                </Link>

                <Link
                  to="/authority/analytics"
                  className="p-3 rounded-xl bg-[#171717] hover:bg-[#202430] border border-[#262626] text-xs font-semibold text-white flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-blue-400">query_stats</span>
                    Department Performance Analytics
                  </span>
                  <span className="material-symbols-outlined text-sm text-gray-500">chevron_right</span>
                </Link>

                <Link
                  to="/authority/settings"
                  className="p-3 rounded-xl bg-[#171717] hover:bg-[#202430] border border-[#262626] text-xs font-semibold text-white flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-gray-400">settings</span>
                    Resolution Threshold Settings
                  </span>
                  <span className="material-symbols-outlined text-sm text-gray-500">chevron_right</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthorityLayout>
  );
};

export default AuthorityDashboard;
