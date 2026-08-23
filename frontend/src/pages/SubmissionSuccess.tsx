import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', to: '/student/dashboard' },
  { icon: 'folder_managed', label: 'My Grievances', to: '/student/grievances' },
  { icon: 'notifications', label: 'Notifications', to: '/student/notifications' },
];

const SubmissionSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout navItems={navItems} userRoleLabel="Student Portal" userName="Anant">
      <div className="flex-1 flex items-center justify-center relative w-full h-full">
        {/* Success Card Canvas */}
        <div className="w-full max-w-2xl z-10">
          {/* Bento Style Success Card */}
          <div className="bg-surface-container-low border border-surface-variant rounded-xl p-container-padding flex flex-col items-center text-center shadow-lg relative overflow-hidden">
            {/* Subtle background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent pointer-events-none"></div>
            
            {/* Success Icon */}
            <div className="w-20 h-20 bg-primary-container/20 rounded-full flex items-center justify-center mb-stack-lg border border-primary-container/30 relative z-10">
              <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            
            {/* Header */}
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm relative z-10">Grievance Submitted</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg relative z-10 max-w-md">
              Your case has been successfully logged and securely routed to the appropriate department for review.
            </p>
            
            {/* Details Bento Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-stack-md mb-stack-lg relative z-10">
              {/* Reference Box */}
              <div className="bg-surface-container border border-surface-variant rounded-lg p-stack-md flex flex-col items-start text-left">
                <span className="font-label-md text-label-md text-on-surface-variant mb-unit">REFERENCE NO.</span>
                <span className="font-headline-md text-headline-md text-on-surface">GRV-00142</span>
              </div>
              {/* Status Box */}
              <div className="bg-surface-container border border-surface-variant rounded-lg p-stack-md flex flex-col items-start text-left">
                <span className="font-label-md text-label-md text-on-surface-variant mb-unit">CURRENT STATUS</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                  <span className="font-label-md text-label-md text-primary">Under Review</span>
                </div>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="w-full bg-surface-container-high border border-surface-variant rounded-lg p-stack-md mb-stack-lg text-left relative z-10">
              <div className="flex items-center gap-2 mb-stack-sm">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '20px' }}>info</span>
                <h3 className="font-body-md text-body-md font-medium text-on-surface">Expected Next Steps</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant mt-0.5" style={{ fontSize: '16px' }}>schedule</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">Authority review within 24h.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant mt-0.5" style={{ fontSize: '16px' }}>notifications</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">You will be notified via email upon status change.</span>
                </li>
              </ul>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-stack-md w-full relative z-10">
              <button 
                onClick={() => navigate('/student/grievance/GRV-00142')}
                className="flex-1 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-body-md text-body-md font-medium py-3 px-6 rounded-lg transition-colors border border-transparent"
              >
                View Grievance
              </button>
              <button 
                onClick={() => navigate('/student/dashboard')}
                className="flex-1 bg-transparent hover:bg-surface-container-high border border-surface-variant text-on-surface font-body-md text-body-md font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmissionSuccess;
