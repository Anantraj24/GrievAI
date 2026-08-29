import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { AdminService } from '../services/adminService';
import { SLAPolicy } from '../types';
import { PriorityBadge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';

export const AdminSLA: React.FC = () => {
  const toast = useToast();
  const [policies, setPolicies] = useState<SLAPolicy[]>([]);

  useEffect(() => {
    setPolicies(AdminService.getSLAPolicies());
  }, []);

  const handleToggleAutoEscalate = (policyId: string) => {
    setPolicies((prev) =>
      prev.map((p) => {
        if (p.id === policyId) {
          const updated = { ...p, autoEscalateOnBreach: !p.autoEscalateOnBreach };
          toast.info(`Updated auto-escalation policy for ${p.priorityLevel}`);
          return updated;
        }
        return p;
      })
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">SLA Policies & Escalation Matrix</h1>
          <p className="text-xs text-gray-400 mt-1">Configure maximum permissible resolution windows and automatic Ombudsman escalation triggers.</p>
        </div>

        <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#262626] bg-[#0d1017] text-[10px] font-mono uppercase text-gray-400 tracking-wider">
                  <th className="py-3 px-5">Priority Level</th>
                  <th className="py-3 px-4">Response Window</th>
                  <th className="py-3 px-4">Resolution Window</th>
                  <th className="py-3 px-4">Auto-Escalate on Breach</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c202a] text-xs">
                {policies.map((p) => (
                  <tr key={p.id} className="hover:bg-[#171b26] transition-colors">
                    <td className="py-4 px-5">
                      <PriorityBadge priority={p.priorityLevel || p.priority || 'HIGH'} />
                    </td>
                    <td className="py-4 px-4 font-mono text-white font-bold">{p.firstResponseHours} Hours</td>
                    <td className="py-4 px-4 font-mono text-amber-300 font-bold">{p.resolutionHours} Hours</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          p.autoEscalateOnBreach ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {p.autoEscalateOnBreach ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleToggleAutoEscalate(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#171717] hover:bg-[#262626] border border-[#262626] text-xs text-gray-300 hover:text-white"
                      >
                        {p.autoEscalateOnBreach ? 'Disable Auto-Escalate' : 'Enable Auto-Escalate'}
                      </button>
                    </td>
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

export default AdminSLA;
