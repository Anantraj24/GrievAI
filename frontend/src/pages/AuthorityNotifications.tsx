import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthorityLayout from '../components/AuthorityLayout';
import { useAuth } from '../context/AuthContext';
import { NotificationService } from '../services/notificationService';
import { SystemNotification } from '../types';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/common/EmptyState';

export const AuthorityNotifications: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  const fetchNotifs = () => {
    const list = NotificationService.getForUser('authority', user?.id);
    setNotifications(list);
  };

  useEffect(() => {
    fetchNotifs();
  }, [user?.id]);

  const handleMarkAllRead = () => {
    NotificationService.markAllAsRead('authority', user?.id);
    fetchNotifs();
    toast.success('All authority alerts marked as read');
  };

  return (
    <AuthorityLayout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Authority Alert Center</h1>
            <p className="text-xs text-gray-400 mt-1">Autonomous triage routing alerts, escalation notices, and student replies.</p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-xl bg-[#171717] hover:bg-[#262626] text-gray-300 hover:text-white text-xs font-semibold border border-[#262626]"
          >
            Mark All Read
          </button>
        </div>

        {notifications.length === 0 ? (
          <EmptyState icon="notifications_off" title="No Pending Alerts" description="Your authority queue has no pending alerts." />
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  !n.read ? 'bg-purple-950/20 border-purple-500/40 shadow-xl' : 'bg-[#10131a] border-[#262626] opacity-80'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">bolt</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-xs font-bold text-white">{n.title}</h4>
                    <span className="text-[10px] font-mono text-gray-500">{new Date(n.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{n.message}</p>
                  {n.link && (
                    <Link to={n.link} className="inline-flex items-center gap-1 mt-2 text-xs text-purple-400 font-semibold hover:underline">
                      Open in Case Workspace →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthorityLayout>
  );
};

export const AuthoritySettings: React.FC = () => {
  const { user, updateCurrentUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || 'Dr. Ramesh Sharma');
  const [department, setDepartment] = useState(user?.department || 'Estate & Campus Facilities');
  const [phone, setPhone] = useState(user?.phone || '+91 98123 45678');
  const [autoDraft, setAutoDraft] = useState(true);
  const [slaEscalateNotify, setSlaEscalateNotify] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({ name, department, phone });
    toast.success('Authority profile and triage preferences updated!');
  };

  return (
    <AuthorityLayout>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Authority Settings & Preferences</h1>
          <p className="text-xs text-gray-400 mt-1">Configure department triage rules, automated AI drafts, and emergency alerts.</p>
        </div>

        <form onSubmit={handleSave} className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-gray-400 uppercase">Authority Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono text-gray-400 uppercase">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-gray-400 uppercase">Direct Duty Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          <div className="pt-3 border-t border-[#262626] flex flex-col gap-3">
            <h4 className="text-xs font-mono font-bold uppercase text-gray-400">AI Automation Controls</h4>
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#171717] border border-[#262626] cursor-pointer text-xs">
              <div>
                <p className="font-semibold text-white">Pre-Generate AI Response Drafts</p>
                <p className="text-[10px] text-gray-400">Automatically synthesize response letters upon docket arrival</p>
              </div>
              <input
                type="checkbox"
                checked={autoDraft}
                onChange={(e) => setAutoDraft(e.target.checked)}
                className="rounded text-purple-600 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#171717] border border-[#262626] cursor-pointer text-xs">
              <div>
                <p className="font-semibold text-white">Emergency SLA Breach Alerts</p>
                <p className="text-[10px] text-gray-400">Immediate high-priority notification when a critical case nears SLA deadline</p>
              </div>
              <input
                type="checkbox"
                checked={slaEscalateNotify}
                onChange={(e) => setSlaEscalateNotify(e.target.checked)}
                className="rounded text-purple-600 focus:ring-0"
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-purple-600/30"
          >
            Save Authority Configuration
          </button>
        </form>
      </div>
    </AuthorityLayout>
  );
};
