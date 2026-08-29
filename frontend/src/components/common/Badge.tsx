import React from 'react';
import { GrievanceStatus, PriorityLevel } from '../../types';

interface StatusBadgeProps {
  status: GrievanceStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getStyles = () => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'under_review':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'in_progress':
        return 'bg-primary-container/20 text-[#3b82f6] border-[#3b82f6]/30';
      case 'information_requested':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'escalated':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'duplicate_closed':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'closed':
        return 'bg-gray-600/10 text-gray-400 border-gray-600/20';
      default:
        return 'bg-surface-variant text-on-surface-variant border-outline-variant';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'under_review':
        return 'Under Review';
      case 'in_progress':
        return 'In Progress';
      case 'information_requested':
        return 'Info Requested';
      case 'resolved':
        return 'Resolved';
      case 'escalated':
        return 'Escalated';
      case 'duplicate_closed':
        return 'Duplicate Closed';
      case 'closed':
        return 'Closed';
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-label-md font-medium border rounded-md uppercase tracking-wider ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      } ${getStyles()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {getLabel()}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: PriorityLevel;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const getStyles = () => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/25';
      case 'LOW':
        return 'bg-gray-500/15 text-gray-300 border-gray-500/25';
      default:
        return 'bg-surface-variant text-on-surface-variant border-outline-variant';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-label-md font-semibold border rounded ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${getStyles()}`}
    >
      {priority === 'CRITICAL' && (
        <span className="material-symbols-outlined text-[12px] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
          error
        </span>
      )}
      {priority}
    </span>
  );
};
