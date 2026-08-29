import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthorityLayout from '../components/AuthorityLayout';
import { useAuth } from '../context/AuthContext';
import { GrievanceService } from '../services/grievanceService';
import { Grievance } from '../types';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';

const DuplicateReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [currentGrievance, setCurrentGrievance] = useState<Grievance | null>(null);
  const [targetDuplicate, setTargetDuplicate] = useState<Grievance | null>(null);
  const [allGrievances, setAllGrievances] = useState<Grievance[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [mergeNote, setMergeNote] = useState('Duplicate report of active master case in this sector.');

  useEffect(() => {
    if (!id) return;
    const all = GrievanceService.getAll();
    setAllGrievances(all);
    const curr = all.find((g) => g.id.toLowerCase() === id.toLowerCase());
    if (curr) {
      setCurrentGrievance(curr);
      // Auto select first similar or another case
      const simId = curr.aiAnalysis.similarGrievances[0]?.id;
      const target = all.find((g) => g.id === simId) || all.find((g) => g.id !== id);
      if (target) {
        setTargetDuplicate(target);
        setSelectedParentId(target.id);
      }
    }
  }, [id]);

  const handleSelectParent = (parentId: string) => {
    setSelectedParentId(parentId);
    const found = allGrievances.find((g) => g.id === parentId);
    if (found) setTargetDuplicate(found);
  };

  const handleMerge = () => {
    if (!currentGrievance || !user || !selectedParentId) return;
    GrievanceService.mergeDuplicate(currentGrievance.id, selectedParentId, user.name, mergeNote);
    toast.success(`Case #${currentGrievance.id} merged into master Case #${selectedParentId}!`);
    navigate(`/authority/workspace/${selectedParentId}`);
  };

  const similarityScore = currentGrievance?.aiAnalysis.similarGrievances[0]?.similarityScore || 88;

  return (
    <AuthorityLayout>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase mb-1">
              <span className="material-symbols-outlined text-sm">content_copy</span>
              Autonomous Duplicate Inspector
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Duplicate Complaint Review</h1>
            <p className="text-xs text-gray-400 mt-1">
              Compare incoming grievance against existing master dockets to consolidate institutional workflow.
            </p>
          </div>
          <Link
            to={`/authority/workspace/${id}`}
            className="text-xs text-gray-400 hover:text-white px-3.5 py-2 rounded-xl bg-[#171717] border border-[#262626]"
          >
            Cancel & Return
          </Link>
        </div>

        {/* Similarity Score Card */}
        <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                compare_arrows
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">Semantic Match Assessment</h4>
              <p className="text-xs text-gray-400">Vector similarity computed across location, text tokens, and category</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-xs font-mono font-bold text-purple-300">{similarityScore}% Match Index</span>
              <div className="w-36 h-2 bg-gray-800 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${similarityScore}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Dossier Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Incoming Grievance (Current) */}
          <div className="bg-[#10131a] border border-blue-500/30 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">Incoming Docket #{currentGrievance?.id}</span>
              <StatusBadge status={currentGrievance?.status || 'submitted'} />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{currentGrievance?.title}</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">Filed by: {currentGrievance?.studentName} • {currentGrievance?.createdAt.slice(0, 10)}</p>
            </div>

            <div className="bg-[#171717] border border-[#262626] rounded-xl p-4 text-xs text-gray-200 leading-relaxed min-h-[140px]">
              "{currentGrievance?.description}"
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#171717] p-2.5 rounded-lg border border-[#262626]">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Location</span>
                <p className="font-semibold text-white truncate mt-0.5">{currentGrievance?.location}</p>
              </div>
              <div className="bg-[#171717] p-2.5 rounded-lg border border-[#262626]">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Department</span>
                <p className="font-semibold text-white truncate mt-0.5">{currentGrievance?.department}</p>
              </div>
            </div>
          </div>

          {/* Suspected Duplicate Target */}
          <div className="bg-[#10131a] border border-purple-500/30 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">Active Master Docket #{targetDuplicate?.id}</span>
              {targetDuplicate && <StatusBadge status={targetDuplicate.status} />}
            </div>

            {/* Target Selector Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono text-gray-500 uppercase">Switch Master Case</label>
              <select
                value={selectedParentId}
                onChange={(e) => handleSelectParent(e.target.value)}
                className="bg-[#171717] border border-[#262626] text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-purple-500"
              >
                {allGrievances.filter((g) => g.id !== id).map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.id} - {g.title.slice(0, 45)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{targetDuplicate?.title}</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">Filed by: {targetDuplicate?.studentName} • {targetDuplicate?.createdAt.slice(0, 10)}</p>
            </div>

            <div className="bg-[#171717] border border-[#262626] rounded-xl p-4 text-xs text-gray-200 leading-relaxed min-h-[140px]">
              "{targetDuplicate?.description}"
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#171717] p-2.5 rounded-lg border border-[#262626]">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Location</span>
                <p className="font-semibold text-white truncate mt-0.5">{targetDuplicate?.location}</p>
              </div>
              <div className="bg-[#171717] p-2.5 rounded-lg border border-[#262626]">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Department</span>
                <p className="font-semibold text-white truncate mt-0.5">{targetDuplicate?.department}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Merge Confirmation Bar */}
        <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex flex-col gap-1 flex-1 max-w-lg">
            <span className="text-xs font-mono font-bold text-white uppercase">Merge Rationale Note</span>
            <input
              type="text"
              value={mergeNote}
              onChange={(e) => setMergeNote(e.target.value)}
              className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              onClick={handleMerge}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">merge</span>
              Consolidate & Link Duplicates
            </button>
          </div>
        </div>
      </div>
    </AuthorityLayout>
  );
};

export default DuplicateReview;
