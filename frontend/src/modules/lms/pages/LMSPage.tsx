import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  Zap,
  LayoutGrid,
  LayoutList,
  ChevronRight,
  Target
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CourseCard } from '../components/CourseCard';
import { LearningPathCard } from '../components/LearningPathCard';
import lmsService from '@/services/lms.service';

export default function LMSPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('catalog');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesRes, myCoursesRes, pathsRes, categoriesRes] = await Promise.all([
        lmsService.getCourses(),
        lmsService.getMyCourses(),
        lmsService.getLearningPaths(),
        lmsService.getCategories(),
      ]);
      setCourses(coursesRes.data?.data?.courses || []);
      setMyCourses(myCoursesRes.data?.data || []);
      setLearningPaths(pathsRes.data?.data || []);
      setCategories(categoriesRes.data?.data || []);
    } catch (error) {
      console.error('Error loading LMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await lmsService.getCourses({ 
        search: searchQuery, 
        category: selectedCategory === 'all' ? undefined : selectedCategory || undefined 
      });
      setCourses(res.data?.data?.courses || []);
    } catch (error) {
      console.error('Error searching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await lmsService.enrollInCourse(courseId);
      loadData();
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  const enrollmentsMap = new Map(myCourses.map(e => [e.courseId, e]));

  return (
    <div className="min-h-screen bg-[#18181b] text-foreground p-6 sm:p-10 lg:p-16 space-y-12">
      {/* Premium Header */}
      <header className="relative p-12 lg:p-16 rounded-[3rem] overflow-hidden bg-background border border-white/5 space-y-8">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 p-8">
          <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
            V 2.0 // Neural LMS
          </Badge>
        </div>
        
        <div className="max-w-4xl space-y-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl lg:text-6xl font-bold tracking-tighter uppercase leading-none"
          >
            Advance <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">Knowledge</span> Matrix
          </motion.h1>
          <p className="text-muted-foreground text-sm lg:text-base font-medium max-w-2xl leading-relaxed">
            Access world-class pedagogical resources, real-time assessments, and intelligent learning paths tailored to your professional development goals.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              placeholder="Search Subject Core..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-4 h-14 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl w-full sm:w-48 text-sm font-medium">
              <SelectValue placeholder="All Domains" />
            </SelectTrigger>
            <SelectContent className="bg-background border-white/10 text-foreground">
              <SelectItem value="all">All Domains</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSearch} className="h-14 px-8 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
            Execute Query
          </Button>
        </div>
      </header>

      {/* Stats Quickbar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Enrolled Units" value={myCourses.length} icon={BookOpen} color="text-indigo-400" />
        <StatCard label="Completed Paths" value="0" icon={Trophy} color="text-amber-400" />
        <StatCard label="Knowledge Points" value="1,240" icon={Zap} color="text-rose-400" />
        <StatCard label="Active Sessions" value={courses.length} icon={Target} color="text-violet-400" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <div className="flex justify-between items-center">
          <TabsList className="bg-white/5 border border-white/5 p-1 rounded-2xl h-auto">
            <TabsTrigger value="catalog" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-foreground uppercase text-[10px] font-bold tracking-widest">Global Catalog</TabsTrigger>
            <TabsTrigger value="my-courses" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-foreground uppercase text-[10px] font-bold tracking-widest">My Learning</TabsTrigger>
            <TabsTrigger value="paths" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-foreground uppercase text-[10px] font-bold tracking-widest">Neural Paths</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
             <Button variant="ghost" size="icon" className="rounded-xl bg-white/5 border border-white/5"><LayoutGrid size={18} /></Button>
             <Button variant="ghost" size="icon" className="rounded-xl opacity-40"><LayoutList size={18} /></Button>
          </div>
        </div>

        <TabsContent value="catalog" className="mt-0 outline-none">
          {loading ? (
            <LoadingGrid />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {/* Dynamic AI Recommendation Card */}
              <motion.div 
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-indigo-600 to-violet-800 p-8 rounded-[2.5rem] flex flex-col justify-between group cursor-pointer relative overflow-hidden shadow-2xl shadow-indigo-500/20 border border-white/10"
              >
                <div className="absolute top-0 right-0 p-6">
                  <Sparkles className="text-foreground/40 group-hover:text-foreground transition-colors" size={24} />
                </div>
                <div className="space-y-4 relative z-10">
                  <Badge className="bg-white/20 text-foreground border-transparent">AI Suggested</Badge>
                  <h3 className="text-2xl font-bold tracking-tight uppercase leading-none">Pedagogical <br />Leadership</h3>
                  <p className="text-foreground/60 text-xs font-medium uppercase tracking-widest">High-impact certification for lead educators.</p>
                </div>
                <Button className="mt-8 bg-white text-indigo-950 hover:bg-neutral-100 rounded-xl font-bold uppercase text-[10px] w-full flex items-center gap-2">
                  Launch Assessment <ChevronRight size={14} />
                </Button>
              </motion.div>

              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  enrollment={enrollmentsMap.get(course.id)}
                  onEnroll={() => handleEnroll(course.id)}
                  onClick={() => navigate(`/lms/courses/${course.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-courses" className="outline-none">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {myCourses.map((enrollment) => (
                <CourseCard
                  key={enrollment.id}
                  course={enrollment.course}
                  enrollment={enrollment}
                  onClick={() => navigate(`/lms/courses/${enrollment.courseId}`)}
                />
              ))}
           </div>
        </TabsContent>

        <TabsContent value="paths" className="outline-none">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {learningPaths.map((path) => (
                <LearningPathCard
                  key={path.id}
                  path={path}
                  onClick={() => navigate(`/lms/paths/${path.id}`)}
                />
              ))}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-background border border-white/5 p-8 rounded-[2rem] flex items-center gap-6 group hover:border-white/10 transition-all">
      <div className={`p-4 bg-white/5 rounded-2xl ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-slate-500 uppercase font-bold text-[9px] tracking-[0.2em] mb-1">{label}</p>
        <p className="text-2xl font-bold tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-80 bg-white/5 rounded-[2.5rem] animate-pulse" />
      ))}
    </div>
  );
}