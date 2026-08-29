import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthorityLayout from '../components/AuthorityLayout';
import { useAuth } from '../context/AuthContext';
import { GrievanceService } from '../services/grievanceService';
import { Grievance, PriorityLevel } from '../types';
import { useToast } from '../context/ToastContext';

const EscalationWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [tier, setTier] = useState<1 | 2 | 3>(2);
  const [priorityOverride, setPriorityOverride] = useState<PriorityLevel>('CRITICAL');
  const [reason, setReason] = useState('Requires executive budgetary clearance and multi-department contractor dispatch.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const item = GrievanceService.getById(id);
    if (item) {
      setGrievance(item);
      setPriorityOverride(item.priority === 'CRITICAL' ? 'CRITICAL' : 'HIGH');
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievance || !user || !reason.trim()) return;

    setIsSubmitting(true);
    try {
      GrievanceService.escalate(grievance.id, user.name, tier, reason.trim(), priorityOverride);
      toast.warning(`Case #${grievance.id} escalated to Tier ${tier}!`);
      navigate(`/authority/workspace/${grievance.id}`);
    } catch {
      toast.error('Failed to escalate case.');
      setIsSubmitting(false);
    }
  };

  return (
    <AuthorityLayout>
      <div className="max-w-2xl mx-auto w-full my-4 flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase mb-1">
            <span className="material-symbols-outlined text-sm">warning</span>
            Administrative Escalation Protocol
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Escalate Case #{id}</h1>
          <p className="text-xs text-gray-400 mt-1">
            Elevate this case beyond standard department capacity to senior institutional leadership.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl">
          {/* Case Snippet */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-4 flex flex-col gap-1 text-xs">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Active Docket</span>
            <p className="font-semibold text-white">{grievance?.title}</p>
            <span className="text-[11px] text-gray-400">{grievance?.department} • Current Priority: {grievance?.priority}</span>
          </div>

          {/* Escalation Tier Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Target Escalation Tier *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { tier: 1, title: 'Tier 1', desc: 'Senior Faculty Panel' },
                { tier: 2, title: 'Tier 2 (Recommended)', desc: 'Head of Department / Dean' },
                { tier: 3, title: 'Tier 3 (Executive)', desc: 'Ombudsman & Registrar' },
              ].map((t) => (
                <button
                  key={t.tier}
                  type="button"
                  onClick={() => setTier(t.tier as any)}
                  className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    tier === t.tier
                      ? 'bg-red-950/30 border-red-500/50 text-white shadow-lg'
                      : 'bg-[#171717] border-[#262626] text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold text-red-300">{t.title}</span>
                  <span className="text-[10px] text-gray-400 leading-tight">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Override */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Urgency & Priority Override
            </label>
            <select
              value={priorityOverride}
              onChange={(e) => setPriorityOverride(e.target.value as PriorityLevel)}
              className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-red-500"
            >
              <option value="CRITICAL">CRITICAL (Emergency Response Required)</option>
              <option value="HIGH">HIGH (Under 24h Escalation)</option>
              <option value="MEDIUM">MEDIUM (Administrative Review)</option>
            </select>
          </div>

          {/* Escalation Reason */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Official Escalation Rationale *
            </label>
            <textarea
              required
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the institutional impediment, safety risk, or policy exception necessitating higher authority intervention..."
              className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3.5 focus:outline-none focus:border-red-500 resize-none leading-relaxed"
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
              disabled={isSubmitting || !reason.trim()}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">warning</span>
              {isSubmitting ? 'Escalating Case...' : 'Authorize Executive Escalation'}
            </button>
          </div>
        </form>
      </div>
    </AuthorityLayout>
  );
};

export default EscalationWorkspace;
