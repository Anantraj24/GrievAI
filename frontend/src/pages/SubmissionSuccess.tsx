import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Layout from '../components/Layout';
import { Grievance } from '../types';
import { PriorityBadge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';

const SubmissionSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const grievance: Grievance | undefined = location.state?.grievance;

  useEffect(() => {
    // Fire confetti celebration
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#8a4cfc', '#10b981', '#ffffff'],
    });
  }, []);

  const copyTracking = () => {
    const code = grievance?.trackingCode || 'TRK-2024-X';
    navigator.clipboard.writeText(code);
    toast.success(`Copied tracking code ${code} to clipboard`);
  };

  return (
    <Layout userRoleLabel="Student Portal" userName={grievance?.studentName || 'Student'}>
      <div className="flex flex-col items-center justify-center max-w-2xl mx-auto w-full my-4">
        <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-8 sm:p-10 w-full flex flex-col items-center text-center shadow-2xl relative overflow-hidden animate-slide-in">
          {/* Top Checkmark Graphic */}
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 shadow-xl shadow-emerald-950/40">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
          </div>

          <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider mb-1">
            Grievance Formally Registered
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
            Submission Confirmed
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mb-6 leading-relaxed">
            Your grievance has been validated, indexed, and routed to the responsible department authority for immediate triage.
          </p>

          {/* Docket Credentials Box */}
          <div className="w-full bg-[#171717] border border-[#262626] rounded-xl p-5 mb-6 flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3 flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase">Case Identifier</span>
                <p className="text-lg font-bold font-mono text-blue-400">{grievance?.id || 'GRV-2024-089'}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Assessed Priority</span>
                <div className="mt-0.5">
                  <PriorityBadge priority={grievance?.priority || 'HIGH'} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase">Assigned Department</span>
                <p className="font-semibold text-white mt-0.5">{grievance?.department || 'Estate & Campus Facilities'}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-gray-500 uppercase">Target SLA Resolution</span>
                <p className="font-semibold text-amber-300 font-mono mt-0.5">Under 24 Hours</p>
              </div>
            </div>

            <div className="bg-[#10131a] p-3 rounded-lg border border-[#262626] flex items-center justify-between gap-2">
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Public Tracking Code</span>
                <span className="font-mono text-xs text-gray-200 truncate">{grievance?.trackingCode || 'TRK-8892-C4'}</span>
              </div>
              <button
                onClick={copyTracking}
                className="px-3 py-1.5 rounded-lg bg-[#262626] hover:bg-[#333] text-gray-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                Copy
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <Link
              to={grievance ? `/student/grievance/${grievance.id}` : '/student/grievances'}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              Track Case Live
            </Link>

            <Link
              to="/student/dashboard"
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#171717] hover:bg-[#262626] text-gray-300 hover:text-white text-xs font-bold transition-colors border border-[#262626] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">dashboard</span>
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmissionSuccess;
