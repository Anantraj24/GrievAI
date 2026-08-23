import React from 'react';
import AuthorityLayout from '../components/AuthorityLayout';

const Workspace: React.FC = () => {
  return (
    <AuthorityLayout>
      {/* Workspace Layout */}
      <div className="flex-1 overflow-auto p-container-padding grid grid-cols-1 lg:grid-cols-12 gap-card-gap">
        {/* Left Main Panel: Original Complaint & Details (Spans 8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-card-gap">
          {/* Complaint Content */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Original Complaint • ID-8492</span>
                <h2 className="font-headline-lg text-headline-lg mt-1">Hostel Water Supply Issue</h2>
              </div>
              <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border border-[rgba(245,158,11,0.2)] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                Urgent
              </span>
            </div>
            <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/50">
              <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
                "Hostel mein 3 din se paani nahi aa raha aur warden ko complain karne ke baad bhi kuch nahi hua."
              </p>
              <p className="text-on-surface-variant text-sm mt-2 font-mono-sm">Submitted by: Student (Block A) • 2 hours ago</p>
            </div>
            
            {/* Attachments */}
            <div>
              <h3 className="font-label-md text-label-md text-on-surface-variant mb-3 uppercase">Evidence & Attachments</h3>
              <div className="flex gap-4">
                <div className="w-32 h-24 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center overflow-hidden relative group cursor-pointer">
                  <img alt="A close up photo of a dry water tap in a dimly lit hostel bathroom." className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWQhBLlqaQLAvoUwWKXCsI-5_Alj9lekOJkK7-Scuwph70YM02I1uao1sGOhYULU1OhZdzHFdcNkkfhSIPDag_LaLR3bNkRbe3zKsdVGhbsgrnHonptOa2yiR1wz-jjA1hQk0kdj3yzh37-VZx5UKTm67jK7yPkHN1fnI4yWREm_BkxtbaZI3pnr5_VFzRABN_jETZbGannSAMigq8y0zo_HOm8Xa6AEsQ2zUeCXgfsx6BaNpzF6TT" />
                  <span className="material-symbols-outlined absolute inset-0 m-auto w-6 h-6 text-white drop-shadow-md flex items-center justify-center">image</span>
                </div>
                <div className="w-32 h-24 rounded-lg bg-surface-container-high border border-outline-variant/30 flex flex-col items-center justify-center text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-2xl mb-1">picture_as_pdf</span>
                  <span className="text-xs font-mono-sm">Warden_Notice.pdf</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Timeline */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-[20px] flex-1">
            <h3 className="font-label-md text-label-md text-on-surface-variant mb-6 uppercase">Activity Timeline</h3>
            <div className="relative pl-6 border-l border-outline-variant/50 flex flex-col gap-6">
              <div className="relative">
                <div className="absolute -left-[31px] w-3 h-3 rounded-full bg-primary ring-4 ring-background"></div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">10:45 AM • Today</p>
                <p className="font-body-md text-body-md">AI Intelligence analysis completed. Classified as High Priority.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] w-3 h-3 rounded-full bg-outline-variant ring-4 ring-background"></div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">10:42 AM • Today</p>
                <p className="font-body-md text-body-md">Complaint registered in system via Student Portal.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel: AI Intelligence Zone (Spans 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-card-gap">
          {/* AI Core Analysis */}
          <div className="bg-[rgba(38,38,38,0.8)] backdrop-blur-[12px] border border-[rgba(59,130,246,0.2)] shadow-[0_0_24px_rgba(59,130,246,0.1)] rounded-xl p-[20px] border-l-[2px] border-l-[#3b82f6] flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#3b82f6]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                <span className="font-label-md text-label-md uppercase tracking-wider">AI Intelligence</span>
              </div>
              <span className="font-mono-sm text-primary">94% Confidence</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Category</span>
                <p className="font-body-md mt-1 font-medium">Hostel</p>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Subcategory</span>
                <p className="font-body-md mt-1 font-medium text-primary">Water Supply</p>
              </div>
            </div>
            
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold block mb-2">Extracted Entities</span>
              <ul className="space-y-2">
                <li className="flex justify-between items-center bg-surface-container-low px-3 py-2 rounded">
                  <span className="font-body-sm text-on-surface-variant">Duration</span>
                  <span className="font-body-sm font-medium">3 days</span>
                </li>
                <li className="flex justify-between items-center bg-surface-container-low px-3 py-2 rounded">
                  <span className="font-body-sm text-on-surface-variant">Location</span>
                  <span className="font-body-sm font-medium">Hostel Block A</span>
                </li>
                <li className="flex justify-between items-center bg-surface-container-low px-3 py-2 rounded">
                  <span className="font-body-sm text-on-surface-variant">Prior Report</span>
                  <span className="font-body-sm font-medium text-[#f59e0b]">Yes (Warden)</span>
                </li>
              </ul>
            </div>
            
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold block mb-2">Priority Signals</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-surface-container-high border border-outline-variant rounded text-xs text-on-surface">Essential Service</span>
                <span className="px-2 py-1 bg-surface-container-high border border-outline-variant rounded text-xs text-[#f59e0b]">Repeated Complaint</span>
              </div>
            </div>
          </div>
          
          {/* Routing Action */}
          <div className="bg-surface-container-high border border-[#262626] rounded-xl p-[20px] border-t-2 border-t-primary flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">route</span>
              <h3 className="font-label-md text-label-md uppercase text-on-surface">Routing Recommendation</h3>
            </div>
            
            <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/50 text-center">
              <p className="font-body-sm text-on-surface-variant mb-1">Suggested Department</p>
              <p className="font-headline-md text-headline-md text-primary font-semibold">Hostel Administration</p>
            </div>
            
            <div className="flex items-center justify-center gap-2 bg-[rgba(245,158,11,0.05)] py-2 rounded border border-[rgba(245,158,11,0.1)]">
              <span className="material-symbols-outlined text-[#f59e0b] text-[16px]">visibility</span>
              <span className="text-xs text-[#f59e0b] font-medium">Human Review Required</span>
            </div>
            
            <div className="flex flex-col gap-2 mt-2">
              <button className="w-full bg-[#3b82f6] text-white py-2.5 rounded-lg font-label-md text-label-md hover:bg-opacity-90 transition-opacity flex justify-center items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Accept Recommendation
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="w-full bg-transparent border border-[#262626] text-white py-2 rounded-lg font-label-md text-label-md hover:bg-surface-variant transition-colors">
                  Modify
                </button>
                <button className="w-full bg-transparent border border-[#262626] text-error py-2 rounded-lg font-label-md text-label-md hover:bg-[rgba(255,180,171,0.1)] transition-colors">
                  Override
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthorityLayout>
  );
};

export default Workspace;
