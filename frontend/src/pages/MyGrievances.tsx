import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { GrievanceService } from '../services/grievanceService';
import { Grievance, GrievanceStatus } from '../types';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';

const MyGrievances: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);

  const statusParam = searchParams.get('status') || 'ALL';

  useEffect(() => {
    const list = GrievanceService.getByStudent(user?.id);
    setGrievances(list);
  }, [user?.id]);

  const handleStatusFilter = (status: string) => {
    if (status === 'ALL') {
      searchParams.delete('status');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ status });
    }
  };

  const filtered = grievances.filter((g) => {
    const matchesSearch =
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusParam === 'ALL' ||
      (statusParam === 'active' && (g.status === 'in_progress' || g.status === 'submitted')) ||
      (statusParam === 'under_review' && (g.status === 'under_review' || g.status === 'information_requested')) ||
      (statusParam === 'resolved' && (g.status === 'resolved' || g.status === 'closed')) ||
      (statusParam === 'escalated' && g.status === 'escalated') ||
      g.status === statusParam;

    const matchesCat = selectedCategory === 'ALL' || g.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCat;
  });

  const categoriesList = Array.from(new Set(grievances.map((g) => g.category)));

  return (
    <Layout userRoleLabel="Student Portal" userName={user?.name || 'Student'}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">My Grievance Dockets</h1>
            <p className="text-xs text-gray-400 mt-1">
              Search and track all active and historical cases filed under your student credential.
            </p>
          </div>
          <Link
            to="/student/submit"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Submit New Case
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search case ID, keyword, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Categories</option>
              {categoriesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { key: 'ALL', label: 'All Cases', count: grievances.length },
            { key: 'active', label: 'Active', count: grievances.filter((g) => g.status === 'in_progress' || g.status === 'submitted').length },
            { key: 'under_review', label: 'Under Review', count: grievances.filter((g) => g.status === 'under_review' || g.status === 'information_requested').length },
            { key: 'resolved', label: 'Resolved', count: grievances.filter((g) => g.status === 'resolved' || g.status === 'closed').length },
            { key: 'escalated', label: 'Escalated', count: grievances.filter((g) => g.status === 'escalated').length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleStatusFilter(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                (statusParam === 'ALL' && tab.key === 'ALL') || statusParam === tab.key
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-[#10131a] text-gray-400 hover:text-white border border-[#262626]'
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px] font-mono">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Grievances Table / Cards */}
        {filtered.length === 0 ? (
          <EmptyState
            title="No Grievances Match Criteria"
            description="Try clearing your search keyword or switching status filters to view other dockets."
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              handleStatusFilter('ALL');
            }}
          />
        ) : (
          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#262626] bg-[#0d1017] text-[10px] font-mono uppercase text-gray-400 tracking-wider">
                    <th className="py-3.5 px-5">Case ID & Title</th>
                    <th className="py-3.5 px-4">Department & Category</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Filed Date</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c202a] text-xs">
                  {filtered.map((g) => (
                    <tr key={g.id} className="hover:bg-[#171b26] transition-colors group">
                      <td className="py-4 px-5">
                        <Link to={`/student/grievance/${g.id}`} className="flex flex-col min-w-0">
                          <span className="font-mono text-blue-400 font-bold group-hover:text-blue-300 transition-colors">
                            {g.id}
                          </span>
                          <span className="text-gray-200 font-medium truncate max-w-xs">{g.title}</span>
                          <span className="text-[11px] text-gray-500 font-mono mt-0.5 truncate">{g.location}</span>
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-gray-200 font-medium">{g.department}</span>
                          <span className="text-[11px] text-gray-500">{g.subcategory || g.category}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <PriorityBadge priority={g.priority} />
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={g.status} />
                      </td>
                      <td className="py-4 px-4 font-mono text-gray-400 text-[11px]">
                        {g.createdAt.slice(0, 10)}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedGrievance(g)}
                            title="Quick Drawer View"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#262626] transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">visibility</span>
                          </button>
                          <Link
                            to={`/student/grievance/${g.id}`}
                            className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all"
                          >
                            Track
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Quick Drawer Preview */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedGrievance(null)}
          ></div>
          <div className="relative w-full max-w-lg h-full bg-[#10131a] border-l border-[#2D3139] p-6 overflow-y-auto flex flex-col gap-5 z-10 animate-slide-in shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-4">
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">
                  {selectedGrievance.id}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedGrievance.title}</h3>
              </div>
              <button
                onClick={() => setSelectedGrievance(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#262626]"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={selectedGrievance.status} size="md" />
              <PriorityBadge priority={selectedGrievance.priority} size="md" />
            </div>

            <div className="bg-[#171717] border border-[#262626] rounded-xl p-4 text-xs flex flex-col gap-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Case Summary</span>
              <p className="text-gray-200 leading-relaxed">{selectedGrievance.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#171717] p-3 rounded-xl border border-[#262626]">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Department</span>
                <p className="font-semibold text-white mt-1">{selectedGrievance.department}</p>
              </div>
              <div className="bg-[#171717] p-3 rounded-xl border border-[#262626]">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Location</span>
                <p className="font-semibold text-white mt-1">{selectedGrievance.location}</p>
              </div>
            </div>

            <Link
              to={`/student/grievance/${selectedGrievance.id}`}
              className="mt-auto w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold text-center transition-all shadow-lg shadow-blue-600/30"
            >
              Open Full Case Dossier
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MyGrievances;
