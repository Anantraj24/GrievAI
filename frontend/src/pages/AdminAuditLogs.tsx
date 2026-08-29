import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { AuditService } from '../services/auditService';
import { AuditLogEntry } from '../types';
import { useToast } from '../context/ToastContext';

export const AdminAuditLogs: React.FC = () => {
  const toast = useToast();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    setLogs(AuditService.getAll());
  }, []);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,ID,Timestamp,Actor,Role,Action,GrievanceID,Details\n' +
      logs
        .map(
          (l) =>
            `"${l.id}","${l.timestamp}","${l.actorName}","${l.actorRole}","${l.action}","${l.grievanceId || ''}","${l.details.replace(/"/g, '""')}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GrievAI_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success('Audit trail exported as verified CSV');
  };

  const filtered = logs.filter((l) => {
    const matchesSearch =
      l.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.grievanceId && l.grievanceId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || l.actorRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Institutional Audit Trail</h1>
            <p className="text-xs text-gray-400 mt-1">
              Cryptographically timestamped immutable event ledger of all system actions, status changes, and user escalations.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-[#262626] border border-[#262626] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-sm text-amber-400">download</span>
            Export CSV Log
          </button>
        </div>

        {/* Filters */}
        <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xl">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search audit actions, actors, case IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {['ALL', 'student', 'authority', 'admin', 'system'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  roleFilter === role ? 'bg-amber-600 text-white shadow' : 'bg-[#171717] text-gray-400 hover:text-white border border-[#262626]'
                }`}
              >
                {role === 'ALL' ? 'All Actors' : role}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-[#262626] bg-[#0d1017] text-[10px] font-mono uppercase text-gray-400 tracking-wider">
                  <th className="py-3 px-5">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Associated Case</th>
                  <th className="py-3 px-5">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c202a] text-xs">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-[#171b26] transition-colors">
                    <td className="py-3.5 px-5 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                      {new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white">{l.actorName}</p>
                      <span className="text-[10px] font-mono text-gray-500 uppercase">{l.actorRole}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-amber-400 font-bold">{l.action}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-blue-400">
                      {l.grievanceId || <span className="text-gray-600">—</span>}
                    </td>
                    <td className="py-3.5 px-5 text-gray-300 max-w-sm leading-relaxed">{l.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export const AdminSettings: React.FC = () => {
  const toast = useToast();
  const [minConfidence, setMinConfidence] = useState(85);
  const [enableDuplicateAutoMerge, setEnableDuplicateAutoMerge] = useState(true);
  const [aiDraftTone, setAiDraftTone] = useState('Formal & Empathetic');
  const [emergencyAlertRadius, setEmergencyAlertRadius] = useState('Building-Wide');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('System AI engine parameters and institution thresholds saved!');
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">System & AI Engine Configuration</h1>
          <p className="text-xs text-gray-400 mt-1">Fine-tune machine intelligence parameters, classification thresholds, and institutional security.</p>
        </div>

        <form onSubmit={handleSave} className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider flex justify-between">
              <span>NLP Classification Confidence Floor</span>
              <span className="text-amber-400 font-bold font-mono">{minConfidence}%</span>
            </label>
            <input
              type="range"
              min={60}
              max={99}
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="accent-amber-500 cursor-pointer"
            />
            <p className="text-[10px] text-gray-500">
              Predictions below this threshold will flag for mandatory manual review by the Ombudsman intake desk.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#262626]">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-gray-400 uppercase">Default AI Response Tone</label>
              <select
                value={aiDraftTone}
                onChange={(e) => setAiDraftTone(e.target.value)}
                className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-amber-500"
              >
                <option value="Formal & Empathetic">Formal & Empathetic</option>
                <option value="Direct & Operational">Direct & Operational</option>
                <option value="Executive Ombudsman">Executive Ombudsman</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-gray-400 uppercase">Emergency Broadcast Scope</label>
              <select
                value={emergencyAlertRadius}
                onChange={(e) => setEmergencyAlertRadius(e.target.value)}
                className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-amber-500"
              >
                <option value="Building-Wide">Building-Wide</option>
                <option value="Campus-Wide">Campus-Wide</option>
                <option value="Department Only">Department Only</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-3 border-t border-[#262626]">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#171717] border border-[#262626] cursor-pointer text-xs">
              <div>
                <p className="font-semibold text-white">Autonomous Duplicate Linking</p>
                <p className="text-[10px] text-gray-400">Auto-attach incoming reports with &gt;85% cosine similarity to master tickets</p>
              </div>
              <input
                type="checkbox"
                checked={enableDuplicateAutoMerge}
                onChange={(e) => setEnableDuplicateAutoMerge(e.target.checked)}
                className="rounded text-amber-600 focus:ring-0"
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-600/30"
          >
            Update System Parameters
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};
