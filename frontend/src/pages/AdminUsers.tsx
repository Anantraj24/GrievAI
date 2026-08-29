import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { AdminService } from '../services/adminService';
import { User, UserRole } from '../types';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';

export const AdminUsers: React.FC = () => {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('authority');
  const [newDept, setNewDept] = useState('Estate & Campus Facilities');

  useEffect(() => {
    setUsers(AdminService.getUsers());
  }, []);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const created = AdminService.createUser({
      name: newName,
      email: newEmail,
      role: newRole,
      department: newDept,
      studentId: newRole === 'student' ? `STU-2024-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
    });

    setUsers((prev) => [...prev, created]);
    setIsModalOpen(false);
    setNewName('');
    setNewEmail('');
    toast.success(`User ${created.name} (${created.role}) registered successfully!`);
  };

  const handleToggleStatus = (user: User) => {
    const updated = AdminService.updateUser(user.id, { isActive: !user.isActive });
    if (updated) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
      toast.info(`Updated user status: ${updated.name} is now ${updated.isActive ? 'Active' : 'Deactivated'}`);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.studentId && u.studentId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">User Access Management</h1>
            <p className="text-xs text-gray-400 mt-1">Manage institutional student, faculty authority, and ombudsman accounts.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-lg shadow-amber-600/30 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            Register New User
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xl">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name, email, student ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {['ALL', 'student', 'authority', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  roleFilter === role ? 'bg-amber-600 text-white shadow' : 'bg-[#171717] text-gray-400 hover:text-white border border-[#262626]'
                }`}
              >
                {role === 'ALL' ? 'All Roles' : role}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#262626] bg-[#0d1017] text-[10px] font-mono uppercase text-gray-400 tracking-wider">
                  <th className="py-3 px-5">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department / ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c202a] text-xs">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-[#171b26] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img alt="" src={u.avatar} className="w-8 h-8 rounded-full object-cover border border-[#262626]" />
                        <div>
                          <p className="font-semibold text-white">{u.name}</p>
                          <p className="text-[11px] text-gray-400 font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : u.role === 'authority'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-300">
                      <p>{u.department || 'N/A'}</p>
                      {u.studentId && <p className="text-[10px] font-mono text-gray-500">{u.studentId}</p>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          u.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className="text-xs text-gray-400 hover:text-white px-2.5 py-1 rounded bg-[#171717] border border-[#262626]"
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create User Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Institutional User">
          <form onSubmit={handleCreateUser} className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <label className="text-gray-400 font-mono uppercase">Full Name *</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Dr. S. K. Roy"
                className="bg-[#171717] border border-[#2D3139] text-white p-3 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-400 font-mono uppercase">Institutional Email *</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="skroy@institution.edu"
                className="bg-[#171717] border border-[#2D3139] text-white p-3 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 font-mono uppercase">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="bg-[#171717] border border-[#2D3139] text-white p-3 rounded-xl focus:outline-none focus:border-amber-500"
                >
                  <option value="student">Student</option>
                  <option value="authority">Department Authority</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-gray-400 font-mono uppercase">Department</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="bg-[#171717] border border-[#2D3139] text-white p-3 rounded-xl focus:outline-none focus:border-amber-500"
                >
                  <option value="Estate & Campus Facilities">Estate & Campus Facilities</option>
                  <option value="Academic Affairs">Academic Affairs</option>
                  <option value="IT & Digital Services">IT & Digital Services</option>
                  <option value="Hostel & Residence">Hostel & Residence</option>
                  <option value="Campus Safety & Harassment">Campus Safety & Harassment</option>
                  <option value="Finance & Accounts">Finance & Accounts</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262626]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-md"
              >
                Register User
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
