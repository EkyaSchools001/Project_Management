// @ts-nocheck
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, CheckCircle2, AlertCircle, Cloud } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";
import { templateService } from "@pdi/services/templateService";

import { Button } from "@pdi/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@pdi/components/ui/form";
import { Input } from "@pdi/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@pdi/components/ui/select";
import { Textarea } from "@pdi/components/ui/textarea";
import { Label } from "@pdi/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@pdi/components/ui/radio-group";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@pdi/components/ui/popover";
import { Calendar } from "@pdi/components/ui/calendar";
import { cn } from "@pdi/lib/utils";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import { Separator } from "@pdi/components/ui/separator";
import { CAMPUS_OPTIONS } from "@pdi/lib/constants";
import { useAutoSave } from "@pdi/hooks/useAutoSave";

const DEFAULT_CAMPUSES = CAMPUS_OPTIONS;

const CORE_PILLARS = [
    "Live the Lesson", "Authentic Assessments", "Instruct to Inspire", "Care about Culture", "Engaging Environment", "Professional Practice",
];

const NON_CORE_PILLARS = [
    "Pillar 1: Curriculum", "Pillar 2: Culture", "Pillar 3: Instruction", "Pillar 4: Assessment", "Pillar 5: Environment", "Pillar 6: Professional Practice",
];

const DEFAULT_PILLARS = CORE_PILLARS;

const formSchema = z.object({
    educatorName: z.string().min(1, "Educator name is required"),
    coachName: z.string().min(1, "Coach name is required"),
    campus: z.string().min(1, "Please select a campus"),
    dateOfGoalSetting: z.date({
        required_error: "Date is required",
    }).refine((date) => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return date <= today;
    }, "Date cannot be in the future"),

    // Readiness
    awareOfProcess: z.enum(["yes", "no"], {
        required_error: "This question is mandatory",
    }),
    awareOfFramework: z.enum(["yes", "no"], {
        required_error: "This question is mandatory",
    }),
    reflectionCompleted: z.enum(["yes", "no"], {
        required_error: "This question is mandatory",
    }),
    evidenceProvided: z.enum(["yes", "no"], {
        required_error: "This question is mandatory",
    }),

    // Goal Setting
    goalForYear: z.string().min(10, "Please provide a detailed goal"),
    reasonForGoal: z.string().min(10, "Please explain the reason for this goal"),
    actionStep: z.string().min(10, "Please provide the first action step"),
    goalEndDate: z.date({
        required_error: "Target end date is required",
    }).refine((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    }, "End date must be in the future"),
    pillarTag: z.string().min(1, "Please select a pillar"),
    additionalNotes: z.string().optional(),
    teacherEmail: z.string().email("Invalid email address").optional(),
    academicType: z.enum(["CORE", "NON_CORE"]).default("CORE"),
});

interface GoalSettingFormProps {
    onSubmit: (data: z.infer<typeof formSchema>) => void;
    onAutoSave?: (data: z.infer<typeof formSchema>) => Promise<void>;
    defaultCoachName?: string;
    onCancel: () => void;
    teachers: { id: string; name: string; email?: string; academics?: "CORE" | "NON_CORE" | string }[];
    initialData?: Partial<z.infer<typeof formSchema>>;
    userCampus?: string;
    isLeader?: boolean;
}

