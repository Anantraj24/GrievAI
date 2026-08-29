import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { useToast } from '../../context/ToastContext';

export const DemoRoleSwitcher: React.FC = () => {
  const { userRole, switchRole, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSwitch = (role: UserRole) => {
    switchRole(role);
    if (role === 'student') {
      toast.info('Switched active session to Student (AnantRaj)');
      navigate('/student/dashboard');
    } else if (role === 'authority') {
      toast.info('Switched active session to Authority (Dr. Ramesh Sharma)');
      navigate('/authority/dashboard');
    } else if (role === 'admin') {
      toast.info('Switched active session to Admin (Sarah Jenkins - Ombudsman)');
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 rounded-full bg-[#171717]/95 border border-[#2D3139] shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-primary/50">
      <div className="flex items-center gap-1.5 pl-3 pr-2 text-xs font-mono text-gray-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="hidden sm:inline">PROTOTYPE ROLE:</span>
      </div>

      <button
        onClick={() => handleSwitch('student')}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
          userRole === 'student'
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 font-semibold'
            : 'text-gray-400 hover:text-white hover:bg-[#262626]'
        }`}
      >
        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: userRole === 'student' ? "'FILL' 1" : "'FILL' 0" }}>
          school
        </span>
        <span>Student</span>
      </button>

      <button
        onClick={() => handleSwitch('authority')}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
          userRole === 'authority'
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20 font-semibold'
            : 'text-gray-400 hover:text-white hover:bg-[#262626]'
        }`}
      >
        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: userRole === 'authority' ? "'FILL' 1" : "'FILL' 0" }}>
          verified_user
        </span>
        <span>Authority</span>
      </button>

      <button
        onClick={() => handleSwitch('admin')}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
          userRole === 'admin'
            ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20 font-semibold'
            : 'text-gray-400 hover:text-white hover:bg-[#262626]'
        }`}
      >
        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: userRole === 'admin' ? "'FILL' 1" : "'FILL' 0" }}>
          admin_panel_settings
        </span>
        <span>Admin</span>
      </button>

      {user && (
        <div className="hidden lg:flex items-center gap-2 pl-2 pr-3 border-l border-[#2D3139] ml-1">
          <img alt="" src={user.avatar} className="w-5 h-5 rounded-full object-cover border border-gray-600" />
          <span className="text-[11px] text-gray-300 font-medium truncate max-w-[120px]">{user.name}</span>
        </div>
      )}
    </div>
  );
};
