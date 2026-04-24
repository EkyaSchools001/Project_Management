import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Settings, 
  Users, 
  Lock, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Globe,
  Building,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MODULE_GROUPS = [
  { name: 'Academics', icon: '🎓' },
  { name: 'Attendance', icon: '📅' },
  { name: 'Finance', icon: '💰' },
  { name: 'HR & payroll', icon: '👥' },
  { name: 'Lifecycle', icon: '🔄' },
  { name: 'Communication', icon: '📢' },
  { name: 'Operations', icon: '⚙️' },
  { name: 'Analytics', icon: '📊' },
  { name: 'System', icon: '🛠️' },
];

const ROLES = [
  'SUPER_ADMIN', 'MANAGEMENT', 'HOS', 'COORDINATOR', 'TEACHER_CORE', 'ADMIN_HR'
];

export default function RBACDashboard() {
  const [selectedGroup, setSelectedGroup] = useState('Academics');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-[#0A0A0B] text-white">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-2">
            Enterprise RBAC Control
          </h1>
          <p className="text-gray-400 text-lg">Manage permissions across 45 ERP modules and 20 specific roles.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1C] hover:bg-[#252528] rounded-xl border border-white/5 transition-all">
            <History className="w-5 h-5 text-blue-400" />
            <span>Audit Logs</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all">
            <CheckCircle2 className="w-5 h-5" />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar - Functional Domains */}
        <div className="col-span-12 lg:col-span-3 space-y-3">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search modules..."
              className="w-full bg-[#161618] border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="bg-[#121214] border border-white/5 rounded-2xl p-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-4 py-3">Functional Domains</h3>
            {MODULE_GROUPS.map((group) => (
              <button
                key={group.name}
                onClick={() => setSelectedGroup(group.name)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group ${
                  selectedGroup === group.name ? 'bg-blue-600/10 text-blue-400' : 'hover:bg-white/5 text-gray-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{group.icon}</span>
                  <span className="font-medium">{group.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedGroup === group.name ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Permission Matrix */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-600/5 to-transparent">
              <div className="flex items-center gap-4 mb-2">
                <span className="p-3 bg-blue-600/20 rounded-2xl text-blue-400">
                  <Shield className="w-6 h-6" />
                </span>
                <h2 className="text-2xl font-bold">{selectedGroup} Matrix</h2>
              </div>
              <p className="text-gray-500">Configuring default access levels for {selectedGroup} modules.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#161618]">
                    <th className="text-left py-5 px-8 font-semibold text-gray-400 min-w-[200px]">Module</th>
                    {ROLES.map(role => (
                      <th key={role} className="py-5 px-4 font-semibold text-gray-400 text-center min-w-[120px]">
                        {role.replace('_', ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['Curriculum', 'Gradebook', 'Timetable', 'Calendar'].map((mod, idx) => (
                    <tr key={mod} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${idx % 2 === 0 ? 'bg-[#0E0E10]' : ''}`}>
                      <td className="py-6 px-8">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-200">{mod}</span>
                          <span className="text-xs text-gray-500 uppercase">ACAD_{mod.toUpperCase()}</span>
                        </div>
                      </td>
                      {ROLES.map(role => {
                        const hasAccess = (role === 'SUPER_ADMIN' || role === 'MANAGEMENT' || (role === 'HOS' && mod !== 'Timetable'));
                        return (
                          <td key={role} className="py-6 px-4 text-center">
                            <button className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-all ${
                              hasAccess 
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20' 
                              : 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'
                            }`}>
                              {hasAccess ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scoping Legend */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'System', icon: Globe, color: 'text-purple-400', bg: 'bg-purple-400/10', desc: 'Full multi-campus view' },
              { label: 'Campus', icon: Building, color: 'text-blue-400', bg: 'bg-blue-400/10', desc: 'Single campus restriction' },
              { label: 'Section', icon: Users, color: 'text-amber-400', bg: 'bg-amber-400/10', desc: 'Department/Grade level only' },
              { label: 'Own', icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10', desc: 'Personal record access' },
            ].map(scope => (
              <div key={scope.label} className="bg-[#121214] border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-all">
                <div className={`w-12 h-12 ${scope.bg} ${scope.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <scope.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg mb-1">{scope.label} Scope</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{scope.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
