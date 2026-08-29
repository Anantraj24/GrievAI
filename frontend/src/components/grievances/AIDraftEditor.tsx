import React, { useState } from 'react';
import { Grievance } from '../../types';
import { AIEngine } from '../../services/aiEngine';
import { useToast } from '../../context/ToastContext';

interface AIDraftEditorProps {
  grievance: Grievance;
  onApproveAndSend: (finalDraft: string) => void;
}

export const AIDraftEditor: React.FC<AIDraftEditorProps> = ({ grievance, onApproveAndSend }) => {
  const [tone, setTone] = useState<'Formal' | 'Empathetic' | 'Direct'>('Formal');
  const [draft, setDraft] = useState(
    grievance.officialDraftResponse || AIEngine.generateOfficialDraft(grievance, 'Formal')
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useToast();

  const handleRegenerate = (newTone: 'Formal' | 'Empathetic' | 'Direct') => {
    setTone(newTone);
    setIsGenerating(true);
    setTimeout(() => {
      const generated = AIEngine.generateOfficialDraft(grievance, newTone);
      setDraft(generated);
      setIsGenerating(false);
      toast.info(`Generated AI response with ${newTone} tone`);
    }, 300);
  };

  return (
    <div className="bg-[#171717] border border-[#2D3139] rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              rate_review
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
              AI Response Draft Assistant
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-medium">
                Official Letterhead
              </span>
            </h4>
            <p className="text-xs text-gray-400">Synthesized against institutional resolution policy</p>
          </div>
        </div>

        {/* Tone Switcher */}
        <div className="flex items-center gap-1 bg-[#10131a] p-1 rounded-lg border border-[#262626]">
          {(['Formal', 'Empathetic', 'Direct'] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleRegenerate(t)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                tone === t
                  ? 'bg-blue-600 text-white font-semibold shadow'
                  : 'text-gray-400 hover:text-white hover:bg-[#262626]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Human in the loop alert */}
      <div className="bg-blue-950/20 border border-blue-500/20 rounded-lg p-3 flex items-start gap-2.5">
        <span className="material-symbols-outlined text-blue-400 text-base mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
          info
        </span>
        <div className="text-xs">
          <span className="font-bold text-blue-200 uppercase tracking-wider block mb-0.5">
            Human-in-the-Loop Validation Required
          </span>
          <span className="text-blue-300/80">
            Please review the generated response for policy accuracy before dispatching to student {grievance.studentName}.
          </span>
        </div>
      </div>

      {/* Editable Text Area */}
      <div className="relative">
        <textarea
          rows={9}
          value={draft}
          disabled={isGenerating}
          onChange={(e) => setDraft(e.target.value)}
          className={`w-full bg-[#10131a] border border-[#2D3139] rounded-lg p-4 font-mono text-xs text-gray-100 leading-relaxed focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none ${
            isGenerating ? 'opacity-40 animate-pulse' : ''
          }`}
        />
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs rounded-lg">
            <span className="text-xs font-mono text-blue-300 flex items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
              Synthesizing Draft...
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-[#262626] flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="material-symbols-outlined text-emerald-400 text-sm">verified</span>
          <span>Recipient: {grievance.studentEmail}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleRegenerate(tone)}
            disabled={isGenerating}
            className="px-3 py-2 rounded-lg bg-[#262626] hover:bg-[#333] text-gray-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Regenerate
          </button>

          <button
            type="button"
            onClick={() => onApproveAndSend(draft)}
            disabled={isGenerating || !draft.trim()}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/25 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">send</span>
            Approve & Dispatch Response
          </button>
        </div>
      </div>
    </div>
  );
};