export function GoalSettingForm({
    onSubmit,
    onAutoSave,
    defaultCoachName = "",
    onCancel,
    teachers,
    initialData = {},
    userCampus,
    isLeader = false
}: GoalSettingFormProps) {
    const [campuses, setCampuses] = useState(() => {
        if (isLeader && userCampus) {
            // Find the full campus name if userCampus is a code, or just use it
            return CAMPUS_OPTIONS.filter(c => c === userCampus || (userCampus === 'EJPN' && c === 'EJPN') || (userCampus === 'ENICE' && c === 'ENICE'));
        }
        return DEFAULT_CAMPUSES;
    });
    const [pillars, setPillars] = useState(DEFAULT_PILLARS);

    useEffect(() => {
        const loadTemplate = async () => {
            try {
                const templates = await templateService.getAllTemplates('GOAL');
                const defaultTemplate = templates.find((t: any) => t.isDefault) || templates[0];
                if (defaultTemplate && defaultTemplate.structure) {
                    const campusField = defaultTemplate.structure.find((f: any) => f.id === 'campus');
                    const pillarField = defaultTemplate.structure.find((f: any) => f.id === 'pillarTag');

                    if (campusField?.options) {
                        let finalCampuses = campusField.options;
                        if (isLeader && userCampus) {
                            finalCampuses = finalCampuses.filter((c: string) => c === userCampus);
                            // If userCampus not in options, fallback to userCampus
                            if (finalCampuses.length === 0) finalCampuses = [userCampus];
                        }
                        setCampuses(finalCampuses);
                    }
                    if (pillarField?.options) setPillars(pillarField.options);
                }
            } catch (error) {
                console.error("Failed to load GOAL template", error);
            }
        };
        loadTemplate();
    }, [isLeader, userCampus]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            coachName: defaultCoachName,
            educatorName: "",
            teacherEmail: "",
            additionalNotes: "",
            academicType: "CORE",
            ...initialData,
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
        enabled: !!formValues.educatorName,
        localStorageKey: `pdi_goal_draft_${formValues.teacherEmail || 'new'}`
    });

    function handleSubmit(values: z.infer<typeof formSchema>) {
        onSubmit(values);
        // form.reset(); // Don't reset if we want to show success state or redirect
    }

    return (
        <Card className="max-w-4xl mx-auto   shadow-none">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">AY 25–26 Goal Setting Form – Master</CardTitle>
                <CardDescription className="text-base text-muted-foreground mt-2">
                    Please use the following form to set goals for educators.
                    The goal setting window is from 12 May 2025 – 28 June 2025.
                    Prior to goal setting, educators should have completed their self-reflection.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">

                        {/* Section 1: Context */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">1</span>
                                <h3 className="text-lg font-semibold text-foreground">Educator & Context Details</h3>
                            </div>
                            <Separator />

                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="educatorName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name of the Educator *</FormLabel>
                                            <Select
                                                onValueChange={(value: string) => {
                                                    field.onChange(value);
                                                    const selectedTeacher = teachers.find((t: any) => t.name === value);
                                                    if (selectedTeacher?.email) {
                                                        form.setValue("teacherEmail", selectedTeacher.email);
                                                    }
                                                    if (selectedTeacher?.academics) {
                                                        form.setValue("academicType", selectedTeacher.academics as any);
                                                        setPillars(selectedTeacher.academics === "NON_CORE" ? NON_CORE_PILLARS : CORE_PILLARS);
                                                    }
                                                }}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select educator" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {teachers.map((t) => (
                                                        <SelectItem key={t.id || t.name} value={t.name}>
                                                            {t.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="academicType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Academic Type *</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={(val) => {
                                                        field.onChange(val);
                                                        if (val === "NON_CORE") {
                                                            setPillars(NON_CORE_PILLARS);
                                                        } else {
                                                            setPillars(CORE_PILLARS);
                                                        }
                                                    }}
                                                    value={field.value}
                                                    className="flex gap-4"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="CORE" id="r1" />
                                                        <Label htmlFor="r1">CORE</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="NON_CORE" id="r2" />
                                                        <Label htmlFor="r2">NON-CORE</Label>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="teacherEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Teacher Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Teacher email" {...field} readOnly className="bg-muted" />
                                            </FormControl>
                                            <FormDescription>Auto-populated based on selection</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="coachName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name of the Coach *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter coach name" {...field} />
                                            </FormControl>
                                            <FormDescription>Who did the Goal Setting?</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="campus"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Campus *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select campus" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {campuses.map((campus: string) => (
                                                        <SelectItem key={campus} value={campus}>
                                                            {campus}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dateOfGoalSetting"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date of Goal Setting Conversation *</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date: Date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="goalEndDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Goal Target End Date *</FormLabel>
                                            <FormDescription>By when should this goal be achieved?</FormDescription>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a target date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date: Date) =>
                                                            date < new Date()
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Section 2: Readiness */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">2</span>
                                <h3 className="text-lg font-semibold text-foreground">Readiness on Goal Setting Process</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">Please rate the readiness for the goal setting process below.</p>
                            <Separator />

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="awareOfProcess"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3 bg-muted/30 p-4 rounded-lg">
                                            <FormLabel>Was the teacher informed and aware of the goal setting process? *</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex gap-4"
                                                >
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="yes" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Yes</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="no" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">No</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="awareOfFramework"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3 bg-muted/30 p-4 rounded-lg">
                                            <FormLabel>Was the teacher informed and aware about the Ekya Danielson Framework? *</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex gap-4"
                                                >
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="yes" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Yes</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="no" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">No</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="reflectionCompleted"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3 bg-muted/30 p-4 rounded-lg">
                                            <FormLabel>Did the teacher complete her self-reflection on Ekya Danielson Form? *</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex gap-4"
                                                >
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="yes" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Yes</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="no" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">No</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="evidenceProvided"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3 bg-muted/30 p-4 rounded-lg">
                                            <FormLabel>Did the teacher provide evidence for her rating and reflection? *</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex gap-4"
                                                >
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="yes" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Yes</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="no" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">No</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Section 3: Goal Process */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">3</span>
                                <h3 className="text-lg font-semibold text-foreground">Goal Setting Process</h3>
                            </div>
                            <Separator />

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="goalForYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Goal for the Academic Year *</FormLabel>
                                            <FormDescription>Define the primary focus for AY 25–26</FormDescription>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter the primary goal..."
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="reasonForGoal"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reason for the Goal *</FormLabel>
                                            <FormDescription>Why is this goal the most important goal for the teacher?</FormDescription>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Explain your reasoning..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="actionStep"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Action Step *</FormLabel>
                                            <FormDescription>What is the first action step for the teacher towards the goal?</FormDescription>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Define the first action step..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={form.control}
                                    name="pillarTag"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pillar Tag *</FormLabel>
                                            <FormDescription>This goal can be categorised under which pillar?</FormDescription>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a pillar" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {pillars.map((pillar: string) => (
                                                        <SelectItem key={pillar} value={pillar}>
                                                            {pillar}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="additionalNotes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Anything else you'd like to share (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Additional notes..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between sticky bottom-6 bg-background/95 backdrop-blur-sm p-4 border rounded-xl shadow-lg">
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
                            <div className="flex gap-4">
                                <Button type="button" variant="outline" onClick={onCancel}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="min-w-[150px]"
                                    onClick={() => {
                                        if (!form.formState.isValid) {
                                            const errors = form.formState.errors;
                                            const errorCount = Object.keys(errors).length;
                                            if (errorCount > 0) {
                                                toast.error(`Please fix the ${errorCount} errors in the form before submitting.`);
                                                console.log("Form errors:", errors);
                                            }
                                        }
                                    }}
                                >
                                    Submit Goal
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
