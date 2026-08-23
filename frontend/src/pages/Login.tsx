import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder login logic for MVP shell
    login('dummy_token', 'student');
    navigate('/student');
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface h-screen w-screen overflow-hidden flex items-center justify-center relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-surface-container-lowest opacity-90 z-10 mix-blend-multiply"></div>
        <img
          alt=""
          className="w-full h-full object-cover opacity-30 object-center"
          src="https://lh3.googleusercontent.com/aida/AEtjO1VDi40uDBM-Xy-Z4mtb8QC2IDlRnImQtTy_7QpSdOs35zS1ywi0dxZJemM9qULjI4LOqbdi0ib-R2KT5DNVnJwOFm4Bwzst6E_1f9KFOmtadRhWPxYuxDEvk9zDZ_AGlfr1B8M-hkvwYUsU4J-D1bGoqWo-ywO9CsVGbgzMszakhRSPxqoLCh9ChJr0vTcwrkj6G8HMfuk22I8OrBYrjVQ1cAIMrBp4lU8m4IHjxuuL71MNjzBmKr9_-g"
        />
      </div>
      
      <div className="relative z-10 w-full max-w-[440px] bg-surface-container-low border border-[#2D3139] p-container-padding rounded-xl flex flex-col gap-stack-lg shadow-2xl mx-gutter">
        <div className="flex flex-col items-center gap-stack-sm text-center">
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            GrievAI
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Welcome back. Secure access to institutional AI.
          </p>
        </div>
        
        <form className="flex flex-col gap-stack-md" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-stack-sm">
            <label
              className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
              htmlFor="email"
            >
              Institutional Email
            </label>
            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                mail
              </span>
              <input
                className="w-full bg-[#1A1D23] border border-[#2D3139] text-on-surface font-body-md text-body-md rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/10 transition-colors"
                id="email"
                placeholder="admin@institution.edu"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-stack-sm">
            <div className="flex justify-between items-center">
              <label
                className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
                htmlFor="password"
              >
                Access Token
              </label>
              <a
                className="font-label-md text-label-md text-primary hover:text-primary-fixed transition-colors"
                href="#"
              >
                Forgot Token?
              </a>
            </div>
            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                lock
              </span>
              <input
                className="w-full bg-[#1A1D23] border border-[#2D3139] text-on-surface font-body-md text-body-md rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/10 transition-colors"
                id="password"
                placeholder="••••••••"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <button
            className="w-full bg-[#3B82F6] hover:bg-primary-container text-white font-label-md text-label-md uppercase tracking-wider py-3 rounded-lg mt-unit transition-colors flex items-center justify-center gap-2"
            type="submit"
          >
            Authenticate
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              arrow_forward
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
