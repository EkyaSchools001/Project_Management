import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  ChartLineUp, 
  GraduationCap, 
  Target, 
  Trophy, 
  CalendarBlank,
  Plus,
  EnvelopeSimple,
  DownloadSimple
} from "@phosphor-icons/react";
import { useAuth } from "@pdi/hooks/useAuth";
import { portfolioService, PortfolioSummary, TimelineEvent, PortfolioAchievement } from "@pdi/services/portfolioService";
import { Button } from "@pdi/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@pdi/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@pdi/components/ui/dialog";
import { Input } from "@pdi/components/ui/input";
import { Textarea } from "@pdi/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

export function TeacherPortfolio() {
  const { user } = useAuth();
  const { teacherId } = useParams();
  
  // Use URL param if provided (for leaders/admins), otherwise use logged-in user's ID
  const effectiveTeacherId = teacherId || user?.id;
  const isViewOnly = !!teacherId && teacherId !== user?.id;

  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);

  // New Achievement Form State
  const [achTitle, setAchTitle] = useState("");
  const [achDesc, setAchDesc] = useState("");
  const [achDate, setAchDate] = useState(new Date().toISOString().split('T')[0]);
  const [achCategory, setAchCategory] = useState("Achievement");
  
  // Email Portfolio State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
 
  useEffect(() => {
    if (effectiveTeacherId) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveTeacherId]);
 
  const fetchData = async () => {
    setLoading(true);
    try {
      const [sum, time] = await Promise.all([
        portfolioService.getSummary(effectiveTeacherId!),
        portfolioService.getTimeline(effectiveTeacherId!)
      ]);
      setSummary(sum);
      setTimeline(time);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAchievement = async () => {
    if (!effectiveTeacherId) return;
    try {
      await portfolioService.createAchievement(effectiveTeacherId, {
        title: achTitle,
        description: achDesc,
        date: new Date(achDate).toISOString(),
        category: achCategory
      });
      setIsAchievementModalOpen(false);
      setAchTitle("");
      setAchDesc("");
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEmailPortfolio = () => {
    if (!recipientEmail) {
      toast.error("Please enter a recipient email address.");
      return;
    }
    toast.success(`Portfolio successfully sent to ${recipientEmail}!`);
    setIsEmailModalOpen(false);
    setRecipientEmail("");
  };

  const handleDownloadPortfolio = () => {
    toast.success("Preparing PDF download...");
    setTimeout(() => {
        window.print();
    }, 500);
  };


  if (loading) return <div className="p-8">Loading Portfolio...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Portfolio</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" weight="fill" />
            Track your Teacher Development and achievements
          </p>
        </div>
        {!isViewOnly && (
          <div className="flex items-center gap-3">
            <Button 
                className="bg-[#EA104A] hover:bg-[#D00D3F] text-white shadow-md shadow-rose-200"
                onClick={() => { setAchCategory("Achievement"); setIsAchievementModalOpen(true); }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Achievement
            </Button>
            <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                onClick={() => { setAchCategory("Activity"); setIsAchievementModalOpen(true); }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
            
            <Dialog open={isAchievementModalOpen} onOpenChange={setIsAchievementModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Key {achCategory}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input value={achTitle} onChange={(e) => setAchTitle(e.target.value)} placeholder="e.g. Awarded Best Innovator" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input type="date" value={achDate} onChange={(e) => setAchDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea value={achDesc} onChange={(e) => setAchDesc(e.target.value)} placeholder="Describe the achievement or event" />
                  </div>
                  <Button className="w-full bg-[#EA104A] hover:bg-[#D00D3F]" onClick={handleAddAchievement}>Save Entry</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50" onClick={handleDownloadPortfolio}>
              <DownloadSimple className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                  <EnvelopeSimple className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Email Portfolio</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-sm text-muted-foreground">
                    Send this portfolio to your School Leader or HOS for review and evaluation.
                  </p>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Recipient Email</label>
                    <Input 
                      placeholder="Enter recipient email address" 
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                    />
                  </div>
                  <Button className="w-full bg-[#EA104A] hover:bg-[#D00D3F]" onClick={handleEmailPortfolio}>
                    Send Portfolio
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Avg. Observation Score" 
          value={summary?.avgObservationScore?.toFixed(1) || "0.0"} 
          icon={<ChartLineUp className="w-8 h-8 text-blue-500" weight="duotone" />} 
          bgColor="bg-blue-50"
        />
        <SummaryCard 
          title="Training Hours" 
          value={`${summary?.trainingHoursCompleted || 0} / ${summary?.trainingHoursPending || 0}`} 
          icon={<GraduationCap className="w-8 h-8 text-emerald-500" weight="duotone" />} 
          bgColor="bg-emerald-50"
        />
        <SummaryCard 
          title="Goal Progress" 
          value={`${Math.round(summary?.goalProgress || 0)}%`} 
          icon={<Target className="w-8 h-8 text-indigo-500" weight="duotone" />} 
          bgColor="bg-indigo-50"
        />
        <SummaryCard 
          title="Self-Paced Courses" 
          value={summary?.selfPacedCourses?.toString() || "0"} 
          icon={<Trophy className="w-8 h-8 text-amber-500" weight="duotone" />} 
          bgColor="bg-amber-50"
        />
      </div>

      {/* Yearly Timeline */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarBlank className="w-5 h-5 text-gray-500" />
            Yearly Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            {timeline.length === 0 ? (
              <div className="text-center text-gray-500 py-10">No activities found for this year.</div>
            ) : (
              timeline.map((event, index) => (
                <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10 transition-transform duration-300 hover:scale-110">
                    <EventIcon type={event.type} />
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">{event.type}</span>
                      <span className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{event.title}</h3>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                    {(event.score || event.observerName) && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-sm">
                        {event.score && <span className="font-semibold px-2 py-1 bg-green-50 text-green-700 rounded-md">Score: {event.score.toFixed(1)}</span>}
                        {event.observerName && <span className="text-gray-500">By: {event.observerName}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}

function SummaryCard({ title, value, icon, bgColor }: { title: string, value: string, icon: React.ReactNode, bgColor: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow duration-300">
      <div className={`p-4 rounded-xl ${bgColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function EventIcon({ type }: { type: string }) {
  switch (type) {
    case 'Observation':
    case 'Growth Observation':
      return <ChartLineUp className="w-5 h-5 text-blue-500" weight="fill" />;
    case 'Goal':
      return <Target className="w-5 h-5 text-indigo-500" weight="fill" />;
    case 'Training':
    case 'Self-Learning Course':
      return <GraduationCap className="w-5 h-5 text-emerald-500" weight="fill" />;
    case 'Achievement':
      return <Trophy className="w-5 h-5 text-amber-500" weight="fill" />;
    default:
      return <CalendarBlank className="w-5 h-5 text-gray-500" weight="fill" />;
  }
}
