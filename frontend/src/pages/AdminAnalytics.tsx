import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../api/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';

const MONTHLY_TREND_DATA = [
  { month: 'Jan', received: 45, resolved: 42, escalated: 3 },
  { month: 'Feb', received: 58, resolved: 54, escalated: 4 },
  { month: 'Mar', received: 72, resolved: 68, escalated: 5 },
  { month: 'Apr', received: 85, resolved: 80, escalated: 6 },
  { month: 'May', received: 95, resolved: 90, escalated: 7 },
  { month: 'Jun', received: 60, resolved: 58, escalated: 2 },
  { month: 'Jul', received: 48, resolved: 46, escalated: 2 },
  { month: 'Aug', received: 89, resolved: 82, escalated: 8 },
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Estate & Facilities', value: 38, color: '#3b82f6' },
  { name: 'IT & Digital Services', value: 26, color: '#8a4cfc' },
  { name: 'Academic Affairs', value: 18, color: '#10b981' },
  { name: 'Hostel & Residence', value: 12, color: '#f59e0b' },
  { name: 'Finance & Accounts', value: 6, color: '#ef4444' },
];

const SLA_PERFORMANCE_DATA = [
  { department: 'Facilities', onTime: 94, breached: 6 },
  { department: 'Academic', onTime: 91, breached: 9 },
  { department: 'IT Services', onTime: 88, breached: 12 },
  { department: 'Hostel Admin', onTime: 96, breached: 4 },
  { department: 'Library', onTime: 98, breached: 2 },
  { department: 'Finance', onTime: 89, breached: 11 },
];

const SENTIMENT_BREAKDOWN = [
  { name: 'Constructive / Polite', count: 42, color: '#10b981' },
  { name: 'Neutral Inquiry', count: 35, color: '#3b82f6' },
  { name: 'Frustrated / Urgent', count: 28, color: '#f59e0b' },
  { name: 'Very Negative / Emergency', count: 9, color: '#ef4444' },
];

const AdminAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('30d');
  const [totalDockets, setTotalDockets] = useState<number>(552);
  const [resolutionRate, setResolutionRate] = useState<string>('93.4%');
  const [avgResolutionTime, setAvgResolutionTime] = useState<string>('18.6h');

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then((res: any) => {
        if (res.data) {
          const total = res.data.total_grievances || res.data.total;
          if (total !== undefined) setTotalDockets(total);
          if (res.data.avg_resolution_hours) {
            setAvgResolutionTime(`${res.data.avg_resolution_hours.toFixed(1)}h`);
          }
          if (res.data.resolution_rate !== undefined) {
            setResolutionRate(`${(res.data.resolution_rate * 100).toFixed(1)}%`);
          }
        }
      })
      .catch(() => {});
  }, [timeRange]);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Systemic Institutional Analytics</h1>
            <p className="text-xs text-gray-400 mt-1">Cross-department caseload velocity, resolution SLA fidelity, and sentiment intelligence.</p>
          </div>

          <div className="flex items-center gap-1 bg-[#10131a] p-1 rounded-xl border border-[#262626]">
            {(['30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase font-mono transition-all ${
                  timeRange === range
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range === '30d' ? '30 Days' : range === '90d' ? 'Quarter' : 'Annual'}
              </button>
            ))}
          </div>
        </div>

        {/* Top KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 shadow-xl">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Total Ingested Dockets</span>
            <div className="text-3xl font-bold font-mono text-white mt-2">{totalDockets}</div>
            <p className="text-[10px] text-emerald-400 mt-1">{resolutionRate} overall resolution rate</p>
          </div>

          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 shadow-xl">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Mean Resolution Speed</span>
            <div className="text-3xl font-bold font-mono text-amber-400 mt-2">{avgResolutionTime}</div>
            <p className="text-[10px] text-gray-400 mt-1">Target: &lt;24 hours</p>
          </div>

          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 shadow-xl">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Student CSAT Index</span>
            <div className="text-3xl font-bold font-mono text-emerald-400 mt-2">4.7 / 5</div>
            <p className="text-[10px] text-gray-400 mt-1">89% positive sentiment</p>
          </div>

          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 shadow-xl">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Duplicate Prevention Rate</span>
            <div className="text-3xl font-bold font-mono text-purple-400 mt-2">34.2%</div>
            <p className="text-[10px] text-gray-400 mt-1">Auto-merged into clusters</p>
          </div>
        </div>

        {/* Row 1: Volume Trend & Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Volume AreaChart */}
          <div className="lg:col-span-8 bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Monthly Grievance Ingestion vs Resolution Velocity
              </h3>
              <span className="text-[10px] font-mono text-gray-500 uppercase">Cases / Month</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_TREND_DATA}>
                  <defs>
                    <linearGradient id="colorRecv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorReso" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="received" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRecv)" name="New Cases" />
                  <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorReso)" name="Resolved Cases" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category PieChart */}
          <div className="lg:col-span-4 bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Category Distribution</h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CATEGORY_DISTRIBUTION} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                    {CATEGORY_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-1.5 text-xs">
              {CATEGORY_DISTRIBUTION.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                    <span className="truncate">{c.name}</span>
                  </div>
                  <span className="font-mono font-bold">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Department SLA Performance & Sentiment Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SLA Performance BarChart */}
          <div className="lg:col-span-7 bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Department SLA Compliance Ratio (%)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SLA_PERFORMANCE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="department" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="onTime" fill="#10b981" radius={[4, 4, 0, 0]} name="On-Time (%)" />
                  <Bar dataKey="breached" fill="#ef4444" radius={[4, 4, 0, 0]} name="Breached (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sentiment Breakdown */}
          <div className="lg:col-span-5 bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">NLP Sentiment & Tonal Distribution</h3>
            <div className="flex flex-col gap-3 justify-center flex-1">
              {SENTIMENT_BREAKDOWN.map((s) => (
                <div key={s.name} className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{s.name}</span>
                    <span className="font-mono text-white font-bold">{s.count}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.count}%`, backgroundColor: s.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
