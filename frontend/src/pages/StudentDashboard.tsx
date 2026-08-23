import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', to: '/student/dashboard' },
  { icon: 'folder_managed', label: 'My Grievances', to: '/student/grievances' },
  { icon: 'notifications', label: 'Notifications', to: '/student/notifications' },
];

const StudentDashboard: React.FC = () => {
  return (
    <Layout navItems={navItems} userRoleLabel="Student Portal" userName="Anant">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Welcome back, Anant</h2>
          <p className="text-on-surface-variant mt-unit">Here is an overview of your academic and administrative requests.</p>
        </div>
        <div className="flex gap-stack-sm">
          <button className="border border-[#2D3139] bg-transparent text-primary font-body-md text-body-md font-medium py-2 px-4 rounded hover:bg-surface-container-high transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0" }}>download</span>
            Export Report
          </button>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter auto-rows-[minmax(180px,_auto)]">
        {/* Metric Cards (Cols 1-8) */}
        <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-gutter h-full">
          {/* Total */}
          <div className="bg-surface-container-low border border-[#2D3139] rounded-lg p-container-padding flex flex-col justify-between hover:bg-[#2D3139] transition-colors duration-300">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase">Total</span>
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>folder</span>
            </div>
            <div className="font-display-lg text-display-lg text-on-surface mt-stack-md">12</div>
          </div>
          {/* Active */}
          <div className="bg-surface-container-low border border-[#2D3139] rounded-lg p-container-padding flex flex-col justify-between hover:bg-[#2D3139] transition-colors duration-300">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase">Active</span>
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <div className="font-display-lg text-display-lg text-on-surface mt-stack-md">3</div>
          </div>
          {/* Under Review */}
          <div className="bg-surface-container-low border border-[#2D3139] rounded-lg p-container-padding flex flex-col justify-between hover:bg-[#2D3139] transition-colors duration-300">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase">Under Review</span>
              <span className="material-symbols-outlined text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
            </div>
            <div className="font-display-lg text-display-lg text-on-surface mt-stack-md">5</div>
          </div>
          {/* Resolved */}
          <div className="bg-surface-container-low border border-[#2D3139] rounded-lg p-container-padding flex flex-col justify-between hover:bg-[#2D3139] transition-colors duration-300">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-label-md text-label-md uppercase">Resolved</span>
              <span className="material-symbols-outlined text-[#3B82F6]" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
            </div>
            <div className="font-display-lg text-display-lg text-on-surface mt-stack-md">4</div>
          </div>
        </div>

        {/* Submit Grievance CTA Card (Cols 9-12) */}
        <div className="md:col-span-4 bg-surface-container-low border border-[#2D3139] rounded-lg p-container-padding flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-unit">File a New Case</h3>
              <p className="text-on-surface-variant text-sm">Submit an academic, administrative, or facility-related grievance directly to the review board.</p>
            </div>
            <Link
              to="/student/submit"
              className="mt-stack-md w-full bg-[#3B82F6] text-white font-body-md text-body-md font-medium py-3 px-4 rounded hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 group-hover:scale-[1.02] duration-200"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>edit_document</span>
              Submit Grievance
            </Link>
          </div>
        </div>

        {/* Recent Grievances List (Cols 1-8) */}
        <div className="md:col-span-8 bg-surface-container-low border border-[#2D3139] rounded-lg flex flex-col h-[400px]">
          <div className="p-container-padding border-b border-[#2D3139] flex justify-between items-center shrink-0">
            <h3 className="font-headline-md text-headline-md text-on-surface">Recent Submissions</h3>
            <Link to="/student/grievances" className="text-primary hover:text-primary-fixed-dim transition-colors text-sm font-medium">View All</Link>
          </div>
          <div className="overflow-y-auto flex-1">
            <div className="min-w-full">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-container-padding py-stack-sm border-b border-[#2D3139] bg-surface-container-highest/30 sticky top-0 backdrop-blur-sm z-10">
                <div className="col-span-4 font-label-md text-label-md text-on-surface-variant uppercase">Case ID / Subject</div>
                <div className="col-span-3 font-label-md text-label-md text-on-surface-variant uppercase">Department</div>
                <div className="col-span-3 font-label-md text-label-md text-on-surface-variant uppercase">Status</div>
                <div className="col-span-2 font-label-md text-label-md text-on-surface-variant uppercase text-right">Date</div>
              </div>
              {/* Rows */}
              <div className="flex flex-col">
                <Link className="grid grid-cols-12 gap-4 px-container-padding py-stack-md border-b border-[#2D3139] hover:bg-[#2D3139]/50 transition-colors group" to="/student/grievance/GRV-2023-089">
                  <div className="col-span-4 flex flex-col justify-center">
                    <span className="text-on-surface font-medium group-hover:text-primary transition-colors truncate">GRV-2023-089</span>
                    <span className="text-on-surface-variant text-sm truncate">Grade Discrepancy in CS301</span>
                  </div>
                  <div className="col-span-3 flex items-center text-on-surface-variant text-sm">Computer Science</div>
                  <div className="col-span-3 flex items-center">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-[#3B82F6]/10 text-[#3B82F6] font-label-md text-label-md border border-[#3B82F6]/20">In Progress</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end text-on-surface-variant text-sm font-label-md">Oct 24</div>
                </Link>
                <Link className="grid grid-cols-12 gap-4 px-container-padding py-stack-md border-b border-[#2D3139] hover:bg-[#2D3139]/50 transition-colors group" to="/student/grievance/GRV-2023-085">
                  <div className="col-span-4 flex flex-col justify-center">
                    <span className="text-on-surface font-medium group-hover:text-primary transition-colors truncate">GRV-2023-085</span>
                    <span className="text-on-surface-variant text-sm truncate">Hostel Wi-Fi Downtime</span>
                  </div>
                  <div className="col-span-3 flex items-center text-on-surface-variant text-sm">IT Services</div>
                  <div className="col-span-3 flex items-center">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-error/10 text-error font-label-md text-label-md border border-error/20">Pending Action</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end text-on-surface-variant text-sm font-label-md">Oct 20</div>
                </Link>
                <Link className="grid grid-cols-12 gap-4 px-container-padding py-stack-md border-b border-[#2D3139] hover:bg-[#2D3139]/50 transition-colors group" to="/student/grievance/GRV-2023-072">
                  <div className="col-span-4 flex flex-col justify-center">
                    <span className="text-on-surface font-medium group-hover:text-primary transition-colors truncate">GRV-2023-072</span>
                    <span className="text-on-surface-variant text-sm truncate">Library Book Unavailability</span>
                  </div>
                  <div className="col-span-3 flex items-center text-on-surface-variant text-sm">Library</div>
                  <div className="col-span-3 flex items-center">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-surface-variant text-on-surface-variant font-label-md text-label-md border border-outline-variant">Resolved</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end text-on-surface-variant text-sm font-label-md">Oct 12</div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Feed (Cols 9-12) */}
        <div className="md:col-span-4 bg-surface-container-low border border-[#2D3139] rounded-lg flex flex-col h-[400px]">
          <div className="p-container-padding border-b border-[#2D3139] flex justify-between items-center shrink-0">
            <h3 className="font-headline-md text-headline-md text-on-surface">Recent Updates</h3>
            <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-full">3 New</span>
          </div>
          <div className="overflow-y-auto flex-1 p-stack-md space-y-stack-md">
            {/* Notification Item */}
            <div className="flex gap-stack-sm relative">
              <div className="w-8 h-8 rounded-full bg-[#3B82F6]/20 flex items-center justify-center shrink-0 border border-[#3B82F6]/30">
                <span className="material-symbols-outlined text-sm text-[#3B82F6]" style={{ fontVariationSettings: "'FILL' 0" }}>update</span>
              </div>
              <div className="flex-1 pb-stack-sm border-b border-[#2D3139]">
                <p className="text-sm text-on-surface leading-tight">Status changed to <span className="text-[#3B82F6] font-medium">In Progress</span> for GRV-2023-089</p>
                <p className="text-xs text-on-surface-variant mt-1 font-label-md">2 hours ago</p>
              </div>
            </div>
            {/* Notification Item */}
            <div className="flex gap-stack-sm relative">
              <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center shrink-0 border border-outline-variant">
                <span className="material-symbols-outlined text-sm text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>comment</span>
              </div>
              <div className="flex-1 pb-stack-sm border-b border-[#2D3139]">
                <p className="text-sm text-on-surface leading-tight">Prof. Smith added a comment to GRV-2023-089</p>
                <p className="text-xs text-on-surface-variant mt-1 font-label-md">5 hours ago</p>
              </div>
            </div>
            {/* Notification Item */}
            <div className="flex gap-stack-sm relative opacity-70">
              <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center shrink-0 border border-outline-variant">
                <span className="material-symbols-outlined text-sm text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 0" }}>check_circle</span>
              </div>
              <div className="flex-1 pb-stack-sm">
                <p className="text-sm text-on-surface leading-tight">GRV-2023-072 was marked as Resolved</p>
                <p className="text-xs text-on-surface-variant mt-1 font-label-md">12 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StudentDashboard;
