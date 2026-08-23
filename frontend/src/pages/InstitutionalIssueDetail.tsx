import React from 'react';
import { useParams } from 'react-router-dom';

const InstitutionalIssueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-4 md:p-6 flex-1 flex flex-col gap-6 max-w-[1600px] mx-auto w-full bg-background">
      {/* Context Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#363941]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[12px] font-bold tracking-widest text-on-surface-muted uppercase">
              INSTITUTIONAL ISSUE // <span className="font-mono text-primary">{id || 'INST-2409-A4X'}</span>
            </span>
            <div className="px-2 py-0.5 rounded-full bg-[#93000a]/20 border border-[#93000a]/50 text-[#FFB4AB] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">warning</span> High Priority
            </div>
            <div className="px-2 py-0.5 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/50 text-[#F59E0B] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">rotate_right</span> Under Investigation
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface font-display-lg">Hostel Water Supply Disturbance</h1>
          <p className="text-base text-on-surface-variant max-w-3xl mt-1">
            Repeated infrastructure failure in Block A & B affecting 150+ students. Root cause suspected to be main line pressure drop correlated with municipal throttling.
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="px-4 py-2 rounded-lg bg-[#171717] border border-[#363941] text-on-surface hover:text-primary hover:border-primary/50 transition-colors flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-[18px]">download</span> Export Dossier
          </button>
          <button className="px-4 py-2 rounded-lg bg-[#3B82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:bg-[#2563eb] transition-colors flex items-center gap-2 text-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">gavel</span> Escalate Action
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* LEFT COLUMN */}
        <div className="col-span-1 md:col-span-12 lg:col-span-8 flex flex-col gap-4">
          
          {/* Intelligence Visualization */}
          <div className="bg-[#171717] border border-primary/30 rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden min-h-[400px] shadow-[inset_0_0_20px_rgba(173,198,255,0.1)] border-l-2 border-l-primary">
            <div className="flex justify-between items-center z-10">
              <h2 className="text-[12px] font-bold tracking-widest text-on-surface-variant uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">grain</span>
                INTELLIGENCE VISUALIZATION // NODE CLUSTER
              </h2>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded bg-[#363941] font-mono text-[10px] text-on-surface-muted">17 NODES</span>
                <span className="px-2 py-1 rounded bg-[#363941] font-mono text-[10px] text-primary">98% CONFIDENCE</span>
              </div>
            </div>

            <div className="absolute inset-0 w-full h-full opacity-40 mix-blend-screen pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(77, 142, 255, 0.05) 0%, transparent 70%)" }}>
              <div className="absolute inset-0" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23adc6ff\\' fill-opacity=\\'0.05\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
            </div>

            <div className="flex-1 relative w-full h-full flex items-center justify-center min-h-[300px]">
              <div className="absolute w-16 h-16 rounded-full bg-[#93000a]/20 border-2 border-[#FFB4AB] flex items-center justify-center z-20 shadow-[0_0_30px_rgba(255,180,171,0.2)]" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <span className="material-symbols-outlined text-[#FFB4AB]">water_drop</span>
              </div>
              <div className="absolute w-8 h-8 rounded-full bg-[#363941] border border-[#262626] flex items-center justify-center z-10" style={{ top: '25%', left: '30%' }}>
                <span className="text-[10px] text-on-surface-variant font-mono">T-01</span>
              </div>
              <div className="absolute w-10 h-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center z-10 shadow-[0_0_15px_rgba(173,198,255,0.15)]" style={{ top: '70%', left: '65%' }}>
                <span className="text-[10px] text-primary font-mono">P-02</span>
              </div>
              <div className="absolute w-6 h-6 rounded-full bg-[#363941] border border-[#262626] flex items-center justify-center z-10" style={{ top: '40%', left: '75%' }}>
                <span className="text-[10px] text-on-surface-variant font-mono">Q-01</span>
              </div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                <line stroke="#363941" strokeDasharray="4" strokeWidth="1.5" x1="50%" x2="30%" y1="50%" y2="25%"></line>
                <line opacity="0.5" stroke="#adc6ff" strokeWidth="2" x1="50%" x2="65%" y1="50%" y2="70%"></line>
                <line stroke="#363941" strokeWidth="1" x1="50%" x2="75%" y1="50%" y2="40%"></line>
              </svg>

              <div className="absolute bottom-0 right-0 bg-[#171717]/60 backdrop-blur-md border border-[#363941] p-2 rounded-lg flex flex-col gap-1 text-[10px] font-mono text-on-surface-muted">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#FFB4AB]"></div> Core Issue (Pressure)</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div> High Correlation (Temp)</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#363941] border border-[#262626]"></div> Weak Signal (Quality)</div>
              </div>
            </div>
          </div>

          {/* Related Complaints Table */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-5 flex flex-col gap-3 overflow-x-auto">
            <div className="flex justify-between items-center mb-2 min-w-[600px]">
              <h2 className="text-[12px] font-bold tracking-widest text-on-surface-variant uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">list_alt</span>
                COMPONENT GRIEVANCES
              </h2>
              <button className="text-[12px] text-primary hover:underline">View All 17</button>
            </div>
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[#262626] text-[12px] font-bold tracking-widest text-on-surface-muted uppercase">
                  <th className="pb-2 font-normal pl-2">GRV ID</th>
                  <th className="pb-2 font-normal">DATE</th>
                  <th className="pb-2 font-normal">LOCATION</th>
                  <th className="pb-2 font-normal">AI SNIPPET</th>
                  <th className="pb-2 font-normal text-right pr-2">SENTIMENT</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-[#363941]/50 hover:bg-[#363941]/30 transition-colors group">
                  <td className="py-3 pl-2"><span className="font-mono text-primary text-xs">GRV-8821</span></td>
                  <td className="py-3 text-on-surface-variant font-mono text-[11px]">2023-10-24 08:12</td>
                  <td className="py-3 text-on-surface">Block A, Fl 3</td>
                  <td className="py-3 text-on-surface-variant truncate max-w-[200px] italic">"...no water pressure since morning, impossible to shower..."</td>
                  <td className="py-3 text-right pr-2">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#93000a]/10 border border-[#93000a]/30 text-[10px] text-[#FFB4AB]">
                      <span className="material-symbols-outlined text-[12px]">mood_bad</span> -0.8
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-[#363941]/50 hover:bg-[#363941]/30 transition-colors group">
                  <td className="py-3 pl-2"><span className="font-mono text-primary text-xs">GRV-8845</span></td>
                  <td className="py-3 text-on-surface-variant font-mono text-[11px]">2023-10-24 09:30</td>
                  <td className="py-3 text-on-surface">Block B, Fl 1</td>
                  <td className="py-3 text-on-surface-variant truncate max-w-[200px] italic">"...water completely stopped mid-wash. Unacceptable..."</td>
                  <td className="py-3 text-right pr-2">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#93000a]/10 border border-[#93000a]/30 text-[10px] text-[#FFB4AB]">
                      <span className="material-symbols-outlined text-[12px]">mood_bad</span> -0.9
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-[#363941]/50 hover:bg-[#363941]/30 transition-colors group">
                  <td className="py-3 pl-2"><span className="font-mono text-on-surface-muted text-xs">GRV-8850</span></td>
                  <td className="py-3 text-on-surface-variant font-mono text-[11px]">2023-10-24 10:15</td>
                  <td className="py-3 text-on-surface">Block A, Ground</td>
                  <td className="py-3 text-on-surface-variant truncate max-w-[200px] italic">"...water is slightly brown when first turned on..."</td>
                  <td className="py-3 text-right pr-2">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[10px] text-[#F59E0B]">
                      <span className="material-symbols-outlined text-[12px]">sentiment_dissatisfied</span> -0.4
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-1 md:col-span-12 lg:col-span-4 flex flex-col gap-4">
          
          {/* Trend Analysis */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-5 flex flex-col gap-3">
            <h2 className="text-[12px] font-bold tracking-widest text-on-surface-variant uppercase flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
              VOLUME SPURT ANALYSIS
            </h2>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-bold text-on-surface leading-none font-display-lg">17</span>
              <span className="text-sm text-[#FFB4AB] flex items-center mb-1">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 340% / 24h
              </span>
            </div>
            
            <div className="w-full h-24 relative mt-auto border-b border-[#363941]/50 pb-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
                <defs>
                  <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#adc6ff" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="#adc6ff" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0 35 Q 10 30, 20 32 T 40 25 T 60 28 T 80 15 T 90 5 T 100 2 L 100 40 L 0 40 Z" fill="url(#trendGradient)"></path>
                <path d="M0 35 Q 10 30, 20 32 T 40 25 T 60 28 T 80 15 T 90 5 T 100 2" fill="none" stroke="#adc6ff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                <circle cx="90" cy="5" fill="#10131a" r="3" stroke="#FFB4AB" strokeWidth="1.5"></circle>
              </svg>
              <div className="flex justify-between w-full text-[9px] font-mono text-on-surface-muted mt-1 absolute bottom-[-16px]">
                <span>T-7d</span>
                <span>T-3d</span>
                <span className="text-primary">NOW</span>
              </div>
            </div>
          </div>

          {/* Affected Departments */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-5 flex flex-col gap-3">
            <h2 className="text-[12px] font-bold tracking-widest text-on-surface-variant uppercase flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[18px]">domain</span>
              ROUTING & DEPARTMENTS
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-2 rounded bg-[#363941]/30 border border-[#363941]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#32353c] flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-[16px]">plumbing</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-on-surface">Facilities & Maintenance</span>
                    <span className="text-[10px] font-mono text-on-surface-muted">Primary Action</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20">NOTIFIED</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-[#363941]/30 border border-[#363941]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#32353c] flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-[16px]">meeting_room</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-on-surface">Hostel Administration</span>
                    <span className="text-[10px] font-mono text-on-surface-muted">CC / Comms</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#363941] text-on-surface-muted border border-[#363941]">PENDING READ</span>
              </div>
            </div>
          </div>

          {/* Current Resolution Path */}
          <div className="bg-[#171717] border border-[#262626] rounded-xl p-5 flex flex-col gap-3 flex-1">
            <h2 className="text-[12px] font-bold tracking-widest text-on-surface-variant uppercase flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[18px]">timeline</span>
              RESOLUTION PATH
            </h2>
            <div className="relative pl-4 border-l-2 border-[#363941] flex flex-col gap-4 pb-2">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-[#171717] ring-2 ring-primary/20"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-primary mb-0.5">08:12 AM - SYSTEM</span>
                  <span className="text-sm text-on-surface">Anomaly Detected</span>
                  <span className="text-[11px] text-on-surface-muted leading-tight mt-1">AI flagged cluster formation across Block A.</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#363941] border-2 border-[#171717]"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-on-surface-muted mb-0.5">09:45 AM - AUTOMATION</span>
                  <span className="text-sm text-on-surface">Auto-Ticket Generated</span>
                  <span className="text-[11px] text-on-surface-muted leading-tight mt-1">Ticket #TK-992 routed to Facilities.</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#363941] border-2 border-[#171717] border-dashed"></div>
                <div className="flex flex-col opacity-50">
                  <span className="text-[10px] font-mono text-on-surface-muted mb-0.5">PENDING - MAINT</span>
                  <span className="text-sm text-on-surface">Initial Assessment</span>
                  <span className="text-[11px] text-on-surface-muted leading-tight mt-1">Awaiting physical inspection report.</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default InstitutionalIssueDetail;
