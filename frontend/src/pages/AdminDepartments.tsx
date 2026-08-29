import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { AdminService } from '../services/adminService';
import { Department } from '../types';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';

export const AdminDepartments: React.FC = () => {
  const toast = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [targetHours, setTargetHours] = useState<number>(24);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setDepartments(AdminService.getDepartments());
  }, []);

  const openEditModal = (dept: Department) => {
    setSelectedDept(dept);
    setTargetHours(dept.targetResolutionHours);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept) return;

    const updated = AdminService.updateDepartment(selectedDept.id, {
      targetResolutionHours: Number(targetHours),
    });

    if (updated) {
      setDepartments((prev) => prev.map((d) => (d.id === selectedDept.id ? updated : d)));
      toast.success(`Updated ${updated.name} SLA target to ${updated.targetResolutionHours} hours!`);
    }
    setIsModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Institutional Departments</h1>
          <p className="text-xs text-gray-400 mt-1">Configure department authority assignments, active caseloads, and SLA resolution baselines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 flex flex-col justify-between gap-4 shadow-xl hover:border-amber-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-amber-400 font-bold">{dept.code}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    {dept.slaComplianceRate}% SLA
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{dept.name}</h3>
                <p className="text-xs text-gray-400 mt-1 font-mono">Head: {dept.headAuthorityName}</p>
                <p className="text-[11px] text-gray-500 font-mono">{dept.email}</p>
              </div>

              <div className="bg-[#171717] p-3.5 rounded-xl border border-[#262626] grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase">Active Caseload</span>
                  <p className="font-bold text-white mt-0.5">{dept.activeCaseload} Cases</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase">SLA Target</span>
                  <p className="font-bold text-amber-300 font-mono mt-0.5">{dept.targetResolutionHours} Hours</p>
                </div>
              </div>

              <button
                onClick={() => openEditModal(dept)}
                className="w-full py-2.5 bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold rounded-xl border border-[#262626] transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">tune</span>
                Configure SLA Target
              </button>
            </div>
          ))}
        </div>

        {/* Edit SLA Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Configure SLA: ${selectedDept?.name}`}>
          <form onSubmit={handleSave} className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <label className="text-gray-400 font-mono uppercase">Target Resolution Duration (Hours)</label>
              <input
                type="number"
                min={1}
                max={168}
                value={targetHours}
                onChange={(e) => setTargetHours(Number(e.target.value))}
                className="bg-[#171717] border border-[#2D3139] text-white p-3 rounded-xl focus:outline-none focus:border-amber-500 font-mono"
              />
              <span className="text-[10px] text-gray-500">Default university SLA is 24 hours. Emergency threshold triggers at 80% mark.</span>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#262626]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white px-4 py-2"
              >
                Cancel
              </button>
              <button type="submit" className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminDepartments;
