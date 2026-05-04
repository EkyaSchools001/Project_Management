import { useState } from "react";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Upload, CheckCircle2, User, BookOpen, Link as LinkIcon, Star, MessageSquare, Brain, FileText, Paperclip, Cloud } from "lucide-react";
import { format } from "date-fns";
import { moocService } from "@/services/moocService";
import { templateService } from "@/services/templateService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useFormFlow } from "@/hooks/useFormFlow";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { CAMPUS_OPTIONS } from "@/lib/constants";

const DEFAULT_CAMPUSES = CAMPUS_OPTIONS;

const DEFAULT_PLATFORMS = [
    "Coursera", "FutureLearn", "Khan Academy", "edX", "Alison", "Class Central", "Schoology", "Other"
];

const formSchema = z.object({
    // User Details (Keep for backend parity)
    email: z.string().email("Invalid email address"),
    name: z.string().min(2, "Name is required"),
    campus: z.string().min(1, "Please select a campus"),

    // Course Details (Mapped from HTML)
    courseName: z.string().min(3, "Course name is required"),
    platform: z.string().min(1, "Please select a platform"),
    otherPlatform: z.string().optional(),
    endDate: z.date({
        required_error: "Completion date is required",
    }),
    hours: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Please enter a valid number of hours",
    }),
    track: z.string().min(1, "Please select a track"),
    proofLink: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    keyTakeaways: z.string().min(10, "Please share your reflection (min 10 characters)"),
}).superRefine((data, ctx) => {
    if (data.platform === "Other" && !data.otherPlatform) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify the platform",
            path: ["otherPlatform"],
        });
    }
});

interface MoocEvidenceFormProps {
    onCancel: () => void;
    onSubmitSuccess: () => void;
    onAutoSave?: (values: any) => Promise<void>;
    userEmail?: string;
    userName?: string;
    initialData?: any;
}

