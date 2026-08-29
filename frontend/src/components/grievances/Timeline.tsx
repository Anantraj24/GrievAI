import React from 'react';
import { TimelineEvent } from '../../types';

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const getIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'submission':
        return 'edit_document';
      case 'ai_analysis':
        return 'auto_awesome';
      case 'assignment':
        return 'assignment_ind';
      case 'status_change':
        return 'update';
      case 'comment':
        return 'chat_bubble';
      case 'escalation':
        return 'warning';
      case 'resolution':
        return 'task_alt';
      case 'feedback':
        return 'star';
      default:
        return 'radio_button_checked';
    }
  };

  const getColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'submission':
        return 'text-blue-400 bg-blue-500/15 border-blue-500/30';
      case 'ai_analysis':
        return 'text-purple-400 bg-purple-500/15 border-purple-500/30';
      case 'assignment':
        return 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30';
      case 'status_change':
        return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
      case 'comment':
        return 'text-gray-300 bg-gray-700/30 border-gray-600/30';
      case 'escalation':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'resolution':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'feedback':
        return 'text-amber-300 bg-amber-500/20 border-amber-500/30';
      default:
        return 'text-gray-400 bg-gray-800 border-gray-700';
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#262626]">
      {events.map((ev, index) => (
        <div key={ev.id || index} className="relative flex items-start gap-4 group">
          {/* Node Icon */}
          <div
            className={`absolute -left-6 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110 ${getColor(
              ev.type
            )}`}
          >
            <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {getIcon(ev.type)}
            </span>
          </div>

          {/* Card Content */}
          <div className="flex-1 bg-[#10131a] border border-[#262626] rounded-lg p-3.5 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
              <h5 className="text-xs font-semibold text-white tracking-wide">{ev.title}</h5>
              <span className="text-[10px] font-mono text-gray-500">{new Date(ev.timestamp).toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">{ev.description}</p>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#1c202a] text-[10px] text-gray-400">
              <span className="font-mono uppercase">Actor:</span>
              <span className="text-gray-200 font-medium">{ev.actor}</span>
              <span className="text-gray-600">•</span>
              <span className="capitalize text-gray-400">{ev.actorRole}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
