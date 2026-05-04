import React from "react";
import { 
  Buildings, 
  UsersThree, 
  Quotes, 
  IdentificationCard,
  HandsPraying,
  PencilSimple
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { settingsService } from "@/services/settingsService";

interface InstitutionalIdentityViewProps {
  canEdit: boolean;
}

export const InstitutionalIdentityView = ({ canEdit }: InstitutionalIdentityViewProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [sections, setSections] = React.useState([
    { 
      title: "Mission & Vision", 
      icon: Buildings, 
      content: "To empower every learner through innovative pedagogy...",
      route: "/educator-hub/institutional-identity/philosophy"
    },
    { 
      title: "Our Teams", 
      icon: UsersThree, 
      content: "Discover the leadership and educators behind our success...",
      route: "/educator-hub/institutional-identity/schools"
    },
    { 
      title: "Founder's Message", 
      icon: Quotes, 
      content: "A legacy of excellence built on trust and innovation...",
      route: "/educator-hub/institutional-identity/founders-message"
    },
    { 
      title: "Contact Directory", 
      icon: IdentificationCard, 
      content: "Direct lines to all campus departments...",
      route: ""
    },
    { 
      title: "School Prayer", 
      icon: HandsPraying, 
      content: "The spiritual foundation of our community...",
      route: "/educator-hub/institutional-identity/prayer"
    },
  ]);

  const iconMap: Record<string, any> = {
    "Mission & Vision": Buildings,
    "Our Teams": UsersThree,
    "Founder's Message": Quotes,
    "Contact Directory": IdentificationCard,
    "School Prayer": HandsPraying
  };

  React.useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await settingsService.getSetting("institutional_identity_sections");
        if (data && data.value) {
          // Re-attach icons based on title
          const updatedSections = data.value.map((s: any) => ({
            ...s,
            icon: iconMap[s.title] || Buildings
          }));
          setSections(updatedSections);
        }
      } catch (error) {
        console.error("Failed to fetch institutional sections:", error);
      }
    };
    fetchSections();
  }, []);

  const handleReadMore = (section: any) => {
    if (section.route) {
      navigate(section.route);
    } else if (section.link) {
      window.open(section.link, "_blank", "noopener,noreferrer");
    }
  };

  const handleSave = async (updatedSections: any[]) => {
    setIsSaving(true);
    try {
      const payload = updatedSections.map(({ icon, ...rest }) => rest);
      await settingsService.upsertSetting("institutional_identity_sections", payload);
      
      // Update local state with re-attached icons
      setSections(updatedSections.map(s => ({
        ...s,
        icon: iconMap[s.title] || Buildings
      })));
      
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Institutional Identity updated successfully!",
      });
    } catch (error) {
      console.error("Failed to update institutional sections:", error);
      toast({
        title: "Error",
        description: "Failed to update content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-montserrat text-[#1F2839]">Institutional Essence</h2>
          <p className="text-sm text-muted-foreground">The core values and identity of our schools</p>
        </div>
        {canEdit && (
          <Button className="gap-2 bg-[#E63946] hover:bg-[#D62839] text-white" onClick={() => setIsEditDialogOpen(true)}>
            <PencilSimple className="w-4 h-4" /> Edit Content
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow group border-none shadow-sm bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                  {section.icon && <section.icon className="w-5 h-5 text-[#E63946]" weight="duotone" />}
                </div>
                <CardTitle className="text-base font-montserrat text-[#1F2839]">{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed h-12 line-clamp-2">
                {section.content}
              </p>
              <Button 
                variant="link" 
                className="px-0 h-auto mt-4 text-xs font-bold text-[#E63946] hover:text-[#D62839] uppercase tracking-wider"
                onClick={() => handleReadMore(section)}
              >
                Read More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <EditDialog 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)} 
        onSave={handleSave} 
        data={sections}
        isSaving={isSaving}
      />
    </div>
  );
};

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any[]) => void;
  data: any[];
  isSaving: boolean;
}

const EditDialog = ({ isOpen, onClose, onSave, data, isSaving }: EditDialogProps) => {
  const [localData, setLocalData] = React.useState(data);

  React.useEffect(() => {
    if (isOpen) {
      setLocalData(JSON.parse(JSON.stringify(data)));
    }
  }, [isOpen, data]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...localData];
    updated[index] = { ...updated[index], [field]: value };
    setLocalData(updated);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b shrink-0">
          <DialogTitle className="text-2xl font-bold font-montserrat text-[#1F2839]">Manage Institutional Identity</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200">
          <div className="space-y-8 pb-4">
            {localData.map((section, idx) => (
              <div key={idx} className="space-y-4 p-4 border rounded-xl bg-gray-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#E63946] flex items-center justify-center text-white text-xs font-bold">
                    {idx + 1}
                  </div>
                  <h4 className="font-bold text-[#1F2839]">{section.title}</h4>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</Label>
                    <Input 
                      value={section.title} 
                      onChange={(e) => handleChange(idx, "title", e.target.value)}
                      placeholder="Section Title"
                      className="bg-white border-gray-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Content Summary</Label>
                    <Textarea 
                      value={section.content} 
                      onChange={(e) => handleChange(idx, "content", e.target.value)}
                      placeholder="Brief description..."
                      className="resize-none h-20 bg-white border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Navigation Route</Label>
                    <Input 
                      value={section.route || ""} 
                      onChange={(e) => handleChange(idx, "route", e.target.value)}
                      placeholder="/educator-hub/..."
                      className="bg-white font-mono text-xs border-gray-200"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="p-6 border-t bg-gray-50/50 shrink-0">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button 
            className="bg-[#E63946] hover:bg-[#D62839] text-white px-8" 
            onClick={() => onSave(localData)}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
