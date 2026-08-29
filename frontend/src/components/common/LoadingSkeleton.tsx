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

export default LoadingSkeleton;
