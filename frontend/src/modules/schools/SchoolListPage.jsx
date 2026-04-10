import { Card } from '../../components/ui/CardLegacy';
import { Button } from '../../components/ui/ButtonLegacy';
import schools from '../../data/schools.json';
import { School, Search, Filter, Plus, MapPin, ExternalLink, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SchoolListPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-300">Schools</h1>
                    <p className="text-gray-400">Manage school locations across different categories.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" /> Add School
                </Button>
            </div>

            {schools.map((category, catIndex) => (
                <div key={category.category} className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-200"></div>
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">{category.category}</h2>
                        <div className="h-px flex-1 bg-gray-200"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {category.schools.map((school, schoolIndex) => (
                            <motion.div
                                key={school.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: (catIndex * 3 + schoolIndex) * 0.05 }}
                            >
                                <Card className="group relative overflow-hidden bg-[#111c2a] hover:border-brand-300">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 rounded-bl-full flex items-center justify-center -mr-12 -mt-12 transition-transform group-hover:scale-110">
                                        <School className="w-5 h-5 text-brand-200 mt-8 ml-8" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="w-12 h-12 rounded-2xl bg-neutral-800/5 flex items-center justify-center text-brand-600">
                                            <GraduationCap className="w-6 h-6" />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-neutral-300">{school.name}</h3>
                                            <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span>Bengaluru, India</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex items-center justify-between border-t border-neutral-800">
                                            <span className="text-xs font-semibold px-2 py-1 bg-[#0f172a] text-gray-400 rounded-md">ID: {school.id.toUpperCase()}</span>
                                            <button className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
