import React, { useState } from 'react';
import { Comment, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { GrievanceService } from '../../services/grievanceService';
import { useToast } from '../../context/ToastContext';

interface CommentThreadProps {
  grievanceId: string;
  comments: Comment[];
  onCommentAdded?: () => void;
  allowInternalNotes?: boolean;
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  grievanceId,
  comments,
  onCommentAdded,
  allowInternalNotes = false,
}) => {
  const { user, userRole } = useAuth();
  const [content, setContent] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      GrievanceService.addComment(
        grievanceId,
        user.id,
        user.name,
        user.role as UserRole,
        user.avatar,
        content.trim(),
        isInternal
      );
      setContent('');
      setIsInternal(false);
      toast.success(isInternal ? 'Internal note added' : 'Message posted to student file');
      if (onCommentAdded) onCommentAdded();
    } catch {
      toast.error('Failed to post message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleComments = allowInternalNotes
    ? comments
    : comments.filter((c) => !c.isInternalOnly);

  return (
    <div className="flex flex-col gap-4">
      {/* Comments List */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {visibleComments.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-500 italic bg-[#10131a] rounded-lg border border-[#262626]">
            No messages posted yet. Start the official conversation below.
          </div>
        ) : (
          visibleComments.map((cmt) => {
            const isMe = user?.id === cmt.authorId;
            return (
              <div
                key={cmt.id}
                className={`p-3.5 rounded-xl border flex flex-col gap-2 transition-colors ${
                  cmt.isInternalOnly
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : isMe
                    ? 'bg-[#141b2b] border-blue-500/30 ml-4'
                    : 'bg-[#10131a] border-[#262626] mr-4'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      alt=""
                      src={cmt.authorAvatar}
                      className="w-6 h-6 rounded-full object-cover border border-gray-700"
                    />
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white">{cmt.authorName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-800 text-gray-400 uppercase font-mono">
                        {cmt.authorRole}
                      </span>
                      {cmt.isInternalOnly && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold uppercase font-mono flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">lock</span>
                          Internal Only
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">
                    {new Date(cmt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-wrap pl-8">{cmt.content}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handlePost} className="flex flex-col gap-2 pt-2 border-t border-[#262626]">
        <div className="relative">
          <textarea
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              isInternal
                ? 'Type an internal administrative note (visible only to authority/admin)...'
                : 'Type an official update or question for this case...'
            }
            required
            className="w-full bg-[#10131a] border border-[#2D3139] rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          {allowInternalNotes && (userRole === 'authority' || userRole === 'admin') ? (
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:text-white select-none">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="rounded border-[#2D3139] bg-[#10131a] text-amber-500 focus:ring-0"
              />
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-amber-400">lock</span>
                Mark as Internal Note
              </span>
            </label>
          ) : (
            <div />
          )}

          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isInternal
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="material-symbols-outlined text-sm">send</span>
            {isSubmitting ? 'Posting...' : isInternal ? 'Save Note' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
};
