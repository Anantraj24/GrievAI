import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthorityLayout from '../components/AuthorityLayout';
import { GrievanceService } from '../services/grievanceService';
import { Grievance } from '../types';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';

const GrievanceQueue: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  const tabParam = searchParams.get('tab') || 'ALL';

  useEffect(() => {
    const list = GrievanceService.getAll();
    setGrievances(list);
    GrievanceService.getAllAsync().then((liveList) => {
      if (liveList && liveList.length > 0) {
        setGrievances(liveList);
      }
    }).catch(() => {});
  }, []);

  const handleTabChange = (tab: string) => {
    if (tab === 'ALL') {
      searchParams.delete('tab');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ tab });
    }
  };

  const filtered = grievances.filter((g) => {
    const matchesSearch =
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || g.department === selectedDept;
    const matchesPriority = selectedPriority === 'ALL' || g.priority === selectedPriority;

    let matchesTab = true;
    if (tabParam === 'critical') {
      matchesTab = g.priority === 'CRITICAL';
    } else if (tabParam === 'under_review') {
      matchesTab = g.status === 'under_review' || g.status === 'submitted';
    } else if (tabParam === 'in_progress') {
      matchesTab = g.status === 'in_progress';
    } else if (tabParam === 'resolved') {
      matchesTab = g.status === 'resolved';
    } else if (tabParam === 'sla_breached') {
      matchesTab = g.slaBreached;
    }

    return matchesSearch && matchesDept && matchesPriority && matchesTab;
  });

  const departmentList = Array.from(new Set(grievances.map((g) => g.department)));

  return (
    <AuthorityLayout>
      <div className="flex flex-col gap-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Assigned Grievances Queue</h1>
            <p className="text-xs text-gray-400 mt-1">
              Active operational queue of student cases requiring triage, AI response approval, and resolution.
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search by case ID, student name, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Department Dropdown */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Departments</option>
              {departmentList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Priority Dropdown */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-[#171717] border border-[#2D3139] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { key: 'ALL', label: 'All Cases', count: grievances.length },
            { key: 'critical', label: 'Critical Alert', count: grievances.filter((g) => g.priority === 'CRITICAL').length },
            { key: 'under_review', label: 'Needs Triage', count: grievances.filter((g) => g.status === 'under_review' || g.status === 'submitted').length },
            { key: 'in_progress', label: 'In Remediation', count: grievances.filter((g) => g.status === 'in_progress').length },
            { key: 'sla_breached', label: 'SLA Breached', count: grievances.filter((g) => g.slaBreached).length },
            { key: 'resolved', label: 'Resolved', count: grievances.filter((g) => g.status === 'resolved').length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                (tabParam === 'ALL' && tab.key === 'ALL') || tabParam === tab.key
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
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

        {/* Queue Table */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="task"
            title="No Grievances in this Queue Filter"
            description="All cases matching this criteria have been resolved or filtered out."
            actionText="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedDept('ALL');
              setSelectedPriority('ALL');
              handleTabChange('ALL');
            }}
          />
        ) : (
          <div className="bg-[#10131a] border border-[#2D3139] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-[#262626] bg-[#0d1017] text-[10px] font-mono uppercase text-gray-400 tracking-wider">
                    <th className="py-3.5 px-5">Case ID & Student</th>
                    <th className="py-3.5 px-4">Subject & Location</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">SLA Deadline</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Workspace</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c202a] text-xs">
                  {filtered.map((g) => (
                    <tr key={g.id} className="hover:bg-[#171b26] transition-colors group">
                      <td className="py-4 px-5">
                        <Link to={`/authority/workspace/${g.id}`} className="flex flex-col">
                          <span className="font-mono text-purple-400 font-bold group-hover:text-purple-300 transition-colors">
                            {g.id}
                          </span>
                          <span className="text-gray-300 font-medium">{g.studentName}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{g.studentEmail}</span>
                        </Link>
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <p className="text-white font-semibold truncate">{g.title}</p>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">{g.location}</p>
                      </td>
                      <td className="py-4 px-4 text-gray-300">{g.department}</td>
                      <td className="py-4 px-4">
                        <PriorityBadge priority={g.priority} />
                      </td>
                      <td className="py-4 px-4 font-mono text-[11px]">
                        <span className={g.slaBreached ? 'text-red-400 font-bold' : 'text-amber-300'}>
                          {g.slaBreached ? 'OVERDUE' : g.slaDeadline.slice(0, 10)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={g.status} />
                      </td>
                      <td className="py-4 px-5 text-right">
                        <Link
                          to={`/authority/workspace/${g.id}`}
                          className="px-3.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                          Open Case
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AuthorityLayout>
  );
};

export default GrievanceQueue;
