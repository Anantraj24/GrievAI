import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import { User } from '../types';

const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !studentId) return;

    const newUser: User = {
      id: `usr_student_${Date.now()}`,
      name,
      email,
      role: 'student',
      studentId,
      department,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      joinedDate: new Date().toISOString().slice(0, 10),
      status: 'active',
    };

    AdminService.saveUser(newUser);
    login('jwt_token_' + Date.now(), 'student', newUser);
    toast.success(`Account registered! Welcome to GrievAI, ${name}.`);
    navigate('/student/dashboard');
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
              placeholder="e.g. AnantRaj"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-gray-400 uppercase">Student ID / Roll No</label>
            <input
              type="text"
              required
              placeholder="e.g. STU-2024-8841"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-gray-400 uppercase">Academic Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
            >
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering & Architecture">Civil Engineering & Architecture</option>
              <option value="Management & Commerce">Management & Commerce</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-gray-400 uppercase">Institutional Email</label>
            <input
              type="email"
              required
              placeholder="anantraj@institution.edu"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl mt-2 transition-all shadow-lg shadow-blue-600/30"
          >
            Create Account & Sign In
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
