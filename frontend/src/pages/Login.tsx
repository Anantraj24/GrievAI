import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { api } from '../api/api';
import { useToast } from '../context/ToastContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('student@example.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'student') {
      setEmail('student@example.com');
      setPassword('password123');
    } else if (role === 'authority') {
      setEmail('authority@example.com');
      setPassword('password123');
    } else {
      setEmail('admin@example.com');
      setPassword('password123');
    }
  };

  const executeLogin = async (loginEmail: string, loginPass: string, roleHint?: UserRole) => {
    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/login', {
        email: loginEmail.trim(),
        password: loginPass,
      });

      const data = res.data;
      const returnedRole: UserRole = (data.role?.toLowerCase() as UserRole) || roleHint || 'student';
      
      await login(data.access_token, returnedRole);
      toast.success(`Welcome to GrievAI! Logged in as ${returnedRole.toUpperCase()}.`);
      
      if (returnedRole === 'student') {
        navigate('/student/dashboard');
      } else if (returnedRole === 'authority') {
        navigate('/authority/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errMsg = err?.response?.data?.detail || 'Invalid email or password. Please try again.';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin(email, password, selectedRole);
  };

  const handleQuickDemo = (role: UserRole) => {
    handleRoleSelect(role);
    let demoEmail = 'student@example.com';
    if (role === 'authority') demoEmail = 'authority@example.com';
    if (role === 'admin') demoEmail = 'admin@example.com';
    executeLogin(demoEmail, 'password123', role);
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
              disabled={isSubmitting}
              onClick={() => handleQuickDemo('student')}
              className="px-2.5 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all flex flex-col items-center gap-1 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">school</span>
              <span>Student</span>
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleQuickDemo('authority')}
              className="px-2.5 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold transition-all flex flex-col items-center gap-1 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Authority</span>
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-2 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-semibold transition-all flex flex-col items-center gap-1 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">shield</span>
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-gray-400 uppercase">Institutional Email</label>
            <input
              type="email"
              required
              disabled={isSubmitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@example.com"
              className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-gray-400 uppercase">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[10px] text-blue-400 hover:underline"
              >
                Forgot?
              </button>
            </div>
            <input
              type="password"
              required
              disabled={isSubmitting}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl mt-2 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              'Sign In with Supabase Auth'
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-[#262626]">
          <span>New student?</span>
          <Link to="/register" className="text-blue-400 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-white">Reset Password</h3>
            <p className="text-xs text-gray-400">
              Enter your institutional email address. A password reset link will be sent to your inbox.
            </p>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="e.g. student@example.com"
              className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 font-mono"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-800 text-xs font-semibold text-gray-300 hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success('Reset link dispatched to ' + (forgotEmail || email));
                  setShowForgotModal(false);
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500 transition-all"
              >
                Send Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
