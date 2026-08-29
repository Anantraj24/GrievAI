import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { NotificationService } from '../services/notificationService';
import { SystemNotification } from '../types';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/common/EmptyState';

export const StudentNotifications: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchNotifs = () => {
    const list = NotificationService.getForUser('student', user?.id);
    setNotifications(list);
  };

  useEffect(() => {
    fetchNotifs();
  }, [user?.id]);

  const handleMarkAllRead = () => {
    NotificationService.markAllAsRead('student', user?.id);
    fetchNotifs();
    toast.success('All notifications marked as read');
  };

  const handleClearAll = () => {
    NotificationService.clearAll('student', user?.id);
    fetchNotifs();
    toast.info('Cleared notification inbox');
  };

  const handleReadSingle = (id: string) => {
    NotificationService.markAsRead(id);
    fetchNotifs();
  };

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => !n.read);

  return (
    <Layout userRoleLabel="Student Portal" userName={user?.name || 'Student'}>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Notification Center</h1>
            <p className="text-xs text-gray-400 mt-1">Live alerts and status updates on your filed grievance dockets.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="px-3.5 py-2 rounded-xl bg-[#171717] hover:bg-[#262626] text-gray-300 hover:text-white text-xs font-semibold border border-[#262626] transition-colors"
            >
              Mark All as Read
            </button>
            <button
              onClick={handleClearAll}
              className="px-3.5 py-2 rounded-xl bg-[#171717] hover:bg-[#262626] text-gray-400 hover:text-red-400 text-xs font-semibold border border-[#262626] transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-[#262626] pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            All Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === 'unread' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Unread Only ({notifications.filter((n) => !n.read).length})
          </button>
        </div>

        {/* Notifications List */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="notifications_off"
            title="Notification Inbox Clear"
            description="You are all caught up! Updates regarding your submitted grievances will appear here."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => handleReadSingle(n.id)}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  !n.read
                    ? 'bg-blue-950/20 border-blue-500/40 shadow-lg shadow-blue-950/30'
                    : 'bg-[#10131a] border-[#262626] opacity-80 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    n.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : n.type === 'alert'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : n.type === 'warning'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {n.type === 'success' ? 'check_circle' : n.type === 'alert' ? 'emergency' : n.type === 'warning' ? 'warning' : 'info'}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <h4 className="text-xs font-bold text-white tracking-wide">{n.title}</h4>
                    <span className="text-[10px] font-mono text-gray-500">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{n.message}</p>

                  {n.link && (
                    <Link
                      to={n.link}
                      className="inline-flex items-center gap-1 mt-2.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      <span>Open Associated Docket</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentNotifications;
