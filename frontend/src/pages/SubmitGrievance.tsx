import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { GrievanceService } from '../services/grievanceService';
import { AIEngine } from '../services/aiEngine';
import { AIAnalysisResult } from '../types';
import { AIInsightCard } from '../components/common/AIInsightCard';
import { useToast } from '../context/ToastContext';

const SubmitGrievance: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [attachments, setAttachments] = useState<Array<{ name: string; size: string; type: string; url: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liveAnalysis, setLiveAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Debounced real-time AI live analysis
  useEffect(() => {
    if (description.trim().length > 15) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        const result = AIEngine.analyze(description, location);
        setLiveAnalysis(result);
        if (!category) {
          setCategory(result.category);
        }
        setIsAnalyzing(false);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setLiveAnalysis(null);
    }
  }, [description, location, category]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newAtt = {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: file.type || 'image/jpeg',
        url: file.type.startsWith('image')
          ? URL.createObjectURL(file)
          : 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80',
      };
      setAttachments((prev) => [...prev, newAtt]);
      toast.info(`Attached file: ${file.name}`);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.warning('Please provide a description of the issue.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = GrievanceService.create({
        title: title.trim() || undefined,
        description: description.trim(),
        location: location.trim() || 'Campus Facilities',
        category: category || undefined,
        studentId: user?.id || 'usr_student_01',
        studentName: user?.name || 'AnantRaj',
        studentEmail: user?.email || 'anantraj@institution.edu',
        attachments,
      });

      toast.success(`Grievance #${created.id} submitted successfully!`);
      navigate('/student/success', { state: { grievance: created } });
    } catch {
      toast.error('Failed to submit grievance. Please retry.');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout userRoleLabel="Student Portal" userName={user?.name || 'Student'}>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            AUTONOMOUS CASE TRIAGING PIPELINE
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">File an Institutional Grievance</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Provide details of your academic, facility, or residential grievance. Our local AI engine will classify and route it to the responsible authority.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Form (Left 7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-5 bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 shadow-xl">
            {/* Subject/Title (Optional) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center justify-between">
                <span>Case Headline (Optional)</span>
                <span className="text-[10px] text-gray-500">AI can auto-generate this</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AC leaking water in Lab 402 onto computer desks"
                className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Natural Language Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center justify-between">
                <span>Detailed Description *</span>
                {isAnalyzing && (
                  <span className="text-[10px] font-mono text-purple-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] animate-spin">sync</span>
                    Analyzing NLP signals...
                  </span>
                )}
              </label>
              <textarea
                required
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened in detail, including time of incident, equipment or courses affected, and any safety hazards..."
                className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
              />
            </div>

            {/* Location & Category Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Campus Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Academic Block 4, Lab 402"
                  className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Category Override</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="">Auto-Detect (Recommended)</option>
                  <option value="Estate & Campus Facilities">Estate & Campus Facilities</option>
                  <option value="Academic Affairs">Academic Affairs</option>
                  <option value="IT & Digital Services">IT & Digital Services</option>
                  <option value="Hostel & Residence">Hostel & Residence</option>
                  <option value="Campus Safety & Harassment">Campus Safety & Harassment</option>
                  <option value="Finance & Accounts">Finance & Accounts</option>
                </select>
              </div>
            </div>

            {/* Evidence & Attachment Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Photo Evidence & Documents (Optional)
              </label>

              <label className="border-2 border-dashed border-[#2D3139] hover:border-blue-500/50 bg-[#171717]/50 hover:bg-[#171717] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*,.pdf" />
                <span className="material-symbols-outlined text-3xl text-gray-500 group-hover:text-blue-400 transition-colors mb-2">
                  cloud_upload
                </span>
                <p className="text-xs font-semibold text-gray-200">Click to upload photo or document</p>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">JPG, PNG, PDF (Up to 10MB)</p>
              </label>

              {/* Uploaded Files List */}
              {attachments.length > 0 && (
                <div className="flex flex-col gap-2 mt-1">
                  {attachments.map((att, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 bg-[#171717] border border-[#262626] rounded-xl text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="material-symbols-outlined text-blue-400 text-base">image</span>
                        <span className="text-white truncate font-medium">{att.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono shrink-0">({att.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(i)}
                        className="text-gray-500 hover:text-red-400 p-1"
                      >
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-4 border-t border-[#262626] mt-2">
              <Link
                to="/student/dashboard"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                {isSubmitting ? 'Submitting & Routing...' : 'Submit Grievance Docket'}
              </button>
            </div>
          </form>

          {/* Real-time AI Analysis Sidebar (Right 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-purple-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
                Live AI Triage Inspector
              </h3>
              {liveAnalysis && (
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/30">
                  Ready to Route
                </span>
              )}
            </div>

            {liveAnalysis ? (
              <div className="flex flex-col gap-4 animate-slide-in">
                <AIInsightCard analysis={liveAnalysis} />

                {/* Duplicate Alert CTA if duplicate found */}
                {liveAnalysis.similarGrievances.length > 0 && (
                  <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 flex flex-col gap-2 shadow-lg">
                    <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase">
                      <span className="material-symbols-outlined text-base">info</span>
                      Similar Complaint Already In Progress
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Case #{liveAnalysis.similarGrievances[0].id} was filed previously for this area. Submitting this will automatically link your docket to the active master ticket for expedited resolution.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#10131a] border border-dashed border-[#2D3139] rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[320px]">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>
                    psychology
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wide">Live AI Preview Awaiting Input</h4>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                  Start typing your description on the left. The neural analyzer will evaluate category confidence, severity, and existing duplicate complaints in real time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitGrievance;
