import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { GrievanceService } from '../services/grievanceService';
import { Grievance } from '../types';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { AIInsightCard } from '../components/common/AIInsightCard';
import { Timeline } from '../components/grievances/Timeline';
import { CommentThread } from '../components/grievances/CommentThread';
import { EvidenceGallery } from '../components/common/EvidenceGallery';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useToast } from '../context/ToastContext';

const GrievanceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'timeline' | 'messages' | 'ai_insights' | 'evidence'>('timeline');

  const fetchGrievance = () => {
    if (!id) return;
    const item = GrievanceService.getById(id);
    if (item) {
      setGrievance(item);
    } else {
      toast.error(`Grievance #${id} not found.`);
      navigate('/student/grievances');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGrievance();
  }, [id]);

  if (loading || !grievance) {
    return (
      <Layout userRoleLabel="Student Portal">
        <LoadingSkeleton rows={6} />
      </Layout>
    );
  }

  const isResolved = grievance.status === 'resolved' || grievance.status === 'closed';

  return (
    <Layout userRoleLabel="Student Portal" userName={user?.name || 'Student'}>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <Link to="/student/grievances" className="hover:text-white transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            All Grievances
          </Link>
          <span>/</span>
          <span className="text-blue-400 font-bold">{grievance.id}</span>
        </div>

        {/* Case Header Card */}
        <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262626] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-mono font-bold text-blue-400">{grievance.id}</span>
                <span className="text-gray-500">•</span>
                <span className="text-xs font-mono text-gray-400">Tracking: {grievance.trackingCode}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{grievance.title}</h1>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
              <PriorityBadge priority={grievance.priority} size="md" />
              <StatusBadge status={grievance.status} size="md" />
            </div>
          </div>

          {/* Quick Details Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#171717] p-3 rounded-xl border border-[#262626]">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Assigned Authority</span>
              <p className="font-semibold text-white mt-0.5">{grievance.assignedAuthorityName || 'Triage Officer'}</p>
              <p className="text-[11px] text-gray-400">{grievance.department}</p>
            </div>

            <div className="bg-[#171717] p-3 rounded-xl border border-[#262626]">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Location</span>
              <p className="font-semibold text-white mt-0.5 truncate">{grievance.location}</p>
              <p className="text-[11px] text-gray-400">{grievance.category}</p>
            </div>

            <div className="bg-[#171717] p-3 rounded-xl border border-[#262626]">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Filed Date</span>
              <p className="font-semibold text-white mt-0.5">{grievance.createdAt.slice(0, 10)}</p>
              <p className="text-[11px] text-gray-400 font-mono">
                {new Date(grievance.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="bg-[#171717] p-3 rounded-xl border border-[#262626]">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Target SLA Resolution</span>
              <p className={`font-semibold font-mono mt-0.5 ${grievance.slaBreached ? 'text-red-400' : 'text-amber-300'}`}>
                {grievance.slaBreached ? 'SLA Breached' : 'Within 24 Hours'}
              </p>
              <p className="text-[11px] text-gray-500 font-mono">Deadline: {grievance.slaDeadline.slice(0, 10)}</p>
            </div>
          </div>
        </div>

        {/* Action Banners */}
        {/* If Information Requested */}
        {grievance.status === 'information_requested' && (
          <div className="bg-purple-950/30 border border-purple-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-purple-400 text-2xl mt-0.5">help</span>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">Clarification Requested by Authority</h4>
                <p className="text-xs text-purple-200 mt-1">{grievance.infoRequestedText || 'Please post a clarification in the message thread below.'}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('messages')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/30 shrink-0"
            >
              Reply to Authority
            </button>
          </div>
        )}

        {/* If Resolved - Show Rate Experience CTA or Existing Rating */}
        {isResolved && (
          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-emerald-400 text-2xl mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">This Case Has Been Formally Resolved</h4>
                <p className="text-xs text-emerald-200 mt-1 leading-relaxed">
                  {grievance.resolutionSummary || 'The assigned department has completed remedial actions.'}
                </p>
                {grievance.feedback && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-amber-300">
                    <span>Your Rating: {grievance.feedback.rating}/5 Stars</span>
                    <span className="text-gray-500">•</span>
                    <span className="italic text-gray-300">"{grievance.feedback.feedbackText}"</span>
                  </div>
                )}
              </div>
            </div>

            {!grievance.feedback && (
              <Link
                to={`/student/rate/${grievance.id}`}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 shrink-0 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">star</span>
                Rate Resolution Experience
              </Link>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#262626] pb-1 overflow-x-auto">
          {[
            { key: 'timeline', label: 'Case Timeline', icon: 'timeline' },
            { key: 'messages', label: `Messages (${grievance.comments.length})`, icon: 'forum' },
            { key: 'ai_insights', label: 'AI Intelligence Triage', icon: 'auto_awesome' },
            { key: 'evidence', label: `Evidence & Attachments (${grievance.attachments.length})`, icon: 'attachment' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
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
          {activeTab === 'timeline' && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Formal Audit & Action Stepper</h3>
              <Timeline events={grievance.timeline} />
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Student-Authority Discussion</h3>
              <CommentThread grievanceId={grievance.id} comments={grievance.comments} onCommentAdded={fetchGrievance} />
            </div>
          )}

          {activeTab === 'ai_insights' && (
            <div className="flex flex-col gap-4">
              <AIInsightCard analysis={grievance.aiAnalysis} />
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Uploaded Documents & Photos</h3>
              <EvidenceGallery attachments={grievance.attachments} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GrievanceDetails;
