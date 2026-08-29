import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const StudentProfile: React.FC = () => {
  const { user, updateCurrentUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || 'AnantRaj');
  const [email, setEmail] = useState(user?.email || 'anantraj@institution.edu');
  const [studentId, setStudentId] = useState(user?.studentId || 'STU-2024-8841');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [department, setDepartment] = useState(user?.department || 'Computer Science & Engineering');

  // Preferences toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slaAlerts, setSlaAlerts] = useState(true);
  const [aiSummaryAlerts, setAiSummaryAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name,
      email,
      studentId,
      phone,
      department,
    });
    toast.success('Student profile and communication preferences updated!');
  };

  return (
    <Layout userRoleLabel="Student Portal" userName={user?.name || 'Student'}>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Student Profile & Settings</h1>
          <p className="text-xs text-gray-400 mt-1">Manage your institutional identity, academic department, and notification relays.</p>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Identity Info (Left 7 cols) */}
          <div className="md:col-span-7 bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center gap-4 pb-4 border-b border-[#262626]">
              <img alt="" src={user?.avatar} className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/40" />
              <div>
                <h3 className="text-base font-bold text-white">{user?.name}</h3>
                <p className="text-xs font-mono text-blue-400 font-semibold">{user?.studentId}</p>
                <p className="text-[11px] text-gray-400">{user?.department}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono text-gray-400 uppercase">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono text-gray-400 uppercase">Student ID</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-gray-400 uppercase">Institutional Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono text-gray-400 uppercase">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono text-gray-400 uppercase">Academic Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30"
            >
              Save Profile Changes
            </button>
          </div>

          {/* Preferences & Security (Right 5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-blue-400">notifications</span>
                Alert Channels
              </h3>

              <div className="flex flex-col gap-3 text-xs">
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#171717] border border-[#262626] cursor-pointer">
                  <div>
                    <p className="font-semibold text-white">Email Digest & Triage</p>
                    <p className="text-[10px] text-gray-400">Send status update notices to campus email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="rounded border-[#2D3139] bg-[#10131a] text-blue-600 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#171717] border border-[#262626] cursor-pointer">
                  <div>
                    <p className="font-semibold text-white">SLA Urgency Alerts</p>
                    <p className="text-[10px] text-gray-400">Notify when case enters urgent resolution threshold</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={slaAlerts}
                    onChange={(e) => setSlaAlerts(e.target.checked)}
                    className="rounded border-[#2D3139] bg-[#10131a] text-blue-600 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#171717] border border-[#262626] cursor-pointer">
                  <div>
                    <p className="font-semibold text-white">AI Real-Time Insights</p>
                    <p className="text-[10px] text-gray-400">Show confidence and duplicate signals</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiSummaryAlerts}
                    onChange={(e) => setAiSummaryAlerts(e.target.checked)}
                    className="rounded border-[#2D3139] bg-[#10131a] text-blue-600 focus:ring-0"
                  />
                </label>
              </div>
            </div>

            <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 flex flex-col gap-3 shadow-xl">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-purple-400">security</span>
                Ombudsman Clearance
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Your student profile is linked to the university biometric access system. All grievances are handled under Strict Anti-Retaliation Policy #SEC-2024.
              </p>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default StudentProfile;
