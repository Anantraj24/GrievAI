import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthorityLayout from '../components/AuthorityLayout';
import { useAuth } from '../context/AuthContext';
import { GrievanceService } from '../services/grievanceService';
import { Grievance } from '../types';
import { useToast } from '../context/ToastContext';

const ROOT_CAUSE_CATEGORIES = [
  'Equipment Failure / Aging Infrastructure',
  'Network / ISP Outage',
  'Software Bug / Configuration Error',
  'Administrative / Procedural Oversight',
  'Catering / Vendor Compliance',
  'Resource / Capacity Shortage',
  'Severe Weather / External Event',
];

const ResolutionWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [rootCause, setRootCause] = useState(ROOT_CAUSE_CATEGORIES[0]);
  const [officialResponse, setOfficialResponse] = useState('');
  const [notifyStudent, setNotifyStudent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const item = GrievanceService.getById(id);
    if (item) {
      setGrievance(item);
      setResolutionSummary(`Remedial maintenance and corrective protocol completed for ${item.location}.`);
      setOfficialResponse(item.officialDraftResponse || '');
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievance || !user || !resolutionSummary.trim()) return;

    setIsSubmitting(true);
    try {
      GrievanceService.resolve(
        grievance.id,
        user.name,
        resolutionSummary.trim(),
        rootCause,
        notifyStudent ? officialResponse : undefined
      );
      toast.success(`Case #${grievance.id} marked as RESOLVED! Student has been notified.`);
      navigate(`/authority/workspace/${grievance.id}`);
    } catch {
      toast.error('Failed to mark grievance as resolved.');
      setIsSubmitting(false);
    }
  };

  return (
    <AuthorityLayout>
      <div className="max-w-2xl mx-auto w-full my-4 flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase mb-1">
            <span className="material-symbols-outlined text-sm">task_alt</span>
            Final Resolution Authorization
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Resolve Case #{id}</h1>
          <p className="text-xs text-gray-400 mt-1">
            Formally certify that remedial actions have been executed in compliance with institutional standards.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl">
          {/* Case Snippet */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-4 flex flex-col gap-1 text-xs">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Docket Headline</span>
            <p className="font-semibold text-white">{grievance?.title}</p>
            <span className="text-[11px] text-gray-400">{grievance?.studentName} • {grievance?.location}</span>
          </div>

          {/* Root Cause Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Institutional Root Cause Classification *
            </label>
            <select
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-emerald-500"
            >
              {ROOT_CAUSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Resolution Summary */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Remedial Actions Executed *
            </label>
            <textarea
              required
              rows={3}
              value={resolutionSummary}
              onChange={(e) => setResolutionSummary(e.target.value)}
              placeholder="Describe physical or administrative actions taken to solve the root problem..."
              className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
            />
          </div>

          {/* Official Closure Message to Student */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Official Resolution Message to Student
              </label>
              <label className="flex items-center gap-1.5 text-xs text-emerald-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyStudent}
                  onChange={(e) => setNotifyStudent(e.target.checked)}
                  className="rounded bg-[#171717] text-emerald-600 focus:ring-0"
                />
                Dispatch Email Notice
              </label>
            </div>
            <textarea
              rows={4}
              value={officialResponse}
              onChange={(e) => setOfficialResponse(e.target.value)}
              placeholder="Official letter explaining the completed solution to the student..."
              className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 resize-none font-mono leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#262626]">
            <Link
              to={`/authority/workspace/${id}`}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting || !resolutionSummary.trim()}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">verified</span>
              {isSubmitting ? 'Certifying Resolution...' : 'Authorize Case Resolution'}
            </button>
          </div>
        </form>
      </div>
    </AuthorityLayout>
  );
};

export default ResolutionWorkspace;
