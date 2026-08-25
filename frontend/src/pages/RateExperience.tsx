import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/api';

const RateExperience: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRating = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (rating > 0 && id) {
      setIsSubmitting(true);
      setError(null);
      try {
        await api.post(`/api/v1/grievances/${id}/feedback`, {
          rating,
          comments: comments || null
        });
        setSubmitted(true);
      } catch (err: any) {
        console.error("Failed to submit feedback", err);
        setError(err.response?.data?.detail || "Failed to submit feedback");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-gutter relative">
      {/* Background Atmospheric Element (Subtle) */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-xl pointer-events-none -z-10 blur-3xl opacity-50"></div>
      
      <main className="w-full max-w-2xl relative">
        {/* Feedback Form Container */}
        {!submitted ? (
          <div className="bg-surface border border-surface-variant rounded-xl p-container-padding shadow-2xl shadow-black/50 transition-all duration-500 transform translate-y-0 opacity-100">
            {/* Header */}
            <div className="text-center mb-stack-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container/20 text-primary mb-stack-md">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm">Grievance Resolved</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">How was your grievance handled?</p>
              {error && (
                <div className="mt-4 p-3 bg-error/10 text-error border border-error/20 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}
            </div>
            
            {/* Rating Component */}
            <div className="flex justify-center mb-stack-lg">
              <div className="star-rating flex gap-unit cursor-pointer">
                {[1, 2, 3, 4, 5].map((value) => (
                  <span 
                    key={value}
                    className={`material-symbols-outlined text-4xl transition-all duration-200 hover:scale-110 ${
                      value <= (hoverRating || rating) ? 'text-primary' : 'text-surface-variant'
                    }`}
                    style={{ fontVariationSettings: value <= (hoverRating || rating) ? "'FILL' 1" : "'FILL' 0" }}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRating(value)}
                  >
                    star
                  </span>
                ))}
              </div>
            </div>
            
            {/* Text Area */}
            <div className="mb-stack-lg">
              <label className="block font-label-md text-label-md text-on-surface-variant mb-stack-sm" htmlFor="comments">ADDITIONAL COMMENTS (OPTIONAL)</label>
              <textarea 
                className="w-full bg-surface-container-low border border-surface-variant rounded-lg p-stack-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors resize-none placeholder:text-outline" 
                id="comments" 
                placeholder="Tell us more about your experience..." 
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              ></textarea>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-stack-md">
              <button onClick={() => navigate('/student/dashboard')} className="px-stack-md py-stack-sm border border-surface-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors" type="button">
                Skip
              </button>
              <button 
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className={`px-stack-lg py-stack-sm rounded-lg font-label-md text-label-md transition-colors shadow-lg ${
                  rating > 0 
                    ? 'bg-primary text-[#001a42] hover:bg-primary/90 shadow-primary/20' 
                    : 'bg-surface-variant text-on-surface-variant opacity-50 cursor-not-allowed'
                }`}
                type="button"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </div>
        ) : (
          /* Success State Container */
          <div className="absolute inset-0 bg-surface border border-surface-variant rounded-xl p-container-padding flex flex-col items-center justify-center text-center transition-all duration-500 transform">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-container/20 text-primary mb-stack-lg animate-pulse">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm">Thank You</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg">Your feedback helps us improve the grievance resolution process.</p>
            <button 
              onClick={() => navigate('/student/dashboard')}
              className="px-stack-lg py-stack-sm border border-surface-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors inline-flex items-center gap-unit" 
              type="button"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_back</span>
              Back to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default RateExperience;
