import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { AdminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('anantraj@institution.edu');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'student') {
      setEmail('anantraj@institution.edu');
    } else if (role === 'authority') {
      setEmail('ramesh.sharma@institution.edu');
    } else {
      setEmail('sarah.jenkins@institution.edu');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allUsers = AdminService.getUsers();
    const matchedUser = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || allUsers.find((u) => u.role === selectedRole);

    login('jwt_demo_token_' + Date.now(), selectedRole, matchedUser);
    toast.success(`Welcome back, ${matchedUser?.name || 'User'}!`);

    if (selectedRole === 'student') {
      navigate('/student/dashboard');
    } else if (selectedRole === 'authority') {
      navigate('/authority/dashboard');
    } else {
      navigate('/admin/dashboard');
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    handleRoleSelect(role);
    const allUsers = AdminService.getUsers();
    const matchedUser = allUsers.find((u) => u.role === role);
    login('jwt_demo_token_' + Date.now(), role, matchedUser);
    toast.success(`Logged in as ${matchedUser?.name} (${role.toUpperCase()})`);
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="bg-[#0b0e14] text-on-surface h-screen w-screen overflow-hidden flex items-center justify-center relative font-sans">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#10131a] border border-[#2D3139] p-8 rounded-2xl flex flex-col gap-6 shadow-2xl mx-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 mb-1">
            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">GrievAI Intelligence</h1>
          <p className="text-xs text-gray-400">Institutional Student Grievance Resolution Protocol</p>
        </div>

        {/* 1-Click Fast Demo Personas */}
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#171717] border border-[#262626]">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider text-center">
            ⚡ Quick 1-Click Demo Login
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="px-2.5 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all flex flex-col items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">school</span>
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('authority')}
              className="px-2.5 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold transition-all flex flex-col items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Authority</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-2 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-semibold transition-all flex flex-col items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Role selector tabs */}
          <div className="grid grid-cols-3 gap-1 bg-[#171717] p-1 rounded-xl border border-[#262626]">
            {(['student', 'authority', 'admin'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleSelect(r)}
                className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  selectedRole === r
                    ? 'bg-[#262626] text-white shadow-sm border border-gray-700'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider" htmlFor="email">
              Institutional Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                mail
              </span>
              <input
                className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                id="email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-wider" htmlFor="password">
                Access Token / Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-blue-400 hover:underline"
              >
                Forgot Token?
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                lock
              </span>
              <input
                className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                id="password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl mt-2 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-98"
            type="submit"
          >
            Authenticate & Enter
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2 border-t border-[#262626] flex items-center justify-between">
          <span>New student?</span>
          <Link to="/register" className="text-blue-400 font-semibold hover:underline">
            Create Student Account
          </Link>
        </div>
      </div>

      {/* Forgot Token Simulation Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171717] border border-[#2D3139] rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-white">Reset Institutional Token</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Enter your student or faculty institutional email. A secure 6-digit magic OTP will be simulated.
            </p>
            <input
              type="email"
              placeholder="user@institution.edu"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="bg-[#10131a] border border-[#2D3139] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  toast.success('Simulation OTP sent: 884-219');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
              >
                Send Magic Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
