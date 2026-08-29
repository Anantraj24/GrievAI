import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import AuthorityLayout from '../components/AuthorityLayout';
import { useAuth } from '../context/AuthContext';
import { GrievanceService } from '../services/grievanceService';
import { Grievance } from '../types';
import { useToast } from '../context/ToastContext';

const PRESET_REQUESTS = [
  'Please upload a high-resolution photo showing the serial number and physical condition of the affected device.',
  'Please specify the exact room number, floor wing, and equipment desk ID.',
  'Please attach the official bank statement PDF showing the dual transaction debit and 12-digit UTR reference.',
  'Please upload your signed midterm exam booklet and the course instructor solution key.',
  'Please provide names of any eyewitnesses or resident students affected by this incident.',
];

const InformationRequest: React.FC = () => {
  const [searchParams] = useSearchParams();
  const grievanceId = searchParams.get('id') || 'GRV-2024-089';
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [message, setMessage] = useState(PRESET_REQUESTS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const item = GrievanceService.getById(grievanceId);
    if (item) setGrievance(item);
  }, [grievanceId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievance || !user || !message.trim()) return;

    setIsSubmitting(true);
    try {
      GrievanceService.requestInfo(grievance.id, user.name, message.trim());
      toast.success(`Clarification request dispatched to ${grievance.studentName}!`);
      navigate(`/authority/workspace/${grievance.id}`);
    } catch {
      toast.error('Failed to dispatch clarification request.');
      setIsSubmitting(false);
    }
  };

  return (
    <AuthorityLayout>
      <div className="max-w-2xl mx-auto w-full my-4 flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase mb-1">
            <span className="material-symbols-outlined text-sm">contact_support</span>
            Information Clarification Relay
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Request Clarification from Student</h1>
          <p className="text-xs text-gray-400 mt-1">
            Request additional evidence or specifications from the student to facilitate thorough investigation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl">
          {/* Case Info */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-4 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase">Target Student</span>
              <p className="font-semibold text-white">{grievance?.studentName} ({grievance?.studentEmail})</p>
            </div>
            <span className="font-mono text-xs font-bold text-purple-400">Case #{grievance?.id}</span>
          </div>

          {/* Preset Chips */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Fast Presets</span>
            <div className="flex flex-col gap-2">
              {PRESET_REQUESTS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessage(preset)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    message === preset
                      ? 'bg-purple-950/30 border-purple-500/50 text-white font-medium shadow-md'
                      : 'bg-[#171717] border-[#262626] text-gray-400 hover:text-white'
                  }`}
                >
                  "{preset}"
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Clarification Request Message *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Specify the exact documentation or clarification required from student..."
              className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3.5 focus:outline-none focus:border-purple-500 resize-none leading-relaxed font-mono"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#262626]">
            <Link
              to={`/authority/workspace/${grievanceId}`}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              {isSubmitting ? 'Dispatching...' : 'Dispatch Request to Student'}
            </button>
          </div>
        </form>
      </div>
    </AuthorityLayout>
  );
};

export default InformationRequest;
