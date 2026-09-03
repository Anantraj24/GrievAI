import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/api';

const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setIsSubmitting(true);
    try {
      // 1. Register with live backend
      await api.post('/auth/register', {
        email: email.trim(),
        full_name: name.trim(),
        password: password,
      });

      // 2. Automatically log in to get session JWT
      const loginRes = await api.post('/auth/login', {
        email: email.trim(),
        password: password,
      });

      await login(loginRes.data.access_token, 'student');
      toast.success(`Account registered! Welcome to GrievAI, ${name}.`);
      navigate('/student/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      const errMsg = err?.response?.data?.detail || 'Registration failed. Please check your credentials.';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0b0e14] text-on-surface h-screen w-screen overflow-y-auto flex items-center justify-center p-4 relative font-sans">
      <div className="relative z-10 w-full max-w-md bg-[#10131a] border border-[#2D3139] p-8 rounded-2xl flex flex-col gap-6 shadow-2xl my-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <span className="material-symbols-outlined text-white text-3xl">school</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Student Registration</h1>
          <p className="text-xs text-gray-400">Enroll your student credential into GrievAI System</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-gray-400 uppercase">Full Name</label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. Alice Student"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-gray-400 uppercase">Student ID / Roll No (Optional)</label>
            <input
              type="text"
              disabled={isSubmitting}
              placeholder="e.g. STU-2024-8841"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-gray-400 uppercase">Institutional Email</label>
            <input
              type="email"
              required
              disabled={isSubmitting}
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-gray-400 uppercase">Password</label>
            <input
              type="password"
              required
              disabled={isSubmitting}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Account & Sign In'
            )}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2 border-t border-[#262626]">
          <span>Already registered? </span>
          <Link to="/login" className="text-blue-400 font-semibold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
