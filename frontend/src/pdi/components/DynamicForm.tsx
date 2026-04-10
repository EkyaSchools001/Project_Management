import { useState } from "react";
import { useAutoSave } from "@pdi/hooks/useAutoSave";
import { Button } from "@pdi/components/ui/button";
import { Input } from "@pdi/components/ui/input";
import { Label } from "@pdi/components/ui/label";
import { Textarea } from "@pdi/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@pdi/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";
import { Star, Upload, FileText, CalendarIcon } from "lucide-react";
import { cn } from "@pdi/lib/utils";
import { FormField } from "@pdi/pages/admin/FormTemplatesView";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@pdi/components/ui/popover";
import { Calendar } from "@pdi/components/ui/calendar";
import { format } from "date-fns";
// react-timekeeper removed – using native <input type="time"> instead
import { Clock, Cloud } from "lucide-react";

interface DynamicFormProps {
    fields: FormField[];
    onSubmit: (data: Record<string, any>) => void;
    onCancel?: () => void;
    submitLabel?: string;
    initialData?: Record<string, any>;
    onAutoSave?: (data: Record<string, any>) => Promise<void>;
    formId?: string;
    className?: string;
}

export function DynamicForm({ fields, onSubmit, onCancel, submitLabel = "Submit", initialData = {}, onAutoSave, formId, className }: DynamicFormProps) {
    const [formData, setFormData] = useState<Record<string, any>>(initialData);

    const handleInputChange = (id: string, value: any) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const { isSaving } = useAutoSave({
        data: formData,
        onSave: async (data: any) => {
            if (onAutoSave) {
                await onAutoSave(data);
            }
        },
        enabled: Object.keys(formData).length > 0,
        localStorageKey: `pdi_dynamic_draft_${formId || 'generic'}`
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple validation
        const missing = fields.filter(f => f.required && !formData[f.id]);
        if (missing.length > 0) {
            alert(`Please fill in required fields: ${missing.map(f => f.label).join(", ")}`);
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className={cn("grid gap-6", className)}>
                {fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id} className="text-sm font-semibold">
                            {field.label} {field.required && <span className="text-destructive">*</span>}
                        </Label>

                        {field.type === "text" && (
                            <Input
                                id={field.id}
                                value={formData[field.id] || ""}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                            />
                        )}

                        {field.type === "textarea" && (
                            <Textarea
                                id={field.id}
                                value={formData[field.id] || ""}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                                className="min-h-[100px]"
                            />
                        )}

                        {field.type === "date" && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !formData[field.id] && "text-muted-foreground"
                                        )}
                                    >
                                        {formData[field.id] ? (
                                            format(new Date(formData[field.id]), "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData[field.id] ? new Date(formData[field.id]) : undefined}
                                        onSelect={(date) => handleInputChange(field.id, date?.toISOString())}
                                        disabled={(date) =>
                                            date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}

                        {field.type === "time" && (
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id={field.id}
                                    type="time"
                                    className="pl-10"
                                    value={formData[field.id] || ""}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                />
                            </div>
                        )}

                        {field.type === "select" && (
                            <Select
                                value={formData[field.id] || ""}
                                onValueChange={(val) => handleInputChange(field.id, val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options?.map((opt) => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {field.type === "radio" && (
                            <RadioGroup
                                value={formData[field.id] || ""}
                                onValueChange={(val) => handleInputChange(field.id, val)}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                {field.options?.map((opt) => (
                                    <div key={opt} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                                        <RadioGroupItem value={opt} id={`${field.id}-${opt}`} />
                                        <Label htmlFor={`${field.id}-${opt}`} className="cursor-pointer flex-1">{opt}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )}

                        {field.type === "rating" && (
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Button
                                        key={star}
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "h-10 w-10 p-0",
                                            (formData[field.id] || 0) >= star ? "text-primary" : "text-muted-foreground"
                                        )}
                                        onClick={() => handleInputChange(field.id, star)}
                                    >
                                        <Star className={cn("h-6 w-6", (formData[field.id] || 0) >= star && "fill-current")} />
                                    </Button>
                                ))}
                            </div>
                        )}

                        {field.type === "file" && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Input
                                        id={field.id}
                                        type="file"
                                        className="cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                if (file.size > 500 * 1024) {
                                                    toast.error("File size exceeds 500KB limit");
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    handleInputChange(field.id, reader.result as string);
                                                    handleInputChange(`${field.id}_name`, file.name);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </div>
                                {formData[`${field.id}_name`] && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <FileText className="w-3 h-3" />
                                        Selected: {formData[`${field.id}_name`]}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
                <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300",
                    isSaving
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                )}>
                    <Cloud className={cn("w-3.5 h-3.5", isSaving ? "animate-pulse fill-amber-600/20" : "fill-emerald-600/20")} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                        {isSaving ? "Saving changes..." : "All changes auto-saved"}
                    </span>
                </div>
                <div className="flex gap-3">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    <Button type="submit">
                        {submitLabel}
                    </Button>
                </div>
            </div>
        </form>
    );
}
