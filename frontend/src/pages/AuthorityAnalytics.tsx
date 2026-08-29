import React, { useState, useEffect } from 'react';
import AuthorityLayout from '../components/AuthorityLayout';
import { GrievanceService } from '../services/grievanceService';
import { Grievance } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

export const AuthorityAnalytics: React.FC = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);

  useEffect(() => {
    setGrievances(GrievanceService.getAll());
  }, []);

  const total = grievances.length;
  const resolved = grievances.filter((g) => g.status === 'resolved').length;
  const slaPassed = grievances.filter((g) => !g.slaBreached).length;
  const complianceRate = total > 0 ? Math.round((slaPassed / total) * 100) : 94;

  const weeklyTrendData = [
    { day: 'Mon', received: 4, resolved: 3 },
    { day: 'Tue', received: 7, resolved: 5 },
    { day: 'Wed', received: 9, resolved: 8 },
    { day: 'Thu', received: 6, resolved: 6 },
    { day: 'Fri', received: 8, resolved: 7 },
    { day: 'Sat', received: 3, resolved: 4 },
    { day: 'Sun', received: 2, resolved: 2 },
  ];

  const categoryResolutionData = [
    { name: 'Estate/HVAC', hours: 14 },
    { name: 'IT/Wi-Fi', hours: 8 },
    { name: 'Academic', hours: 32 },
    { name: 'Hostel/Food', hours: 18 },
    { name: 'Finance', hours: 44 },
  ];

  return (
    <AuthorityLayout>
      <div className="flex flex-col gap-6 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Department Authority Analytics</h1>
          <p className="text-xs text-gray-400 mt-1">Operational resolution throughput, SLA compliance, and student satisfaction metrics.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 shadow-xl">
            <span className="text-[10px] font-mono text-gray-400 uppercase">SLA Compliance</span>
            <div className="text-3xl font-bold font-mono text-emerald-400 mt-2">{complianceRate}%</div>
            <p className="text-[10px] text-gray-500 mt-1">Target: &gt;90% on-time</p>
          </div>

          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 shadow-xl">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Avg Turnaround Time</span>
            <div className="text-3xl font-bold font-mono text-purple-400 mt-2">16.4h</div>
            <p className="text-[10px] text-gray-500 mt-1">Down 22% this month</p>
          </div>

          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 shadow-xl">
            <span className="text-[10px] font-mono text-gray-400 uppercase">CSAT Score</span>
            <div className="text-3xl font-bold font-mono text-amber-400 mt-2">4.8 / 5</div>
            <p className="text-[10px] text-gray-500 mt-1">From 48 student ratings</p>
          </div>

          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 shadow-xl">
            <span className="text-[10px] font-mono text-gray-400 uppercase">AI Auto-Triage Accuracy</span>
            <div className="text-3xl font-bold font-mono text-blue-400 mt-2">97.6%</div>
            <p className="text-[10px] text-gray-500 mt-1">Zero manual re-routes</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Throughput */}
          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Weekly Grievance Inflow vs Resolution</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrendData}>
                  <defs>
                    <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8a4cfc" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8a4cfc" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="day" stroke="#6b7280" textAnchor="end" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="received" stroke="#8a4cfc" fillOpacity={1} fill="url(#colorRec)" name="New Cases" />
                  <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorRes)" name="Resolved Cases" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Resolution Hours by Category */}
          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Mean Resolution Duration (Hours)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryResolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="hours" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Hours to Resolve" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AuthorityLayout>
  );
};

export default AuthorityAnalytics;
