import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', to: '/student/dashboard' },
  { icon: 'folder_managed', label: 'My Grievances', to: '/student/grievances' },
  { icon: 'notifications', label: 'Notifications', to: '/student/notifications' },
];

const GrievanceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout navItems={navItems} userRoleLabel="Student Portal" userName="Anant">
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="flex-1">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-label-md text-label-md bg-surface-container text-on-surface-variant px-2 py-1 rounded">
                  {id || 'GRV-00142'}
                </span>
                <span className="font-label-md text-label-md bg-error-container/20 text-error px-2 py-1 rounded border border-error/30 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 0" }}>priority_high</span> HIGH PRIORITY
                </span>
                <span className="font-label-md text-label-md bg-primary-container/20 text-primary px-2 py-1 rounded border border-primary/30 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 0" }}>sync</span> IN PROGRESS
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface">Hostel Water Supply Disturbance</h2>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-surface-variant rounded-lg text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>assignment_return</span>
                Reassign
              </button>
              <Link to={`/student/rate/${id || 'GRV-00142'}`} className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors font-label-md text-label-md flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>check_circle</span>
                Mark Resolved
              </Link>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (Content & Attachments) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Original Complaint */}
              <div className="bg-surface rounded-xl border border-surface-variant p-container-padding">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>description</span>
                  Original Complaint
                </h3>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  The water supply in Block C, 3rd floor bathrooms has been severely disrupted for the past 48 hours. The pressure is practically non-existent, and the water that does come out is slightly discolored. This is affecting over 50 students during exam week. We have tried contacting the hostel warden but received no response. Immediate action is required.
                </p>
                <div className="mt-6 flex items-center gap-4 text-on-surface-variant border-t border-surface-variant pt-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>person</span>
                    <span className="font-label-md text-label-md">Submitted by: Student ID 2021A7PS0014</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_today</span>
                    <span className="font-label-md text-label-md">Oct 24, 2023, 08:30 AM</span>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="bg-surface rounded-xl border border-surface-variant p-container-padding">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>attachment</span>
                  Attachments
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group rounded-lg overflow-hidden border border-surface-variant">
                    <img alt="Evidence of leaking faucet" className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida/AEtjO1UbaN0UvoVl_B0hB_VA4z4wp6iJwCzqqlEiBQ5urOHbEzf558yoy58IF-DBYPdKoipBv5QvWeqoqmS6PyyHSSfsXAaIXUDYmtB-X8sHoGjL66tpBc_QyRALVsOI-rLQrmeubcsUDifqE4mLC21lV2BSxvQqz1qRUOYNw5euTdJ_8kU7715MFzN1ALhd1wEMXTMJZn5QadJ4iVZINCto7CDr4Vi6vG19V5kFBqy_AR2nCxxWrqoZTdTSG9U" />
                    <div className="absolute inset-0 bg-surface-container-lowest/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="p-2 bg-surface rounded-full text-primary hover:bg-surface-container-high transition-colors">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>zoom_in</span>
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-surface-container-lowest/80 backdrop-blur-sm border-t border-surface-variant">
                      <span className="font-label-md text-label-md text-on-surface flex justify-between items-center">
                        evidence_img_01.jpg
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>download</span>
                      </span>
                    </div>
                  </div>
                  {/* Placeholder for another attachment to show layout */}
                  <div className="relative rounded-lg overflow-hidden border border-surface-variant bg-surface-container-low flex items-center justify-center h-48 border-dashed border-2">
                    <div className="text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl mb-2" style={{ fontVariationSettings: "'FILL' 0" }}>add_photo_alternate</span>
                      <p className="font-label-md text-label-md">Request More Evidence</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Authority Response */}
              <div className="bg-surface rounded-xl border border-surface-variant p-container-padding">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>forum</span>
                  Authority Response
                </h3>
                <div className="space-y-6">
                  {/* Previous Reply */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 border border-surface-variant">
                      <span className="material-symbols-outlined text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>engineering</span>
                    </div>
                    <div className="flex-1 bg-surface-container-low p-4 rounded-lg rounded-tl-none border border-surface-variant">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-label-md text-label-md text-on-surface font-bold">Maintenance Team</span>
                        <span className="font-label-md text-label-md text-on-surface-variant">Oct 24, 2023, 11:45 AM</span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Team dispatched to Block C. Initial inspection suggests a valve failure in the main supply line. Replacement parts requested. Expected resolution by EOD.
                      </p>
                    </div>
                  </div>
                  {/* Input Area */}
                  <div className="flex gap-4 pt-4 border-t border-surface-variant">
                    <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0 border border-primary/30">
                      <span className="font-label-md text-label-md text-primary">ST</span>
                    </div>
                    <div className="flex-1">
                      <textarea className="w-full bg-surface-container-low border border-surface-variant rounded-lg p-3 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all outline-none resize-none h-24" placeholder="Reply to update..."></textarea>
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex gap-2">
                          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded hover:bg-surface-container-high">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>attach_file</span>
                          </button>
                        </div>
                        <button className="px-4 py-2 bg-surface-container-high text-on-surface rounded-lg hover:bg-surface-variant border border-surface-variant transition-colors font-label-md text-label-md flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>send</span>
                          Post Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Metadata & Timeline) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Case Metadata */}
              <div className="bg-surface rounded-xl border border-surface-variant p-container-padding">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>info</span>
                  Case Metadata
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1 border-b border-surface-variant pb-3">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase">Assigned Department</span>
                    <span className="font-body-lg text-body-lg text-on-surface font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      Hostel Administration
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-surface-variant pb-3">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase">SLA Status</span>
                    <div className="flex items-center justify-between">
                      <span className="font-body-lg text-body-lg text-error font-medium">24h Resolution</span>
                      <span className="font-label-md text-label-md bg-error-container/20 text-error px-2 py-1 rounded border border-error/30">14h Remaining</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-2 overflow-hidden">
                      <div className="bg-error h-1.5 rounded-full w-[42%]"></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-surface-variant pb-3">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase">Last Updated</span>
                    <span className="font-body-md text-body-md text-on-surface">Oct 24, 2023, 11:45 AM</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase">Tags</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="font-label-md text-label-md bg-surface-container-high text-on-surface px-2 py-1 rounded border border-surface-variant">Maintenance</span>
                      <span className="font-label-md text-label-md bg-surface-container-high text-on-surface px-2 py-1 rounded border border-surface-variant">Plumbing</span>
                      <span className="font-label-md text-label-md bg-surface-container-high text-on-surface px-2 py-1 rounded border border-surface-variant">Block C</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="bg-surface rounded-xl border border-surface-variant p-container-padding flex-1">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>timeline</span>
                  Resolution Journey
                </h3>
                <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-7 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-surface-variant before:to-surface-variant before:left-0 before:top-2">
                  {/* Completed Stage */}
                  <div className="relative flex items-start gap-4">
                    <div className="absolute -left-[33px] bg-surface rounded-full p-1 z-10 border border-primary text-primary bg-primary/10">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>check</span>
                    </div>
                    <div>
                      <h4 className="font-body-md text-body-md font-bold text-on-surface">Submitted</h4>
                      <p className="font-label-md text-label-md text-on-surface-variant mt-1">Oct 24, 08:30 AM</p>
                    </div>
                  </div>
                  {/* Completed Stage */}
                  <div className="relative flex items-start gap-4">
                    <div className="absolute -left-[33px] bg-surface rounded-full p-1 z-10 border border-primary text-primary bg-primary/10">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>check</span>
                    </div>
                    <div>
                      <h4 className="font-body-md text-body-md font-bold text-on-surface">Under Review</h4>
                      <p className="font-label-md text-label-md text-on-surface-variant mt-1">Oct 24, 09:15 AM</p>
                    </div>
                  </div>
                  {/* Completed Stage */}
                  <div className="relative flex items-start gap-4">
                    <div className="absolute -left-[33px] bg-surface rounded-full p-1 z-10 border border-primary text-primary bg-primary/10">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>check</span>
                    </div>
                    <div>
                      <h4 className="font-body-md text-body-md font-bold text-on-surface">Assigned</h4>
                      <p className="font-label-md text-label-md text-on-surface-variant mt-1">Maintenance Team • Oct 24, 09:45 AM</p>
                    </div>
                  </div>
                  {/* Active Stage */}
                  <div className="relative flex items-start gap-4">
                    <div className="absolute -left-[33px] bg-surface rounded-full p-1 z-10 border border-primary text-primary bg-primary/20 animate-pulse">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>build</span>
                    </div>
                    <div>
                      <h4 className="font-body-md text-body-md font-bold text-primary">In Progress</h4>
                      <p className="font-label-md text-label-md text-on-surface-variant mt-1">Team on site. Estimating repair time.</p>
                    </div>
                  </div>
                  {/* Pending Stage */}
                  <div className="relative flex items-start gap-4 opacity-50">
                    <div className="absolute -left-[33px] bg-surface rounded-full p-1 z-10 border border-surface-variant text-surface-variant">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>verified</span>
                    </div>
                    <div>
                      <h4 className="font-body-md text-body-md font-bold text-on-surface">Resolved</h4>
                      <p className="font-label-md text-label-md text-on-surface-variant mt-1">Pending fix confirmation</p>
                    </div>
                  </div>
                  {/* Pending Stage */}
                  <div className="relative flex items-start gap-4 opacity-50">
                    <div className="absolute -left-[33px] bg-surface rounded-full p-1 z-10 border border-surface-variant text-surface-variant">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>lock</span>
                    </div>
                    <div>
                      <h4 className="font-body-md text-body-md font-bold text-on-surface">Closed</h4>
                      <p className="font-label-md text-label-md text-on-surface-variant mt-1">Awaiting student sign-off</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GrievanceDetails;
