import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="flex flex-col gap-3 w-full animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-[#171717] border border-[#262626] rounded-lg w-full flex items-center px-4 justify-between">
          <div className="flex items-center gap-3 w-1/2">
            <div className="w-8 h-8 rounded bg-[#262626]"></div>
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3 bg-[#262626] rounded w-3/4"></div>
              <div className="h-2 bg-[#20232b] rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-6 w-20 bg-[#262626] rounded-md"></div>
        </div>
      ))}
    </div>
  );
};

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'folder_open',
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#171717]/40 border border-dashed border-[#2D3139] rounded-xl my-4">
      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>
          {icon}
        </span>
      </div>
      <h3 className="text-base font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-400 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {actionText}
        </button>
      )}
    </div>
  );
};
