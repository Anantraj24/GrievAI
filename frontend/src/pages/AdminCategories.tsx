import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { AdminService } from '../services/adminService';
import { Category } from '../types';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(AdminService.getCategories());
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Grievance Category Taxonomy</h1>
          <p className="text-xs text-gray-400 mt-1">Autonomous NLP classification rules, subcategories, and routing destinations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-[#10131a] border border-[#2D3139] rounded-2xl p-6 flex flex-col gap-4 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                <h3 className="text-base font-bold text-white">{cat.name}</h3>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    cat.sensitivityLevel === 'high'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : cat.sensitivityLevel === 'medium'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {cat.sensitivityLevel} sensitivity
                </span>
              </div>

              <div className="flex flex-col gap-1.5 text-xs">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Default Routed Department</span>
                <p className="font-semibold text-amber-400">{cat.defaultDepartment}</p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Indexed Subcategories</span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub) => (
                    <span
                      key={sub}
                      className="px-2.5 py-1 rounded-lg bg-[#171717] border border-[#262626] text-xs text-gray-300 font-medium"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