export function MoocEvidenceForm({ onCancel, onSubmitSuccess, onAutoSave, userEmail = "", userName = "", initialData }: MoocEvidenceFormProps) {
    const [campuses, setCampuses] = useState(DEFAULT_CAMPUSES);
    const [platforms, setPlatforms] = useState(DEFAULT_PLATFORMS);
    const { user } = useAuth();
    const { getRedirectionPath } = useFormFlow();
    const navigate = useNavigate();

    useEffect(() => {
        const loadTemplate = async () => {
            try {
                const templates = await templateService.getAllTemplates('MOOC');
                const defaultTemplate = templates.find(t => t.isDefault) || templates[0];
                if (defaultTemplate && defaultTemplate.structure) {
                    const campusField = defaultTemplate.structure.find((f: any) => f.id === 'campus');
                    const platformField = defaultTemplate.structure.find((f: any) => f.id === 'platform');
                    if (campusField?.options) setCampuses(campusField.options);
                    if (platformField?.options) setPlatforms(platformField.options);
                }
            } catch (error) {
                console.error("Failed to load MOOC template", error);
            }
        };
        loadTemplate();
    }, []);

    const form = useForm<any>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            email: initialData.email || userEmail,
            name: initialData.name || userName,
            courseName: initialData.courseName || "",
            platform: initialData.platform || "FutureLearn",
            otherPlatform: initialData.otherPlatform || "",
            endDate: initialData.endDate ? new Date(initialData.endDate) : new Date(),
            hours: initialData.hours !== undefined && initialData.hours !== null ? String(initialData.hours) : "",
            track: initialData.track || "",
            proofLink: initialData.proofLink || "",
            keyTakeaways: initialData.keyTakeaways || "",
            campus: initialData.campus || initialData.user?.campusId || "",
        } : {
            email: userEmail,
            name: userName,
            courseName: "",
            platform: "FutureLearn",
            otherPlatform: "",
            endDate: new Date(),
            hours: "",
            track: "",
            proofLink: "",
            keyTakeaways: "",
            campus: user?.campusId || "",
        },
    });

    const formValues = form.watch();

    const { isSaving } = useAutoSave({
        data: formValues,
        onSave: async (data: any) => {
            if (onAutoSave) {
                await onAutoSave(data);
            }
        },
        enabled: !!formValues.email && !!formValues.courseName,
        localStorageKey: `pdi_mooc_draft_${formValues.email || 'new'}`
    });

    const selectedPlatform = form.watch("platform");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: "supportingDocFile" | "certificateFile", fileNameField: "supportingDocFileName" | "certificateFileName") => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 500 * 1024) { // 500KB limit
                toast.error("File size exceeds 500KB limit");
                e.target.value = ""; // Reset input
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                form.setValue(fieldName, base64String);
                form.setValue(fileNameField, file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        try {
            await moocService.submitEvidence({
                ...values,
                endDate: values.endDate.toISOString(),
                startDate: values.endDate.toISOString(), // Set same as end date for legacy compatibility
                hasCertificate: values.proofLink ? 'yes' : 'no',
                effectivenessRating: 5 // Default for legacy
            });

            toast.success("MOOC Evidence Submitted Successfully!", {
                description: "Your Teacher Development record has been updated.",
            });

            if (user?.role) {
                const redirectPath = getRedirectionPath('MOOC', user.role);
                if (redirectPath) {
                    navigate(redirectPath);
                    return;
                }
            }

            onSubmitSuccess();
        } catch (error) {
            console.error("Failed to submit MOOC evidence", error);
            toast.error("Failed to submit evidence. Please try again.");
        }
    }

    function onInvalid(errors: any) {
        console.log("Form errors:", errors);
        toast.error("Please fill in all required fields correctly.");
    }

    return (
        <Card className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-red-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500/20" />
            
            <CardHeader className="bg-red-50/50 p-8 md:p-10 border-b border-red-100">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-red-500 tracking-[0.3em] uppercase">Teacher Development</h2>
                        <CardTitle className="text-3xl font-bold text-slate-800 tracking-tight uppercase">
                            Submit MOOC Evidence
                        </CardTitle>
                    </div>
                </div>
                <CardDescription className="text-lg text-slate-600 font-medium leading-relaxed">
                    Attach your certificate and complete the reflection. Your reporting manager will review and approve.
                    
                    <div className="mt-6 p-5 bg-red-50/80 border border-red-100 rounded-3xl text-red-700 text-sm flex items-start gap-4">
                        <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-none text-red-600">
                            <span className="text-lg font-bold">!</span>
                        </div>
                        <div className="pt-1">
                            <strong className="text-red-900 block mb-0.5">Submission Deadline: 30 September 2025</strong>
                            <p className="opacity-80 font-medium">Minimum 1 MOOC per term is required for all staff members.</p>
                        </div>
                    </div>
                </CardDescription>
            </CardHeader>

            <CardContent className="p-8 md:p-12 space-y-10">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit, onInvalid)} className="space-y-8">
                        
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="courseName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-black text-slate-500 tracking-widest uppercase">Course Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="e.g. The Scientific Method" 
                                                {...field} 
                                                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-red-500/20 focus:border-red-500 transition-all" 
                                            />
                                        </FormControl>
                                        <FormMessage className="font-bold text-rose-500" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid md:grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="platform"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-black text-slate-500 tracking-widest uppercase">Platform</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-red-500/20 focus:border-red-500">
                                                        <SelectValue placeholder="Select platform" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl border-slate-100">
                                                    <SelectItem value="FutureLearn">FutureLearn</SelectItem>
                                                    <SelectItem value="Coursera">Coursera</SelectItem>
                                                    <SelectItem value="Alison">Alison</SelectItem>
                                                    <SelectItem value="edX">edX</SelectItem>
                                                    <SelectItem value="Schoology">Schoology</SelectItem>
                                                    <SelectItem value="Khan Academy">Khan Academy</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="font-bold text-rose-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="text-sm font-black text-slate-500 tracking-widest uppercase mb-2">Completion Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full h-14 pl-4 text-left font-medium rounded-2xl border-slate-100 bg-slate-50/50",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-5 w-5 text-slate-400" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-slate-100" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage className="font-bold text-rose-500" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="hours"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-black text-slate-500 tracking-widest uppercase">Duration (hours)</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="e.g. 8" 
                                                    {...field} 
                                                    className="h-14 rounded-2xl border-slate-100 bg-slate-50/50" 
                                                />
                                            </FormControl>
                                            <FormMessage className="font-bold text-rose-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="track"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-black text-slate-500 tracking-widest uppercase">Your Track</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-red-500/20 focus:border-red-500">
                                                        <SelectValue placeholder="Select your track" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl border-slate-100 max-h-[300px]">
                                                    <SelectItem value="Mandatory – Beginner">Mandatory – Beginner</SelectItem>
                                                    <SelectItem value="Mandatory – Advanced">Mandatory – Advanced</SelectItem>
                                                    <SelectItem value="Early Years">Early Years</SelectItem>
                                                    <SelectItem value="Primary School">Primary School</SelectItem>
                                                    <SelectItem value="Middle School">Middle School</SelectItem>
                                                    <SelectItem value="Senior School">Senior School</SelectItem>
                                                    <SelectItem value="All Teachers">All Teachers</SelectItem>
                                                    <SelectItem value="Visual Arts">Visual Arts</SelectItem>
                                                    <SelectItem value="Performing Arts">Performing Arts</SelectItem>
                                                    <SelectItem value="Physical Education">Physical Education</SelectItem>
                                                    <SelectItem value="CCG Counselors">CCG Counselors</SelectItem>
                                                    <SelectItem value="Student Counselors">Student Counselors</SelectItem>
                                                    <SelectItem value="School Leadership">School Leadership</SelectItem>
                                                    <SelectItem value="HO Teams">HO Teams</SelectItem>
                                                    <SelectItem value="General">General</SelectItem>
                                                    <SelectItem value="Admissions Counselors">Admissions Counselors</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="font-bold text-rose-500" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="proofLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-black text-slate-500 tracking-widest uppercase">Certificate / Evidence URL</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <Input 
                                                    placeholder="Paste your certificate link here..." 
                                                    {...field} 
                                                    className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50" 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="font-bold text-rose-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="keyTakeaways"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-black text-slate-500 tracking-widest uppercase">Reflection — What did you learn? How will you apply it?</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Share your key takeaways and classroom applications..." 
                                                className="min-h-[160px] rounded-3xl border-slate-100 bg-slate-50/50 p-6 resize-none focus:bg-white focus:ring-red-500/20 focus:border-red-500 transition-all"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage className="font-bold text-rose-500" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="pt-8 flex flex-col md:flex-row gap-4 items-center border-t border-slate-100">
                            <Button
                                type="submit"
                                className="w-full md:w-auto h-14 px-12 rounded-[1.25rem] bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-xl shadow-red-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                Submit Evidence
                            </Button>
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={onCancel}
                                className="w-full md:w-auto h-14 px-8 rounded-[1.25rem] text-slate-400 hover:text-slate-600 hover:bg-slate-100 font-bold"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
