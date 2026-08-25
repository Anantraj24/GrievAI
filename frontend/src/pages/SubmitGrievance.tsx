import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../api/api';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', to: '/student/dashboard' },
  { icon: 'folder_managed', label: 'My Grievances', to: '/student/grievances' },
  { icon: 'notifications', label: 'Notifications', to: '/student/notifications' },
];

const SubmitGrievance: React.FC = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        description,
        location: location || null,
        title: null, // Let AI extract or generate a title if needed
      };
      await api.post('/api/v1/grievances/', payload);
      navigate('/student/success');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit grievance');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout navItems={navItems} userRoleLabel="Student Portal" userName="Anant">
      <div className="flex-1 flex flex-col items-center justify-center relative w-full h-full">
        {/* Focused Canvas for Submission */}
        <div className="w-full max-w-3xl flex flex-col gap-stack-lg z-10">
          {/* Header */}
          <header className="text-center">
            <h1 className="font-display-lg text-display-lg text-on-surface mb-stack-sm">Tell us what happened?</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
              Please provide detailed information to help us resolve the issue efficiently.
            </p>
          </header>
          
          {/* Form Card */}
          <form 
            onSubmit={handleSubmit}
            className="bg-[#1A1D23] border border-[#2D3139] rounded-lg p-container-padding flex flex-col gap-stack-md relative z-10"
          >
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-md">
                {error}
              </div>
            )}
            
            {/* Natural Language Textarea */}
            <div className="flex flex-col gap-stack-sm">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="grievance-description">
                Describe your issue
              </label>
              <textarea 
                className="bg-[#1A1D23] border border-[#2D3139] text-on-surface font-body-lg text-body-lg rounded-md p-gutter focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none placeholder-outline" 
                id="grievance-description" 
                placeholder="E.g., The main water pipe in block C has been leaking since yesterday morning..." 
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            
            {/* Contextual Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
              <div className="flex flex-col gap-stack-sm">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="grievance-category">
                  Category (Optional)
                </label>
                <select className="bg-[#1A1D23] border border-[#2D3139] text-on-surface font-body-md text-body-md rounded-md p-unit h-12 px-gutter focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer" id="grievance-category" defaultValue="">
                  <option disabled value="">Select category</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="safety">Safety & Security</option>
                  <option value="facilities">Facilities</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-stack-sm">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="grievance-location">
                  Location (Optional)
                </label>
                <select 
                  className="bg-[#1A1D23] border border-[#2D3139] text-on-surface font-body-md text-body-md rounded-md p-unit h-12 px-gutter focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer" 
                  id="grievance-location" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option disabled value="">Select location</option>
                  <option value="block-a">Block A</option>
                  <option value="block-b">Block B</option>
                  <option value="block-c">Block C</option>
                  <option value="common">Common Area</option>
                </select>
              </div>
            </div>
            
            {/* Evidence Upload */}
            <div className="flex flex-col gap-stack-sm mt-stack-sm">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Evidence & Attachments</label>
              <div className="border-2 border-dashed border-[#2D3139] rounded-lg p-container-padding flex flex-col items-center justify-center text-center gap-stack-sm bg-surface/50 hover:bg-surface-container-high/30 transition-colors cursor-pointer group">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors" style={{ fontVariationSettings: "'FILL' 0" }}>cloud_upload</span>
                <div>
                  <p className="font-body-lg text-body-lg text-on-surface">Drag and drop files here, or click to browse</p>
                  <p className="font-body-md text-body-md text-outline">Supported formats: JPG, PNG, PDF (Max 10MB)</p>
                </div>
              </div>
              
              {/* Attached Files Preview (Example) */}
              <div className="mt-stack-sm flex flex-col gap-unit">
                <p className="font-label-md text-label-md text-on-surface-variant">Attached Files (1)</p>
                <div className="flex items-center justify-between p-gutter bg-surface-container-low border border-[#2D3139] rounded-md">
                  <div className="flex items-center gap-gutter">
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 border border-[#2D3139]">
                      <img alt="Evidence preview" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1UbaN0UvoVl_B0hB_VA4z4wp6iJwCzqqlEiBQ5urOHbEzf558yoy58IF-DBYPdKoipBv5QvWeqoqmS6PyyHSSfsXAaIXUDYmtB-X8sHoGjL66tpBc_QyRALVsOI-rLQrmeubcsUDifqE4mLC21lV2BSxvQqz1qRUOYNw5euTdJ_8kU7715MFzN1ALhd1wEMXTMJZn5QadJ4iVZINCto7CDr4Vi6vG19V5kFBqy_AR2nCxxWrqoZTdTSG9U" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-md text-body-md text-on-surface truncate max-w-[200px] md:max-w-xs">IMG_20231025_0915.jpg</span>
                      <span className="font-label-md text-label-md text-outline">2.4 MB</span>
                    </div>
                  </div>
                  <button className="text-on-surface-variant hover:text-error transition-colors p-unit rounded-full hover:bg-surface-container-highest" type="button">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>delete</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-end gap-gutter mt-stack-md pt-stack-md border-t border-[#2D3139]">
              <button onClick={() => navigate(-1)} className="px-6 py-3 font-body-lg text-body-lg font-medium text-on-surface hover:text-primary hover:bg-surface-container-high transition-colors rounded-md" type="button" disabled={isSubmitting}>
                Cancel
              </button>
              <button disabled={isSubmitting} className="bg-[#3B82F6] disabled:opacity-50 text-white px-8 py-3 rounded-md font-body-lg text-body-lg font-medium hover:bg-[#2563EB] transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]" type="submit">
                {isSubmitting ? 'Submitting...' : 'Submit Grievance'}
              </button>
            </div>
          </form>
        </div>
        {/* Background Atmospheric Effect */}
        <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.05) 0%, transparent 60%)' }}></div>
      </div>
    </Layout>
  );
};

export default SubmitGrievance;
