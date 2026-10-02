import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { api } from '../api/api';
import { useToast } from '../context/ToastContext';

const DEMO_ACCOUNTS: Record<UserRole, { email: string; password: string; label: string; icon: string; color: string }> = {
  student: { email: 'student@example.com', password: 'password123', label: 'Student', icon: 'school', color: 'blue' },
  authority: { email: 'authority@example.com', password: 'password123', label: 'Authority', icon: 'verified_user', color: 'purple' },
  admin: { email: 'admin@example.com', password: 'password123', label: 'Admin', icon: 'shield', color: 'amber' },
};

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Use a ref to track if we're already mid-login to prevent double submits
  const isLoginInProgress = useRef(false);

  const executeLogin = async (loginEmail: string, loginPass: string) => {
    if (isLoginInProgress.current) return;
    if (!loginEmail.trim() || !loginPass) {
      toast.error('Please enter your email and password.');
      return;
    }

    isLoginInProgress.current = true;
    setIsSubmitting(true);

    try {
      const res = await api.post('/auth/login', {
        email: loginEmail.trim().toLowerCase(),
        password: loginPass,
      });

      const data = res.data;
      const returnedRole: UserRole = (data.role?.toLowerCase() as UserRole) || 'student';

      // login() is async — it fetches the real user profile before we navigate
      await login(data.access_token, returnedRole);

      toast.success(`Welcome back! Signed in as ${returnedRole}.`);

      if (returnedRole === 'student') {
        navigate('/student/dashboard', { replace: true });
      } else if (returnedRole === 'authority') {
        navigate('/authority/dashboard', { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errMsg =
        err?.response?.data?.detail ||
        (err?.response?.status === 400 ? 'Invalid email or password.' : 'Connection error. Please try again.');
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
      isLoginInProgress.current = false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin(email, password);
  };

  const handleQuickDemo = (role: UserRole) => {
    const account = DEMO_ACCOUNTS[role];
    // Set state for display, but pass values directly to avoid stale closure
    setEmail(account.email);
    setPassword(account.password);
    executeLogin(account.email, account.password);
  };

  const handleForgotPassword = async () => {
    const target = forgotEmail.trim() || email.trim();
    if (!target) {
      toast.error('Enter an email address to reset.');
      return;
    }
    setForgotLoading(true);
    try {
      // Real API call — if the endpoint doesn't exist yet, it gracefully fails
      await api.post('/auth/forgot-password', { email: target });
    } catch {
      // Silently swallow — don't reveal whether email exists (security)
    } finally {
      setForgotLoading(false);
      toast.success('If that account exists, a reset link has been sent.');
      setShowForgotModal(false);
      setForgotEmail('');
    }
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
          <h1 className="text-2xl font-bold text-white tracking-tight">GrievAI</h1>
          <p className="text-xs text-gray-400">Institutional Student Grievance Resolution System</p>
        </div>

        {/* 1-Click Demo Personas */}
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#171717] border border-[#262626]">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider text-center">
            ⚡ Demo — Sign in as
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(DEMO_ACCOUNTS) as [UserRole, typeof DEMO_ACCOUNTS[UserRole]][]).map(([role, acc]) => (
              <button
                key={role}
                type="button"
                disabled={isSubmitting}
                onClick={() => handleQuickDemo(role)}
                className={`px-2.5 py-2 rounded-lg text-xs font-semibold transition-all flex flex-col items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed
                  ${role === 'student' ? 'bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30' : ''}
                  ${role === 'authority' ? 'bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30' : ''}
                  ${role === 'admin' ? 'bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30' : ''}
                `}
              >
                <span className="material-symbols-outlined text-sm">{acc.icon}</span>
                <span>{acc.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs font-mono text-gray-400 uppercase">
              Institutional Email
            </label>
            <input
              id="email"
              type="email"
              required
              disabled={isSubmitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@institution.edu"
              autoComplete="email"
              className="bg-[#171717] border border-[#2D3139] text-white text-sm rounded-xl p-3 focus:outline-none focus:border-blue-500 font-mono placeholder:text-gray-600 disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-mono text-gray-400 uppercase">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[10px] text-blue-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-[#171717] border border-[#2D3139] text-white text-sm rounded-xl p-3 pr-10 focus:outline-none focus:border-blue-500 font-mono placeholder:text-gray-600 disabled:opacity-60"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined text-base">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm py-3.5 rounded-xl mt-2 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in…</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-[#262626]">
          <span>New here?</span>
          <Link to="/register" className="text-blue-400 font-semibold hover:underline">
            Create an account
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-white">Reset your password</h3>
            <p className="text-xs text-gray-400">
              Enter your institutional email. If an account exists, we'll send a reset link.
            </p>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder={email || 'you@institution.edu'}
              autoComplete="email"
              className="bg-[#171717] border border-[#2D3139] text-white text-sm rounded-xl p-3 focus:outline-none focus:border-blue-500 font-mono"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setShowForgotModal(false); setForgotEmail(''); }}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-800 text-xs font-semibold text-gray-300 hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={forgotLoading}
                onClick={handleForgotPassword}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {forgotLoading ? (
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : 'Send reset link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
