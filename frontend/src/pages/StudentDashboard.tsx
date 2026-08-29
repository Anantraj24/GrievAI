import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { GrievanceService } from '../services/grievanceService';
import { NotificationService } from '../services/notificationService';
import { Grievance, SystemNotification } from '../types';
import { StatusBadge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  useEffect(() => {
    const list = GrievanceService.getByStudent(user?.id);
    setGrievances(list);
    const notifs = NotificationService.getForUser('student', user?.id);
    setNotifications(notifs.slice(0, 5));
  }, [user?.id]);

  const totalCount = grievances.length;
  const activeCount = grievances.filter((g) => g.status === 'in_progress' || g.status === 'submitted').length;
  const reviewCount = grievances.filter((g) => g.status === 'under_review' || g.status === 'information_requested').length;
  const resolvedCount = grievances.filter((g) => g.status === 'resolved' || g.status === 'closed').length;

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(grievances, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `GrievAI_Student_Report_${user?.studentId || 'Report'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Grievance dossier report exported successfully');
  };

  return (
    <Layout userRoleLabel="Student Portal" userName={user?.name || 'Student'}>
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}
          </h2>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Real-time status overview of your academic, facility, and administrative grievance cases.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="border border-[#2D3139] bg-[#10131a] hover:bg-[#171717] text-gray-200 text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm text-blue-400">download</span>
            Export Dossier
          </button>
          <Link
            to="/student/submit"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Case
          </Link>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-fr">
        {/* Metric Cards (Cols 1-8) */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Total Cases */}
          <Link
            to="/student/grievances"
            className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/50 hover:bg-[#141822] transition-all group shadow-xl"
          >
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Total Filed</span>
              <span className="material-symbols-outlined text-blue-400 group-hover:scale-110 transition-transform">
                folder
              </span>
            </div>
            <div className="text-3xl font-bold font-mono text-white mt-4">{totalCount}</div>
          </Link>

          {/* Active Cases */}
          <Link
            to="/student/grievances?status=in_progress"
            className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/50 hover:bg-[#141822] transition-all group shadow-xl"
          >
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Active</span>
              <span className="material-symbols-outlined text-blue-400 group-hover:scale-110 transition-transform">
                bolt
              </span>
            </div>
            <div className="text-3xl font-bold font-mono text-blue-400 mt-4">{activeCount}</div>
          </Link>

          {/* Under Review */}
          <Link
            to="/student/grievances?status=under_review"
            className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/50 hover:bg-[#141822] transition-all group shadow-xl"
          >
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">In Review</span>
              <span className="material-symbols-outlined text-amber-400 group-hover:scale-110 transition-transform">
                pending_actions
              </span>
            </div>
            <div className="text-3xl font-bold font-mono text-amber-300 mt-4">{reviewCount}</div>
          </Link>

          {/* Resolved */}
          <Link
            to="/student/grievances?status=resolved"
            className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/50 hover:bg-[#141822] transition-all group shadow-xl"
          >
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Resolved</span>
              <span className="material-symbols-outlined text-emerald-400 group-hover:scale-110 transition-transform">
                task_alt
              </span>
            </div>
            <div className="text-3xl font-bold font-mono text-emerald-400 mt-4">{resolvedCount}</div>
          </Link>
        </div>

        {/* Submit Grievance CTA Card (Cols 9-12) */}
        <div className="md:col-span-4 bg-gradient-to-br from-[#121b2d] to-[#10131a] border border-blue-500/30 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-mono font-semibold uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                AI-Assisted Filing
              </div>
              <h3 className="text-lg font-bold text-white mb-1">File a New Grievance</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Autonomous triaging will classify, detect duplicates, and route your case directly to department chairs.
              </p>
            </div>
            <Link
              to="/student/submit"
              className="mt-5 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-98"
            >
              <span className="material-symbols-outlined text-sm">edit_document</span>
              Start Grievance Form
            </Link>
          </div>
        </div>

        {/* Recent Grievances List (Cols 1-8) */}
        <div className="md:col-span-8 bg-[#10131a] border border-[#2D3139] rounded-2xl flex flex-col overflow-hidden shadow-xl">
          <div className="p-5 border-b border-[#262626] flex justify-between items-center bg-[#12151c]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400 text-lg">history</span>
              <h3 className="text-sm font-bold text-white">Recent Case Submissions</h3>
            </div>
            <Link
              to="/student/grievances"
              className="text-blue-400 hover:text-blue-300 text-xs font-semibold transition-colors flex items-center gap-1"
            >
              View All Grievances
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            {grievances.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 italic">
                No grievances filed yet. Click "File a New Grievance" above to submit one.
              </div>
            ) : (
              <div className="min-w-[600px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#262626] bg-[#0d1017] text-[10px] font-mono uppercase text-gray-400 tracking-wider">
                  <div className="col-span-4">Case ID / Subject</div>
                  <div className="col-span-3">Department</div>
                  <div className="col-span-3">Status</div>
                  <div className="col-span-2 text-right">Filed Date</div>
                </div>
                {/* Rows */}
                <div className="divide-y divide-[#1c202a]">
                  {grievances.slice(0, 5).map((g) => (
                    <Link
                      key={g.id}
                      to={`/student/grievance/${g.id}`}
                      className="grid grid-cols-12 gap-4 px-5 py-3.5 hover:bg-[#171b26] transition-colors items-center group text-xs"
                    >
                      <div className="col-span-4 flex flex-col min-w-0">
                        <span className="font-mono text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
                          {g.id}
                        </span>
                        <span className="text-gray-200 truncate font-medium">{g.title}</span>
                      </div>
                      <div className="col-span-3 text-gray-400 text-xs truncate">{g.department}</div>
                      <div className="col-span-3">
                        <StatusBadge status={g.status} />
                      </div>
                      <div className="col-span-2 text-right font-mono text-[11px] text-gray-400">
                        {g.createdAt.slice(0, 10)}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Notification Feed (Cols 9-12) */}
        <div className="md:col-span-4 bg-[#10131a] border border-[#2D3139] rounded-2xl flex flex-col overflow-hidden shadow-xl">
          <div className="p-5 border-b border-[#262626] flex justify-between items-center bg-[#12151c]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400 text-lg">notifications_active</span>
              <h3 className="text-sm font-bold text-white">Live Updates</h3>
            </div>
            <Link to="/student/notifications" className="text-xs text-gray-400 hover:text-white">
              Inbox ({notifications.filter((n) => !n.read).length})
            </Link>
          </div>

          <div className="overflow-y-auto flex-1 p-4 space-y-3 max-h-[360px]">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-500 italic">No new notifications.</div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  to={n.link || '/student/notifications'}
                  className={`flex gap-3 p-3 rounded-xl border transition-all ${
                    !n.read ? 'bg-blue-950/20 border-blue-500/30' : 'bg-[#141720] border-[#262626] opacity-80'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      n.type === 'success'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : n.type === 'alert'
                        ? 'bg-red-500/20 text-red-400'
                        : n.type === 'warning'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {n.type === 'success' ? 'check_circle' : n.type === 'alert' ? 'emergency' : 'update'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white leading-tight">{n.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                    <span className="text-[9px] font-mono text-gray-500 block mt-1">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StudentDashboard;
