import React, { useState } from "react";
import { 
  Folder, FileText, Plus, Trash, PencilSimple,
  MagnifyingGlass, CloudArrowUp
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@pdi/components/ui/card";
import { Button } from "@pdi/components/ui/button";
import { Input } from "@pdi/components/ui/input";
import { Badge } from "@pdi/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@pdi/components/ui/dialog";
import { Label } from "@pdi/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@pdi/components/ui/alert-dialog";
import { toast } from "sonner";

interface RepositoryItem {
  id: string;
  title: string;
  type: string;
  author: string;
  status: string;
}

interface PillarItem {
  id: string;
  title: string;
}

export function AdminPedagogyLearning() {
  const [content, setContent] = useState<RepositoryItem[]>([
    { id: "1", title: "Inquiry Cycle Template", type: "Framework", author: "ELC Central", status: "Published" },
    { id: "2", title: "Grade 5 Math Toolkit", type: "Resource", author: "Admin", status: "Draft" },
    { id: "3", title: "Critical Thinking Pillars", type: "Policy", author: "ELC Central", status: "Published" },
  ]);

  const [pillars, setPillars] = useState<PillarItem[]>([
    { id: "p1", title: "Student Agency" },
    { id: "p2", title: "Metacognitive Reflection" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  // Modals visibility state
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isPillarModalOpen, setIsPillarModalOpen] = useState(false);

  // Form states
  const [activeResource, setActiveResource] = useState<Partial<RepositoryItem> | null>(null);
  const [deleteResourceId, setDeleteResourceId] = useState<string | null>(null);
  const [activePillar, setActivePillar] = useState<Partial<PillarItem> | null>(null);

  // File import ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filteredContent = content.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers for Resource
  const handleOpenNewResource = () => {
    setActiveResource({ title: "", type: "Resource", status: "Draft", author: "Admin" });
    setIsResourceModalOpen(true);
  };

  const handleOpenEditResource = (item: RepositoryItem) => {
    setActiveResource({ ...item });
    setIsResourceModalOpen(true);
  };

  const handleSaveResource = () => {
    if (!activeResource?.title) {
      toast.error("Title is required");
      return;
    }
    
    if (activeResource.id) {
      // Edit
      setContent(content.map(c => c.id === activeResource.id ? activeResource as RepositoryItem : c));
      toast.success("Resource updated successfully");
    } else {
      // Create
      const newResource = { ...activeResource, id: Date.now().toString() } as RepositoryItem;
      setContent([newResource, ...content]);
      toast.success("New resource added to repository");
    }
    setIsResourceModalOpen(false);
  };

  const handleDeleteTrigger = (id: string) => {
    setDeleteResourceId(id);
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteResource = () => {
    setContent(content.filter(c => c.id !== deleteResourceId));
    toast.success("Resource deleted permanently");
    setIsDeleteAlertOpen(false);
  };

  // Handlers for Pillars
  const handleOpenNewPillar = () => {
    setActivePillar({ title: "" });
    setIsPillarModalOpen(true);
  };

  const handleOpenEditPillar = (pillar: PillarItem) => {
    setActivePillar({ ...pillar });
    setIsPillarModalOpen(true);
  };

  const handleSavePillar = () => {
    if (!activePillar?.title) {
      toast.error("Pillar title is required");
      return;
    }

    if (activePillar.id) {
      setPillars(pillars.map(p => p.id === activePillar.id ? activePillar as PillarItem : p));
      toast.success("Instructional Pillar updated");
    } else {
      setPillars([...pillars, { ...activePillar, id: `p${Date.now()}` } as PillarItem]);
      toast.success("New Instructional Pillar added");
    }
    setIsPillarModalOpen(false);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      toast.success(`Started processing import for: ${e.target.files[0].name}`);
      // Clear for reuse
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">ELC Repository Management</h2>
          <p className="text-sm text-muted-foreground">Create and manage instructional assets for the entire network</p>
        </div>
        <div className="flex gap-2">
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          <Button variant="outline" className="gap-2" onClick={handleImport}>
            <CloudArrowUp className="w-4 h-4" /> Import
          </Button>
          <Button className="gap-2" onClick={handleOpenNewResource}>
            <Plus className="w-4 h-4" /> New Resource
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg border border-border">
        <MagnifyingGlass className="w-4 h-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Search repository..." 
          className="bg-transparent border-none focus-visible:ring-0 h-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredContent.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No repository items match your search.
              </div>
            ) : filteredContent.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/5 rounded-md">
                    <Folder className="w-5 h-5 text-primary" weight="duotone" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{item.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      {item.type} â€¢ {item.author}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={item.status === 'Published' ? 'secondary' : 'outline'}>{item.status}</Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => handleOpenEditResource(item)}>
                      <PencilSimple className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive" onClick={() => handleDeleteTrigger(item.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Instructional Pillars</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pillars.map(pillar => (
              <div key={pillar.id} className="p-3 bg-muted/30 rounded-md border border-border/50 text-xs flex justify-between items-center">
                <span>{pillar.title}</span>
                <Button variant="link" size="sm" className="h-auto p-0 text-primary" onClick={() => handleOpenEditPillar(pillar)}>Edit</Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-2 text-[10px] h-8 dashed border-dashed" onClick={handleOpenNewPillar}>
              Add New Pillar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Global Audit Log</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-3">
                <div className="text-[10px] flex justify-between">
                  <span className="text-muted-foreground underline">Admin updated Grade 10 Math</span>
                  <span>2h ago</span>
                </div>
                <div className="text-[10px] flex justify-between">
                  <span className="text-muted-foreground underline">ELC Central published Inquiry Pilla</span>
                  <span>5h ago</span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* --- MODALS --- */}

      {/* Resource Modal */}
      <Dialog open={isResourceModalOpen} onOpenChange={setIsResourceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeResource?.id ? "Edit Resource" : "New Resource"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
             <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={activeResource?.title || ""} 
                  onChange={(e) => setActiveResource(prev => ({...prev, title: e.target.value}))} 
                  placeholder="e.g., Grade 9 Science Framework" 
                />
             </div>
             <div className="space-y-2">
                <Label>Author</Label>
                <Input 
                  value={activeResource?.author || ""} 
                  onChange={(e) => setActiveResource(prev => ({...prev, author: e.target.value}))} 
                />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Asset Type</Label>
                  <Select value={activeResource?.type || "Resource"} onValueChange={(val) => setActiveResource(prev => ({...prev, type: val}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Resource">Resource</SelectItem>
                      <SelectItem value="Framework">Framework</SelectItem>
                      <SelectItem value="Policy">Policy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={activeResource?.status || "Draft"} onValueChange={(val) => setActiveResource(prev => ({...prev, status: val}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
             </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsResourceModalOpen(false)}>Cancel</Button>
             <Button onClick={handleSaveResource}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pillar Modal */}
      <Dialog open={isPillarModalOpen} onOpenChange={setIsPillarModalOpen}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{activePillar?.id ? "Edit Pillar" : "New Pillar"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
             <div className="space-y-2">
                <Label>Pillar Name</Label>
                <Input 
                  value={activePillar?.title || ""} 
                  onChange={(e) => setActivePillar(prev => ({...prev, title: e.target.value}))} 
                  placeholder="e.g., Critical Thinking" 
                />
             </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsPillarModalOpen(false)}>Cancel</Button>
             <Button onClick={handleSavePillar}>Save Pillar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the resource from the network repository.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteResource} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
