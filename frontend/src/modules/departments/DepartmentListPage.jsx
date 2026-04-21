import { Card } from '../../components/ui/CardLegacy';
import { Button } from '../../components/ui/ButtonLegacy';
import departments from '../../data/departments.json';
import { Building2, Search, Filter, Plus, ChevronRight, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DepartmentListPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-300">Departments</h1>
                    <p className="text-gray-400">Manage organizational units and staff allocation.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" /> Add Department
                </Button>
            </div>

            <Card className="p-4 px-6 flex flex-col md:flex-row items-center gap-4 border-none shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search departments..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0f172a] border border-transparent focus:bg-[#111c2a] focus:border-brand-300 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="secondary" className="gap-2 flex-1 md:flex-none">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                    <Button variant="secondary" className="gap-2 flex-1 md:flex-none">
                        Sort by: A-Z
                    </Button>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept, index) => (
                    <motion.div
                        key={dept.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="p-0 overflow-hidden flex flex-col h-full border-white/50 border">
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-backgroundrand-50 flex items-center justify-center text-brand-600">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <button className="p-1 hover:bg-[#1e293b] rounded-lg">
                                        <MoreVertical className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-neutral-300 mb-1">{dept.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-wider">
                                    <span className="bg-[#1e293b] px-2 py-1 rounded">Head: Sarah Johnson</span>
                                    <span className="bg-[#1e293b] px-2 py-1 rounded">24 Members</span>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-[#0f172a]/50 border-t border-neutral-800 flex items-center justify-between group cursor-pointer hover:bg-backgroundrand-50 transition-colors">
                                <span className="text-sm font-semibold text-gray-300 group-hover:text-brand-600">View Details</span>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
