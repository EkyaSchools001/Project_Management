import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, userService } from "@/services/userService";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MagnifyingGlass, UserCircle, CaretRight } from "@phosphor-icons/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CAMPUS_OPTIONS } from "@/lib/constants";

export function PortfolioDirectory() {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      // Assuming a method to get all accessible teachers:
      const data = await userService.getTeachers();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (t.department && t.department.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCampus = selectedCampus === "all" || t.campusId === selectedCampus;
    
    return matchesSearch && matchesCampus;
  });

  if (loading) return <div className="p-8">Loading Directory...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Staff Portfolios</h1>
        <p className="text-gray-500 mt-1">Directory of all teacher Teacher Development portfolios</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            placeholder="Search by name or department..." 
            className="pl-10 h-12 w-full rounded-xl bg-white shadow-sm border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-64">
          <Select value={selectedCampus} onValueChange={setSelectedCampus}>
            <SelectTrigger className="h-12 rounded-xl bg-white shadow-sm border-gray-200">
              <SelectValue placeholder="Select Campus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campuses</SelectItem>
              {CAMPUS_OPTIONS.map(campus => (
                <SelectItem key={campus} value={campus}>{campus}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map(teacher => (
          <Card 
            key={teacher.id} 
            className="group p-6 hover:shadow-md transition-all duration-300 cursor-pointer border-gray-100 flex items-center justify-between bg-white"
            onClick={() => navigate(`/portfolio/${teacher.id}`)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-[#EA104A]">
                <UserCircle className="w-8 h-8" weight="fill" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{teacher.fullName}</h3>
                <p className="text-sm text-gray-500">{teacher.department || "No Department"} • {teacher.campusId || "No Campus"}</p>
              </div>
            </div>
            <CaretRight className="w-5 h-5 text-gray-300 group-hover:text-[#EA104A] transition-colors" weight="bold" />
          </Card>
        ))}
        {filteredTeachers.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No teachers found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
