import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', to: '/student/dashboard' },
  { icon: 'folder_managed', label: 'My Grievances', to: '/student/grievances' },
  { icon: 'notifications', label: 'Notifications', to: '/student/notifications' },
];

const MyGrievances: React.FC = () => {
  return (
    <Layout navItems={navItems} userRoleLabel="Student Portal" userName="Anant">
      <div className="max-w-7xl mx-auto space-y-[24px] w-full">
        {/* Page Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-unit">My Grievances</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Track, manage, and resolve student concerns efficiently.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-[#2D3139] text-on-surface rounded-lg font-body-md text-body-md hover:bg-surface-container-low transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>download</span>
              Export
            </button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-[24px]">
          {/* Stats Cards (Top Row) */}
          <div className="col-span-12 md:col-span-3 bg-[#1A1D23] border border-[#2D3139] rounded-xl p-[24px] flex flex-col justify-between hover:bg-[#2D3139]/20 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase">Total Active</span>
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>folder_open</span>
            </div>
            <div>
              <div className="font-display-lg text-display-lg text-on-surface">42</div>
              <div className="font-label-md text-label-md text-[#3B82F6] flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_upward</span> +3 this week
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-3 bg-[#1A1D23] border border-[#2D3139] rounded-xl p-[24px] flex flex-col justify-between hover:bg-[#2D3139]/20 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase">Critical Priority</span>
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 0" }}>priority_high</span>
            </div>
            <div>
              <div className="font-display-lg text-display-lg text-on-surface">7</div>
              <div className="font-label-md text-label-md text-on-surface-variant mt-1">Require immediate attention</div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 bg-[#1A1D23] border border-[#2D3139] rounded-xl p-[24px] flex flex-col relative overflow-hidden group">
            {/* Abstract Background Decoration */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#3B82F6]/5 rounded-full blur-3xl group-hover:bg-[#3B82F6]/10 transition-all duration-500"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase">Resolution Rate</span>
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>check_circle</span>
              </div>
              <div className="flex items-end gap-6">
                <div>
                  <div className="font-display-lg text-display-lg text-on-surface">86%</div>
                  <div className="font-label-md text-label-md text-on-surface-variant mt-1">Avg 2.4 days to resolve</div>
                </div>
                <div className="flex-1 h-12 flex items-end gap-1">
                  <div className="w-full bg-[#2D3139] rounded-t-sm h-[40%]"></div>
                  <div className="w-full bg-[#2D3139] rounded-t-sm h-[60%]"></div>
                  <div className="w-full bg-[#2D3139] rounded-t-sm h-[45%]"></div>
                  <div className="w-full bg-[#2D3139] rounded-t-sm h-[80%]"></div>
                  <div className="w-full bg-[#3B82F6] rounded-t-sm h-[95%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Data Table Area (Spans full width) */}
          <div className="col-span-12 bg-[#1A1D23] border border-[#2D3139] rounded-xl overflow-hidden flex flex-col">
            {/* Filter Bar */}
            <div className="p-4 border-b border-[#2D3139] flex flex-wrap gap-3 items-center justify-between bg-surface-container-low/50">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative">
                  <select className="appearance-none bg-[#1A1D23] border border-[#2D3139] rounded-lg py-1.5 pl-3 pr-8 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]" defaultValue="Status: All">
                    <option>Status: All</option>
                    <option>In Progress</option>
                    <option>Under Review</option>
                    <option>Resolved</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant pointer-events-none" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
                </div>
                <div className="relative">
                  <select className="appearance-none bg-[#1A1D23] border border-[#2D3139] rounded-lg py-1.5 pl-3 pr-8 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]" defaultValue="Category: All">
                    <option>Category: All</option>
                    <option>Infrastructure</option>
                    <option>Academic</option>
                    <option>Administrative</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant pointer-events-none" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
                </div>
                <div className="relative">
                  <select className="appearance-none bg-[#1A1D23] border border-[#2D3139] rounded-lg py-1.5 pl-3 pr-8 font-body-md text-body-md text-on-surface focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]" defaultValue="Priority: All">
                    <option>Priority: All</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant pointer-events-none" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-on-surface-variant hover:text-on-surface rounded hover:bg-[#2D3139] transition-colors">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>filter_list</span>
                </button>
                <button className="p-1.5 text-on-surface-variant hover:text-on-surface rounded hover:bg-[#2D3139] transition-colors">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>view_column</span>
                </button>
              </div>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2D3139] bg-surface-container-low/30">
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-medium uppercase tracking-wider">Reference</th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-medium uppercase tracking-wider">Title</th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-medium uppercase tracking-wider">Category</th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-medium uppercase tracking-wider">Priority</th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-medium uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-medium uppercase tracking-wider">Last Updated</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md text-on-surface divide-y divide-[#2D3139]">
                  {/* Row 1 */}
                  <tr className="hover:bg-[#2D3139]/50 transition-colors group">
                    <td className="py-3 px-4 font-label-md text-label-md text-on-surface-variant">
                      <Link to="/student/grievance/GRV-00142" className="block w-full h-full">GRV-00142</Link>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      <Link to="/student/grievance/GRV-00142" className="block w-full h-full">Hostel Water Supply Issue</Link>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">Infrastructure</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-label-md bg-error-container/20 text-error border border-error-container/30">High</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
                        In Progress
                      </span>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">2 hrs ago</td>
                    <td className="py-3 px-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>more_vert</span></button>
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="hover:bg-[#2D3139]/50 transition-colors group">
                    <td className="py-3 px-4 font-label-md text-label-md text-on-surface-variant">
                      <Link to="/student/grievance/GRV-00141" className="block w-full h-full">GRV-00141</Link>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      <Link to="/student/grievance/GRV-00141" className="block w-full h-full">Library WiFi Disconnects</Link>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">IT Support</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-label-md bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">Medium</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                        Under Review
                      </span>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">Yesterday</td>
                    <td className="py-3 px-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>more_vert</span></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="p-4 border-t border-[#2D3139] flex justify-between items-center bg-surface-container-low/30">
              <span className="font-body-md text-body-md text-on-surface-variant">Showing 1 to 2 of 42 results</span>
              <div className="flex gap-1">
                <button className="p-1.5 border border-[#2D3139] rounded text-on-surface-variant hover:bg-[#2D3139] transition-colors disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_left</span>
                </button>
                <button className="p-1.5 border border-[#2D3139] rounded text-on-surface bg-[#2D3139] transition-colors">1</button>
                <button className="p-1.5 border border-[#2D3139] rounded text-on-surface-variant hover:bg-[#2D3139] transition-colors">2</button>
                <button className="p-1.5 border border-[#2D3139] rounded text-on-surface-variant hover:bg-[#2D3139] transition-colors">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyGrievances;
