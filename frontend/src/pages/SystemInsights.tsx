import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

const DETECTED_PATTERNS = [
  {
    id: 'PAT-001',
    title: 'CS Academic Block 4 - Dual HVAC Refrigerant Compressor Fault',
    category: 'Estate & Campus Facilities',
    affectedGrievances: ['GRV-2024-001', 'GRV-2024-006', 'GRV-2024-012'],
    confidence: 96,
    impact: 'High (3 Labs, ~240 Students)',
    recommendation: 'Emergency contractor work order for Chiller Loop 2 repair. Dispatched to Estate Dept.',
    status: 'ACTIVE_ANOMALY',
  },
  {
    id: 'PAT-002',
    title: 'Girls Hostel Block 2 - Wi-Fi Mesh DHCP Lease Starvation',
    category: 'IT & Digital Services',
    affectedGrievances: ['GRV-2024-003', 'GRV-2024-007'],
    confidence: 91,
    impact: 'Medium (Hostel Block 2, ~310 Students)',
    recommendation: 'Increase DHCP pool subnet from /24 to /22 on Core Router 04.',
    status: 'CORRECTIVE_ACTION_REQUIRED',
  },
  {
    id: 'PAT-003',
    title: 'Central Mess Hall B - Dairy Supply Temperature Excursion',
    category: 'Hostel & Residence',
    affectedGrievances: ['GRV-2024-004'],
    confidence: 88,
    impact: 'High (Catering Sanitation)',
    recommendation: 'Immediate cold-storage audit and vendor compliance review.',
    status: 'INSPECTION_PENDING',
  },
];

const SystemInsights: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase mb-1">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              Neural Pattern & Anomaly Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Systemic Anomaly Detection</h1>
            <p className="text-xs text-gray-400 mt-1">
              Clustered spatial and temporal pattern analysis across disparate student complaints to isolate systemic infrastructure failures.
            </p>
          </div>
        </div>

        {/* AI Model Summary Bar */}
        <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">psychology</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Semantic Spatial Clustering Model v4.2</h4>
              <p className="text-xs text-gray-400 font-mono">DBSCAN + TF-IDF Vector Embeddings across campus nodes</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-gray-500 block">Scan Frequency</span>
              <span className="text-white font-bold">Every 15 min</span>
            </div>
            <div>
              <span className="text-gray-500 block">Active Anomaly Clusters</span>
              <span className="text-purple-400 font-bold">3 Detected</span>
            </div>
          </div>
        </div>

        {/* Anomaly Pattern Cards */}
        <div className="grid grid-cols-1 gap-4">
          {DETECTED_PATTERNS.map((pat) => (
            <div
              key={pat.id}
              className="bg-[#10131a] border border-purple-500/30 rounded-2xl p-6 flex flex-col gap-4 shadow-xl relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262626] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-purple-400">{pat.id}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-xs font-semibold text-gray-300">{pat.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {pat.confidence}% AI Pattern Confidence
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                    {pat.status}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{pat.title}</h3>
                <p className="text-xs text-amber-300 font-medium mt-1">Impact: {pat.impact}</p>
              </div>

              <div className="bg-[#171717] border border-[#262626] rounded-xl p-4 text-xs flex flex-col gap-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase">AI Remediation Recommendation</span>
                <p className="text-gray-200 leading-relaxed font-mono">{pat.recommendation}</p>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-[#262626]">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                  <span>Linked Cases:</span>
                  {pat.affectedGrievances.map((gid) => (
                    <Link
                      key={gid}
                      to={`/authority/workspace/${gid}`}
                      className="px-2 py-0.5 rounded bg-[#262626] text-blue-400 hover:text-blue-300 font-bold"
                    >
                      {gid}
                    </Link>
                  ))}
                </div>

                <Link
                  to="/admin/issues/ISS-2024-001"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">hub</span>
                  Open Master Issue Dossier
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemInsights;
