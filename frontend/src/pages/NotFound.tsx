import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const NotFound: React.FC = () => {
  const { userRole } = useAuth();
  const defaultPath = userRole ? `/${userRole}/dashboard` : '/login';

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 shadow-2xl">
        <span className="material-symbols-outlined text-4xl">search_off</span>
      </div>
      <h1 className="text-4xl font-bold font-mono tracking-tight text-white mb-2">404</h1>
      <h2 className="text-lg font-semibold text-gray-200 mb-2">Institutional Resource Not Found</h2>
      <p className="text-xs text-gray-400 max-w-md mb-6 leading-relaxed">
        The grievance docket, case ID, or dashboard endpoint you requested does not exist or has been archived.
      </p>
      <Link
        to={defaultPath}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Return to Portal
      </Link>
    </div>
  );
};

export const Unauthorized: React.FC = () => {
  const { userRole } = useAuth();
  const defaultPath = userRole ? `/${userRole}/dashboard` : '/login';

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-6 shadow-2xl">
        <span className="material-symbols-outlined text-4xl">gpp_maybe</span>
      </div>
      <h1 className="text-4xl font-bold font-mono tracking-tight text-white mb-2">403</h1>
      <h2 className="text-lg font-semibold text-gray-200 mb-2">Institutional Access Restricted</h2>
      <p className="text-xs text-gray-400 max-w-md mb-6 leading-relaxed">
        You do not have administrative or authority clearance to access this case intelligence sector. Please switch roles using the prototype bar below.
      </p>
      <Link
        to={defaultPath}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-sm">home</span>
        Return to Authorized Dashboard
      </Link>
    </div>
  );
};
