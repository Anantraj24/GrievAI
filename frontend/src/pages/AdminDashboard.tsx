import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../api/api';

interface DashboardData {
  status_breakdown: Record<string, number>;
  priority_breakdown: Record<string, number>;
  sla_breaches: number;
  recent_activity: any[];
  avg_resolution_time_hours: number;
  total: number;
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/api/v1/analytics/dashboard');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };
    fetchDashboard();
  }, []);

  const total = data?.total || 0;
  const openCases = data ? (data.status_breakdown['Pending'] || 0) + (data.status_breakdown['In Progress'] || 0) : 0;
  const resolvedCases = data ? (data.status_breakdown['Resolved'] || 0) + (data.status_breakdown['Closed'] || 0) : 0;
  const slaBreaches = data?.sla_breaches || 0;
  const avgResolutionTime = data?.avg_resolution_time_hours ? (data.avg_resolution_time_hours / 24).toFixed(1) : 0;

  return (
    <AdminLayout>
      {/* Top Metrics Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#171717] border border-[#262626] p-5 rounded-xl border-l-4 border-l-primary">
          <div className="flex justify-between items-start mb-2">
            <p className="text-on-surface-variant text-sm font-medium">Total Grievances</p>
            <span className="material-symbols-outlined text-primary/50" style={{ fontVariationSettings: "'FILL' 0" }}>folder_open</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{total}</h3>
          <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0" }}>trending_up</span>
            <span>+12.4%</span>
          </div>
        </div>
        
        {/* Metric 2 */}
        <div className="bg-[#171717] border border-[#262626] p-5 rounded-xl border-l-4 border-l-[#F59E0B]">
          <div className="flex justify-between items-start mb-2">
            <p className="text-on-surface-variant text-sm font-medium">Open Cases</p>
            <span className="material-symbols-outlined text-[#F59E0B]/50" style={{ fontVariationSettings: "'FILL' 0" }}>pending_actions</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{openCases}</h3>
          <div className="flex items-center gap-1 text-red-400 text-xs font-bold">
            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0" }}>priority_high</span>
            <span>Critical Attention</span>
          </div>
        </div>
        
        {/* Metric 3 */}
        <div className="bg-[#171717] border border-[#262626] p-5 rounded-xl border-l-4 border-l-green-400">
          <div className="flex justify-between items-start mb-2">
            <p className="text-on-surface-variant text-sm font-medium">Resolved</p>
            <span className="material-symbols-outlined text-green-400/50" style={{ fontVariationSettings: "'FILL' 0" }}>check_circle</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{resolvedCases}</h3>
          <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0" }}>done_all</span>
            <span>93% Completion</span>
          </div>
        </div>
        
        {/* Metric 4 */}
        <div className="bg-[#171717] border border-[#262626] p-5 rounded-xl border-l-4 border-l-error">
          <div className="flex justify-between items-start mb-2">
            <p className="text-on-surface-variant text-sm font-medium">SLA Breach Rate</p>
            <span className="material-symbols-outlined text-error/50" style={{ fontVariationSettings: "'FILL' 0" }}>timer_off</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{total > 0 ? ((slaBreaches / total) * 100).toFixed(1) : 0}%</h3>
          <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0" }}>trending_down</span>
            <span>-0.4% Improvement</span>
          </div>
        </div>
        
        {/* Metric 5 */}
        <div className="bg-[#171717] border border-[#262626] p-5 rounded-xl border-l-4 border-l-secondary">
          <div className="flex justify-between items-start mb-2">
            <p className="text-on-surface-variant text-sm font-medium">Avg Resolution</p>
            <span className="material-symbols-outlined text-secondary/50" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{avgResolutionTime} Days</h3>
          <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0" }}>bolt</span>
            <span>Faster than avg</span>
          </div>
        </div>
      </section>

      {/* Middle Bento Grid: Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grievance Volume Line Chart */}
        <div className="lg:col-span-8 bg-[#171717] border border-[#262626] p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-white text-lg font-bold">Grievance Volume</h3>
              <p className="text-on-surface-variant text-sm">Weekly incoming trend</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-surface-container rounded text-xs font-bold text-primary">Week</button>
              <button className="px-3 py-1 hover:bg-surface-container rounded text-xs font-bold text-on-surface-variant transition-colors">Month</button>
            </div>
          </div>
          <div className="flex-1 min-h-[220px] relative mt-4">
            {/* Visualization Simulation */}
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#adc6ff" stopOpacity="0.3"></stop>
                  <stop offset="100%" stopColor="#adc6ff" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M0,160 Q80,140 160,170 T320,100 T480,120 T640,40 T800,60 L800,200 L0,200 Z" fill="url(#chartGradient)"></path>
              <path d="M0,160 Q80,140 160,170 T320,100 T480,120 T640,40 T800,60" fill="none" stroke="#adc6ff" strokeLinecap="round" strokeWidth="4"></path>
              <g className="text-[10px] fill-on-surface-variant/40 font-mono">
                <text x="0" y="195">MON</text><text x="133" y="195">TUE</text><text x="266" y="195">WED</text>
                <text x="400" y="195">THU</text><text x="533" y="195">FRI</text><text x="666" y="195">SAT</text><text x="760" y="195">SUN</text>
              </g>
            </svg>
            {/* Tooltip Simulation */}
            <div className="absolute top-10 right-40 p-2 bg-surface-container-highest border border-primary/30 rounded shadow-xl text-[10px] font-bold">
              <p className="text-on-surface-variant">Friday, Oct 24</p>
              <p className="text-primary text-sm">42 New Grievances</p>
            </div>
          </div>
        </div>

        {/* Department Workload Bar Chart */}
        <div className="lg:col-span-4 bg-[#171717] border border-[#262626] p-6 rounded-2xl flex flex-col">
          <h3 className="text-white text-lg font-bold mb-1">Dept Workload</h3>
          <p className="text-on-surface-variant text-sm mb-6">Active case distribution</p>
          <div className="flex flex-col gap-6 flex-1 justify-center">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-white">Facilities</span>
                <span className="text-primary">42%</span>
              </div>
              <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-white">IT Services</span>
                <span className="text-secondary">28%</span>
              </div>
              <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-white">Academic</span>
                <span className="text-tertiary">30%</span>
              </div>
              <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-tertiary rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Distribution Donut Chart */}
        <div className="lg:col-span-4 bg-[#171717] border border-[#262626] p-6 rounded-2xl flex flex-col items-center">
          <div className="w-full text-left">
            <h3 className="text-white text-lg font-bold">Category Distribution</h3>
            <p className="text-on-surface-variant text-sm mb-4">Sentiment-based split</p>
          </div>
          <div className="relative w-48 h-48 my-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle className="text-surface-container" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="12"></circle>
              <circle className="text-primary" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="62.8" strokeWidth="12"></circle>
              <circle className="text-secondary" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="180" strokeWidth="12"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">842</span>
              <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">Analyzed</span>
            </div>
          </div>
          <div className="grid grid-cols-2 w-full gap-2 mt-4 text-[11px] font-medium">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span> Infra (45%)</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary"></span> Admin (30%)</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-tertiary"></span> Faculty (15%)</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#FFB4AB]"></span> Other (10%)</div>
          </div>
        </div>

        {/* Emerging Institutional Issues & Critical Card */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <h2 className="text-white text-xl font-bold px-1">Emerging Institutional Issues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {/* Critical Card: Hostel Water */}
            <div className="bg-[#171717] p-6 rounded-2xl border-2 border-[#FFB4AB] relative overflow-hidden group hover:border-[#FFB4AB]/80 transition-colors">
              <div className="absolute top-0 right-0 p-3">
                <span className="bg-[#FFB4AB] text-on-error font-bold text-[10px] px-2 py-1 rounded-full uppercase shadow-[0_0_15px_rgba(173,198,255,0.2)]">High Priority</span>
              </div>
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFB4AB]/20 flex items-center justify-center text-[#FFB4AB]">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>water_damage</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg leading-tight">Hostel Water Supply Disturbance</h4>
                    <p className="text-on-surface-variant text-xs">Clustered Activity Detected</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="bg-surface-container-highest rounded-lg p-3">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold">Related complaints</p>
                    <p className="text-2xl font-bold text-white">17</p>
                  </div>
                  <div className="bg-surface-container-highest rounded-lg p-3">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold">Weekly Spike</p>
                    <p className="text-2xl font-bold text-[#FFB4AB]">↑ 34%</p>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 bg-[#FFB4AB] text-on-error font-bold rounded-lg text-sm transition-transform active:scale-95 hover:opacity-90">Action Immediate</button>
              </div>
            </div>

            {/* Emerging Trend 2 */}
            <div className="bg-[#171717] border border-[#262626] p-6 rounded-2xl flex flex-col hover:border-[#262626]/80 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>wifi_off</span>
                </div>
                <span className="text-xs text-on-surface-variant">Last 2h ago</span>
              </div>
              <h4 className="text-white font-bold mb-2">Library Wi-Fi Connectivity</h4>
              <p className="text-on-surface-variant text-sm mb-4">Pattern identified in Block C; 5 new complaints regarding inconsistent speeds during peak hours.</p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border border-background bg-slate-400"></div>
                  <div className="w-6 h-6 rounded-full border border-background bg-slate-500"></div>
                  <div className="w-6 h-6 rounded-full border border-background bg-slate-600"></div>
                </div>
                <span className="text-[10px] text-on-surface-variant">IT Team investigating</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminDashboard;
