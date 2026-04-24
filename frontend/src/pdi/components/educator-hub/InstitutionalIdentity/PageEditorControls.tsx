import React from "react";
import { Button } from "@pdi/components/ui/button";
import { PencilSimple, Image as ImageIcon, UploadSimple, X, Plus, Trash } from "@phosphor-icons/react";
import { useAuth } from "@pdi/hooks/useAuth";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@pdi/components/ui/dialog";
import { Input } from "@pdi/components/ui/input";
import { Textarea } from "@pdi/components/ui/textarea";
import { Label } from "@pdi/components/ui/label";
import { useToast } from "@pdi/hooks/use-toast";
import { settingsService } from "@pdi/services/settingsService";
import { uploadService } from "@pdi/services/uploadService";

interface Field {
  key: string;
  label: string;
  type: "input" | "textarea" | "list" | "image" | "section";
  placeholder?: string;
  itemFields?: Field[]; // For list type
}

interface PageEditorControlsProps {
  settingKey: string;
  initialData: any;
  onSave?: (newData: any) => void;
  title: string;
  fields: Field[];
  isOpenExternal?: boolean;
  onOpenChangeExternal?: (open: boolean) => void;
  hideFloatingButton?: boolean;
}

export const PageEditorControls = ({ 
  settingKey, 
  initialData, 
  onSave, 
  title,
  fields,
  isOpenExternal,
  onOpenChangeExternal,
  hideFloatingButton
}: PageEditorControlsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formData, setFormData] = React.useState(initialData);
  const [uploadingField, setUploadingField] = React.useState<string | null>(null);

  const isOpen = isOpenExternal !== undefined ? isOpenExternal : internalOpen;
  const setIsOpen = onOpenChangeExternal || setInternalOpen;

  const canEdit = () => {
    const raw = user?.role?.toUpperCase() || "";
    return raw !== "";
  };

  React.useEffect(() => {
    if (isOpen) {
      setFormData(JSON.parse(JSON.stringify(initialData)));
    }
  }, [isOpen, initialData]);

  const updateField = (path: string, value: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev };
      const parts = path.split(".");
      let current = newData;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        // If it's an array and we are accessing by index
        if (Array.isArray(current[parts[i]])) {
          current[parts[i]] = [...current[parts[i]]];
        } else {
          current[parts[i]] = { ...current[parts[i]] };
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return newData;
    });
  };

  const getFieldValue = (path: string, data: any = formData) => {
    return path.split(".").reduce((obj, key) => obj?.[key], data) || "";
  };

  const handleImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(key);
    try {
      const result = await uploadService.uploadFile(file);
      if (result.status === "success") {
        updateField(key, result.data.fileUrl);
        toast({
          title: "Image Uploaded",
          description: "Your image has been uploaded successfully.",
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingField(null);
    }
  };

  const addListItem = (path: string, template: any) => {
    const currentList = getFieldValue(path);
    const listToUpdate = Array.isArray(currentList) ? [...currentList] : [];
    updateField(path, [...listToUpdate, template]);
  };

  const removeListItem = (path: string, index: number) => {
    const currentList = getFieldValue(path);
    if (Array.isArray(currentList)) {
      const newList = [...currentList];
      newList.splice(index, 1);
      updateField(path, newList);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await settingsService.upsertSetting(settingKey, formData);
      if (onSave) onSave(formData);
      setIsOpen(false);
      toast({
        title: "Success",
        description: `${title} updated successfully!`,
      });
    } catch (error) {
      console.error(`Failed to update ${settingKey}:`, error);
      toast({
        title: "Error",
        description: "Failed to save changes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (field: Field, basePath: string = "") => {
    const fullPath = basePath ? `${basePath}.${field.key}` : field.key;
    const value = getFieldValue(fullPath);

    return (
      <div key={fullPath} className="space-y-2">
        {field.type !== "section" && field.type !== "list" && (
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            {field.label}
          </Label>
        )}

        {field.type === "section" ? (
          <div className="pt-8 pb-2 border-b-2 border-[#E63946]/10 mb-4">
            <h3 className="text-sm font-black text-[#E63946] tracking-[0.2em] uppercase flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#E63946] rounded-full"></span>
              {field.label}
            </h3>
          </div>
        ) : field.type === "input" ? (
          <Input 
            value={value} 
            onChange={(e) => updateField(fullPath, e.target.value)}
            placeholder={field.placeholder}
            className="bg-white border-gray-200 h-10 shadow-sm focus:ring-1 focus:ring-[#E63946]/20 transition-all"
          />
        ) : field.type === "textarea" ? (
          <Textarea 
            value={value} 
            onChange={(e) => updateField(fullPath, e.target.value)}
            placeholder={field.placeholder}
            className="h-32 bg-white border-gray-200 resize-none shadow-sm focus:ring-1 focus:ring-[#E63946]/20 transition-all"
          />
        ) : field.type === "image" ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="w-32 h-32 rounded-xl bg-white border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group shrink-0 shadow-sm transition-all hover:border-[#E63946]/30">
                {value ? (
                  <>
                    <img 
                      src={value.startsWith('http') ? value : `${window.location.protocol}//${window.location.host}${value}`} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                    <button 
                      onClick={() => updateField(fullPath, "")}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <ImageIcon size={40} className="text-gray-300" weight="duotone" />
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Direct URL</Label>
                  <Input 
                    value={value} 
                    onChange={(e) => updateField(fullPath, e.target.value)}
                    placeholder="Image URL"
                    className="bg-white h-8 text-xs border-primary/20"
                  />
                </div>
                <div className="relative">
                  <input 
                    type="file" 
                    id={`file-${fullPath}`}
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(fullPath, e)}
                    disabled={uploadingField === fullPath}
                  />
                  <Label 
                    htmlFor={`file-${fullPath}`}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all text-[11px] font-black uppercase tracking-wider border-2 border-dashed ${uploadingField === fullPath ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white hover:bg-white/80 hover:border-[#E63946]/30 border-gray-200 shadow-sm active:scale-95'}`}
                  >
                    <UploadSimple size={16} className={uploadingField === fullPath ? "animate-bounce" : ""} />
                    {uploadingField === fullPath ? "Uploading..." : "Upload from Computer"}
                  </Label>
                </div>
              </div>
            </div>
          </div>
        ) : field.type === "list" && field.itemFields ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between pt-4 pb-2 border-b border-primary/20">
              <Label className="text-xs font-black uppercase tracking-[0.15em] text-slate-800">
                {field.label}
              </Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => addListItem(fullPath, { id: Date.now().toString() })} 
                className="h-8 gap-2 border-dashed border-[#E63946]/30 text-[#E63946] hover:bg-[#E63946]/5 rounded-full px-4"
              >
                <Plus size={14} weight="bold" />
                Add New {field.label.replace('Profiles', '').replace('Profile', '').replace('Photos', '').replace('Photo', '').trim()}
              </Button>
            </div>
            
            <div className="space-y-4">
              {(Array.isArray(value) ? value : []).map((item, index) => (
                <div key={index} className="relative p-6 border rounded-2xl bg-white shadow-sm group hover:shadow-md transition-all">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeListItem(fullPath, index)}
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white border shadow-sm text-red-500 hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <Trash size={14} weight="bold" />
                  </Button>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {field.itemFields?.map(itemField => renderField(itemField, `${fullPath}.${index}`))}
                  </div>
                </div>
              ))}
              
              {(Array.isArray(value) ? value : []).length === 0 && (
                <div className="py-12 text-center border-2 border-dashed rounded-2xl bg-gray-50/50 border-primary/20">
                  <p className="text-sm text-muted-foreground font-medium italic">No items added yet. Click the button above to start.</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  if (!canEdit()) return null;

  return (
    <>
      {!hideFloatingButton && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 shadow-2xl bg-white hover:bg-gray-50 text-[#E63946] border-[#E63946] gap-2 rounded-full px-6 py-6 h-auto z-[9999] group transition-all hover:scale-105"
        >
          <PencilSimple size={20} weight="bold" className="group-hover:rotate-12 transition-transform" />
          <span className="font-bold uppercase tracking-wider text-xs">Edit Page Content</span>
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] flex flex-col p-0 overflow-hidden rounded-3xl border-none shadow-2xl ring-1 ring-black/5">
          <DialogHeader className="p-8 border-b bg-white shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E63946]/5 rounded-bl-full -mr-16 -mt-16"></div>
            <DialogTitle className="text-3xl font-black font-montserrat flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 rounded-xl bg-[#E63946]/10 flex items-center justify-center">
                <PencilSimple size={24} className="text-[#E63946]" weight="bold" />
              </div>
              Edit {title}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6 space-y-8 bg-slate-50/30">
            {fields.map(field => renderField(field))}
          </div>

          <DialogFooter className="p-8 border-t bg-white shrink-0 flex items-center justify-between">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none hidden sm:block">
              All changes are immediate after saving
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isSaving} className="rounded-xl px-6 font-bold text-muted-foreground">Cancel</Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-[#E63946] hover:bg-[#D62839] text-white px-10 h-12 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-[#E63946]/20 transition-all active:scale-95"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
