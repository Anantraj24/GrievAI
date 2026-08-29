import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AuthorityLayout from '../components/AuthorityLayout';
import { useAuth } from '../context/AuthContext';
import { GrievanceService } from '../services/grievanceService';
import { Grievance, GrievanceStatus } from '../types';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { AIInsightCard } from '../components/common/AIInsightCard';
import { Timeline } from '../components/grievances/Timeline';
import { CommentThread } from '../components/grievances/CommentThread';
import { EvidenceGallery } from '../components/common/EvidenceGallery';
import { AIDraftEditor } from '../components/grievances/AIDraftEditor';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useToast } from '../context/ToastContext';

const Workspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'ai_draft' | 'timeline' | 'messages' | 'evidence'>('overview');

  const fetchGrievance = () => {
    if (!id) return;
    const item = GrievanceService.getById(id);
    if (item) {
      setGrievance(item);
    } else {
      toast.error(`Case #${id} not found.`);
      navigate('/authority/queue');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGrievance();
  }, [id]);

  if (loading || !grievance) {
    return (
      <AuthorityLayout>
        <LoadingSkeleton rows={6} />
      </AuthorityLayout>
    );
  }

  const handleStatusChange = (newStatus: GrievanceStatus) => {
    if (!grievance || !user) return;
    GrievanceService.updateStatus(grievance.id, newStatus, user.name, 'authority');
    toast.success(`Case #${grievance.id} status updated to ${newStatus.toUpperCase()}`);
    fetchGrievance();
  };

  const handleApproveDraft = (finalDraft: string) => {
    if (!grievance || !user) return;
    GrievanceService.resolve(
      grievance.id,
      user.name,
      'Approved official AI response dispatched to student.',
      grievance.category,
      finalDraft
    );
    toast.success(`Official response dispatched and Case #${grievance.id} marked as Resolved!`);
    fetchGrievance();
    navigate('/authority/queue');
  };

  return (
    <AuthorityLayout>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono text-gray-400">
          <Link to="/authority/queue" className="hover:text-white transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Queue
          </Link>
          <div className="flex items-center gap-2">
            <span>Authority Review Mode</span>
            <span>•</span>
            <span className="text-purple-400 font-bold font-mono">{grievance.id}</span>
          </div>
        </div>

        {/* Case Dossier Header */}
        <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 flex flex-col gap-5 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#262626] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-mono font-bold text-purple-400">{grievance.id}</span>
                <span className="text-gray-500">•</span>
                <span className="text-xs text-gray-300 font-medium">{grievance.studentName}</span>
                <span className="text-[11px] font-mono text-gray-500">({grievance.studentEmail})</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{grievance.title}</h1>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-auto">
              <PriorityBadge priority={grievance.priority} size="md" />
              <StatusBadge status={grievance.status} size="md" />
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              {grievance.status !== 'in_progress' && (
                <button
                  onClick={() => handleStatusChange('in_progress')}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">construction</span>
                  Mark In Progress
                </button>
              )}

              <Link
                to={`/authority/workspace/${grievance.id}/resolve`}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">task_alt</span>
                Resolve Case
              </Link>

              <Link
                to={`/authority/workspace/${grievance.id}/escalate`}
                className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">warning</span>
                Escalate Tier
              </Link>

              <Link
                to={`/authority/request-info?id=${grievance.id}`}
                className="px-3.5 py-2 rounded-xl bg-[#171717] hover:bg-[#262626] text-gray-300 hover:text-white border border-[#262626] text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">contact_support</span>
                Request Clarification
              </Link>

              <Link
                to={`/authority/workspace/${grievance.id}/duplicate`}
                className="px-3.5 py-2 rounded-xl bg-[#171717] hover:bg-[#262626] text-gray-300 hover:text-white border border-[#262626] text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                Duplicate Check
              </Link>
            </div>

            <button
              onClick={() => setActiveTab('ai_draft')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              Generate Official AI Reply
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#262626] pb-1 overflow-x-auto">
          {[
            { key: 'overview', label: 'Complaint Overview & AI', icon: 'article' },
            { key: 'ai_draft', label: 'AI Response Draft Assistant', icon: 'rate_review' },
            { key: 'messages', label: `Messages & Notes (${grievance.comments.length})`, icon: 'forum' },
            { key: 'timeline', label: 'Action Stepper & Audit', icon: 'timeline' },
            { key: 'evidence', label: `Evidence (${grievance.attachments.length})`, icon: 'attachment' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 shadow-xl">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Complaint Text (Left 6 cols) */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="bg-[#171717] border border-[#262626] rounded-xl p-5 flex flex-col gap-3">
                  <span className="text-[10px] font-mono uppercase text-gray-500 tracking-wider">
                    Student Statement of Grievance
                  </span>
                  <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">{grievance.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#171717] p-3 rounded-xl border border-[#262626]">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Campus Location</span>
                    <p className="font-semibold text-white mt-1">{grievance.location}</p>
                  </div>
                  <div className="bg-[#171717] p-3 rounded-xl border border-[#262626]">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Target SLA</span>
                    <p className="font-semibold text-amber-300 font-mono mt-1">{grievance.slaDeadline.slice(0, 10)}</p>
                  </div>
                </div>

                {grievance.attachments.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-gray-300 uppercase font-mono">Evidence Attached</span>
                    <EvidenceGallery attachments={grievance.attachments} />
                  </div>
                )}
              </div>

              {/* AI Triage Card (Right 6 cols) */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <AIInsightCard analysis={grievance.aiAnalysis} />
              </div>
            </div>
          )}

          {activeTab === 'ai_draft' && (
            <AIDraftEditor grievance={grievance} onApproveAndSend={handleApproveDraft} />
          )}

          {activeTab === 'messages' && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Authority Communication & Internal Logs
              </h3>
              <CommentThread
                grievanceId={grievance.id}
                comments={grievance.comments}
                onCommentAdded={fetchGrievance}
                allowInternalNotes={true}
              />
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Full Immutable Case Audit Trail
              </h3>
              <Timeline events={grievance.timeline} />
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Uploaded Proof & Documents</h3>
              <EvidenceGallery attachments={grievance.attachments} />
            </div>
          )}
        </div>
      </div>
    </AuthorityLayout>
  );
};

export default Workspace;
