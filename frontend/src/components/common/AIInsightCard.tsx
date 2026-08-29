import React from 'react';
import { AIAnalysisResult } from '../../types';
import { PriorityBadge } from './Badge';

interface AIInsightCardProps {
  analysis: AIAnalysisResult;
  showDuplicates?: boolean;
  compact?: boolean;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ analysis, showDuplicates = true, compact = false }) => {
  return (
    <div className="bg-[#171717] border border-[#2D3139] rounded-xl p-5 relative overflow-hidden flex flex-col gap-4 border-l-4 border-l-purple-500 shadow-xl">
      {/* Top Banner with AI Sparkle & Confidence */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
              GrievAI Intelligence Engine
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-medium">
                v2.4
              </span>
            </h4>
            <p className="text-xs text-gray-400">Autonomous Triaging & Tonal Analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-gray-400 font-mono">Confidence:</span>
              <span className="text-xs font-bold text-purple-300 font-mono">{analysis.confidenceScore}%</span>
            </div>
            <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${analysis.confidenceScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-[#10131a] border border-[#262626] rounded-lg p-3">
        <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">AI Executive Summary</span>
        <p className="text-sm text-gray-200 mt-1 leading-relaxed font-medium">"{analysis.summary}"</p>
      </div>

      {/* Grid of Key AI Findings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Recommended Category */}
        <div className="bg-[#12151c] border border-[#262626] rounded-lg p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-gray-400 uppercase">Predicted Category</span>
          <div className="mt-1">
            <p className="text-xs font-semibold text-white truncate">{analysis.category}</p>
            <p className="text-[11px] text-gray-400 truncate">{analysis.subcategory}</p>
          </div>
        </div>

        {/* Priority & Urgency */}
        <div className="bg-[#12151c] border border-[#262626] rounded-lg p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-gray-400 uppercase">Assessed Priority</span>
          <div className="mt-1 flex items-center justify-between">
            <PriorityBadge priority={analysis.priority} />
            <span className="text-[11px] text-gray-400 font-mono">Urgency: {analysis.urgencyScore}/10</span>
          </div>
        </div>

        {/* Sentiment */}
        <div className="bg-[#12151c] border border-[#262626] rounded-lg p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-gray-400 uppercase">Detected Sentiment</span>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span className="text-xs font-semibold text-white">{analysis.sentiment}</span>
          </div>
        </div>
      </div>

      {/* Recommended Department Routing */}
      <div className="bg-purple-950/20 border border-purple-500/20 rounded-lg p-3 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-purple-400" style={{ fontVariationSettings: "'FILL' 1" }}>
            alt_route
          </span>
          <span className="text-xs font-bold text-purple-200">Recommended Routing: {analysis.recommendedDepartment}</span>
        </div>
        <p className="text-xs text-purple-300/80 pl-6">{analysis.routingReason}</p>
      </div>

      {/* Extracted Entities Chips */}
      {analysis.extractedEntities && analysis.extractedEntities.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono uppercase text-gray-400">Extracted Entities & Context</span>
          <div className="flex flex-wrap gap-2">
            {analysis.extractedEntities.map((ent, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10131a] border border-[#262626] text-xs text-gray-300"
              >
                <span className="text-[10px] text-gray-500 font-mono uppercase">{ent.label}:</span>
                <span className="font-medium text-white">{ent.value}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Duplicate / Similar Complaints Warning */}
      {showDuplicates && analysis.similarGrievances && analysis.similarGrievances.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-lg p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                content_copy
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">
                Potential Duplicate Identified ({analysis.similarGrievances.length} match)
              </span>
            </div>
            <span className="text-[11px] font-mono text-amber-400 font-bold">
              {analysis.similarGrievances[0].similarityScore}% Match
            </span>
          </div>
          <div className="text-xs text-gray-300 bg-[#10131a]/80 p-2.5 rounded border border-amber-500/20">
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
              <span className="text-amber-200 font-bold">Case #{analysis.similarGrievances[0].id}</span>
              <span>{analysis.similarGrievances[0].submittedDate}</span>
            </div>
            <p className="text-white font-medium mt-0.5">{analysis.similarGrievances[0].title}</p>
            <p className="text-gray-400 text-[11px] mt-1 italic">"{analysis.similarGrievances[0].snippet}"</p>
          </div>
        </div>
      )}

      {!compact && (
        <div className="text-[11px] text-gray-500 flex items-center justify-between pt-2 border-t border-[#262626]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">verified_user</span>
            Human-in-the-loop validation: Authority approval required for institutional actions.
          </span>
          <span className="font-mono text-[10px]">Analyzed in 184ms</span>
        </div>
      )}
    </div>
  );
};
