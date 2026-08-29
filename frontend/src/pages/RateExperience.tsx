import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { GrievanceService } from '../services/grievanceService';
import { Grievance } from '../types';
import { useToast } from '../context/ToastContext';

const AVAILABLE_TAGS = [
  'Prompt Resolution',
  'Helpful Authority',
  'Clear Communication',
  'Satisfactory Workmanship',
  'Fast Response',
  'Courteous Staff',
];

const RateExperience: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Prompt Resolution', 'Clear Communication']);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const item = GrievanceService.getById(id);
    if (item) {
      setGrievance(item);
      if (item.feedback) {
        setRating(item.feedback.rating);
        setSelectedTags(item.feedback.tags);
        setFeedbackText(item.feedback.feedbackText);
      }
    }
  }, [id]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    } else {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievance) return;

    setIsSubmitting(true);
    try {
      GrievanceService.submitFeedback(grievance.id, {
        rating,
        tags: selectedTags,
        feedbackText: feedbackText || 'Thank you for resolving this issue promptly.',
        submittedAt: new Date().toISOString(),
      });
      toast.success('Thank you! Your feedback has been submitted to the Ombudsman.');
      navigate(`/student/grievance/${grievance.id}`);
    } catch {
      toast.error('Failed to submit rating.');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout userRoleLabel="Student Portal" userName={user?.name || 'Student'}>
      <div className="max-w-xl mx-auto w-full my-6 flex flex-col gap-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2 border border-emerald-500/20">
            <span className="material-symbols-outlined text-sm">verified</span>
            Case Resolution Rating
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Rate Your Resolution Experience</h1>
          <p className="text-xs text-gray-400 mt-1">
            Your feedback directly informs our institutional department quality and accountability index.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-8 flex flex-col gap-6 shadow-2xl">
          {/* Case Identifier */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-4 flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Case Docket</span>
              <p className="text-sm font-bold text-white truncate">{grievance?.title || 'Case Resolution'}</p>
            </div>
            <span className="font-mono text-xs font-bold text-blue-400 shrink-0">{grievance?.id}</span>
          </div>

          {/* Star Rating Interactive Selector */}
          <div className="flex flex-col items-center gap-2 py-3 border-y border-[#262626]">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Overall Satisfaction</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-3xl transition-transform hover:scale-125 focus:outline-none"
                >
                  <span
                    className={`material-symbols-outlined text-4xl ${
                      (hoverRating || rating) >= star ? 'text-amber-400' : 'text-gray-600'
                    }`}
                    style={{ fontVariationSettings: (hoverRating || rating) >= star ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-amber-300">
              {rating === 5 ? 'Exceptional Resolution' : rating === 4 ? 'Satisfactory' : rating === 3 ? 'Neutral' : 'Needs Improvement'}
            </span>
          </div>

          {/* Quality Tags */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">What went well?</span>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => {
                const selected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selected
                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/25 border border-blue-500'
                        : 'bg-[#171717] text-gray-400 hover:text-white border border-[#262626]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Feedback Text */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Additional Comments for Institutional Ombudsman
            </label>
            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Share any specific notes about response speed, staff conduct, or resolution quality..."
              className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3.5 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-[#262626]">
            <Link
              to={`/student/grievance/${id}`}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Skip for now
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">check_circle</span>
              {isSubmitting ? 'Saving Feedback...' : 'Submit Official Rating'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default RateExperience;
