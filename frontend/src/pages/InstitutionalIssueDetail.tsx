import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { AdminService } from '../services/adminService';
import { GrievanceService } from '../services/grievanceService';
import { NotificationService } from '../services/notificationService';
import { InstitutionalIssue, Grievance } from '../types';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';

export const InstitutionalIssueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [issue, setIssue] = useState<InstitutionalIssue | null>(null);
  const [linkedGrievances, setLinkedGrievances] = useState<Grievance[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState(
    'Estate maintenance contractor is currently on site repairing Chiller Loop 2. Air conditioning in CS Block 4 will resume full operation by 18:00 hrs.'
  );
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const issues = AdminService.getInstitutionalIssues();
    const found = issues.find((i) => i.id === id) || issues[0];
    if (found) {
      setIssue(found);
      const all = GrievanceService.getAll();
      const linked = all.filter((g) => (found.linkedGrievanceIds || []).includes(g.id));
      setLinkedGrievances(linked);
    }
  }, [id]);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim() || !issue) return;

    setIsBroadcasting(true);
    setTimeout(() => {
      // Dispatch notification to students
      NotificationService.create({
        recipientRole: 'student',
        title: `Campus Advisory: Update on ${issue.title}`,
        message: broadcastMessage,
        type: 'info',
        link: '/student/grievances',
      });

      toast.success(`Mass campus broadcast dispatched to all ${issue.affectedStudentsCount} affected students!`);
      setIsBroadcasting(false);
    }, 400);
  };

  const handleResolveAll = () => {
    if (!issue) return;
    linkedGrievances.forEach((g) => {
      GrievanceService.resolve(
        g.id,
        'Campus Ombudsman',
        `Resolved via Master Cluster ${issue.id}: ${issue.title}`,
        'Estate Maintenance'
      );
    });
    toast.success(`Master cluster ${issue.id} marked as RESOLVED and all linked student dockets updated!`);
    navigate('/admin/issues');
  };

  if (!issue) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-gray-400">Loading issue dossier...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
        {/* Navigation */}
        <div className="flex items-center justify-between text-xs font-mono text-gray-400">
          <Link to="/admin/issues" className="hover:text-white flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to All Clusters
          </Link>
          <span className="text-amber-400 font-bold">{issue.id}</span>
        </div>

        {/* Master Dossier Header */}
        <div className="bg-[#10131a] border border-amber-500/30 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-amber-400">{issue.id}</span>
                <span className="text-gray-500">•</span>
                <span className="text-xs text-gray-300">{issue.department}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{issue.title}</h1>
            </div>

            <div className="flex items-center gap-2.5">
              <PriorityBadge priority={issue.severity} size="md" />
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-bold border border-blue-500/30">
                {issue.affectedStudentsCount} Students Impacted
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-200 leading-relaxed">{issue.description}</p>

          <div className="flex items-center justify-between pt-2 border-t border-[#262626] flex-wrap gap-2">
            <span className="text-xs font-mono text-gray-400">Detected: {(issue.detectedAt || issue.createdAt || '').slice(0, 10)}</span>
            <button
              onClick={handleResolveAll}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">verified</span>
              Resolve All Linked Cases ({linkedGrievances.length})
            </button>
          </div>
        </div>

        {/* Mass Broadcast Broadcaster Box */}
        <form onSubmit={handleBroadcast} className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-lg">campaign</span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Mass Broadcast to Affected Students
            </h3>
          </div>
          <p className="text-xs text-gray-400">
            Dispatch an official university progress bulletin to the inboxes of all students tied to this cluster.
          </p>

          <textarea
            required
            rows={3}
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3.5 focus:outline-none focus:border-amber-500 resize-none font-mono leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isBroadcasting || !broadcastMessage.trim()}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-600/30 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              {isBroadcasting ? 'Broadcasting...' : 'Broadcast Mass Advisory'}
            </button>
          </div>
        </form>

        {/* Linked Grievances List */}
        <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl flex flex-col overflow-hidden shadow-xl">
          <div className="p-5 border-b border-[#262626] bg-[#12151c] flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Linked Student Grievance Dockets ({linkedGrievances.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-[#262626] bg-[#0d1017] text-[10px] font-mono uppercase text-gray-400 tracking-wider">
                  <th className="py-3 px-5">Case ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c202a] text-xs">
                {linkedGrievances.map((g) => (
                  <tr key={g.id} className="hover:bg-[#171b26] transition-colors">
                    <td className="py-3.5 px-5 font-mono text-amber-400 font-bold">{g.id}</td>
                    <td className="py-3.5 px-4 text-white font-medium">{g.studentName}</td>
                    <td className="py-3.5 px-4 text-gray-300 truncate max-w-xs">{g.title}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={g.status} />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        to={`/authority/workspace/${g.id}`}
                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        Inspect Dossier →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InstitutionalIssueDetail;
