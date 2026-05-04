import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Users, BookOpen, Target, Settings, MessageSquare, Tag,
    ChevronLeft, ChevronRight, Save, Eye, CheckCircle2,
    AlertCircle, Sparkles, ClipboardCheck, Layout, Star,
    Check, ChevronsUpDown, Search, Cloud, PenTool, TrendingUp
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

import { cn } from "@/lib/utils";
import { Observation, DanielsonRatingScale, DanielsonDomain } from "@/types/observation";
import { toast } from "sonner";
import { templateService } from "@/services/templateService";
import { CAMPUS_OPTIONS } from "@/lib/constants";
import api from "@/lib/api";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useAIContext } from "@/contexts/AIContext";
import { useAuth } from "@/hooks/useAuth";
import { ObservationReport } from "@/components/growth/ObservationReport";

interface UnifiedObservationFormProps {
    onSubmit: (observation: Partial<Observation>) => void;
    onAutoSave?: (observation: Partial<Observation>) => Promise<void>;
    onCancel: () => void;
    initialData?: Partial<Observation>;
    teachers?: { id: string; name: string; role?: string; email?: string; academics?: string; campus?: string; department?: string }[];
    readOnly?: boolean;
    cluster?: string;
}

const RATING_SCALE: DanielsonRatingScale[] = ["Basic", "Developing", "Effective", "Highly Effective", "Not Observed"];

const DOMAINS: { 
    id: string; 
    title: string; 
    subtitle: string; 
    cluster: string;
    subDomains: {
        id: string;
        title: string;
        parameters: {
            name: string;
            description: string;
            lookFors: string;
        }[];
    }[];
}[] = [
    {
        id: "C1",
        cluster: "1",
        title: "Cluster:1 - Planning & Preparation",
        subtitle: "Planning & Preparation",
        subDomains: [
            {
                id: "1a",
                title: "1a - Applying Knowledge of Content and Pedagogy",
                parameters: [
                    {
                        name: "Content Knowledge",
                        description: "Demonstrates strong content knowledge",
                        lookFors: "Content presented is accurate; Connections to real-world contexts are included; Links to other disciplines are visible."
                    },
                    {
                        name: "Relevant Usage of Tools",
                        description: "Appropriate tools are selected to support teaching and learning",
                        lookFors: "Reference to use of tools in the plan: Culture tools to build classroom culture; Instructional tools to engage students in learning."
                    },
                    {
                        name: "Purposeful Questioning",
                        description: "Questioning is planned to support student thinking and engagement",
                        lookFors: "Questions: Include recall and understanding checks; Facilitate student to connect ideas, generate new ideas and spark thinking."
                    }
                ]
            },
            {
                id: "1b",
                title: "1b - Knowing and Valuing Students",
                parameters: [
                    {
                        name: "Differentiated Plan",
                        description: "Planning accounts for diverse student needs and readiness levels",
                        lookFors: "Support or scaffolds are planned for learners who need them; Extensions are planned for advanced learners."
                    }
                ]
            },
            {
                id: "1c",
                title: "1c - Setting Instructional Outcomes",
                parameters: [
                    {
                        name: "Well-Defined Learning Outcomes",
                        description: "Learning outcomes are clearly defined and promote meaningful student learning",
                        lookFors: "Outcomes: Require higher-order thinking or application; Include elements of collaboration, care, or connection [SEL]; Require student communication (oral/written/visual)."
                    },
                    {
                        name: "Alignment of Tasks to Outcomes",
                        description: "Planned tasks are aligned to the stated learning outcomes",
                        lookFors: "Tasks: Are aligned to the learning outcomes; Reflect appropriate level of intellectual challenge; Matches for the grade level."
                    }
                ]
            },
            {
                id: "1d",
                title: "1d - Using Resources Effectively",
                parameters: [
                    {
                        name: "Purposeful Use of Resources",
                        description: "Resources are selected to support learning and student engagement",
                        lookFors: "Resources (PPTs, maps, manipulatives, texts): Support thinking and understanding; Promote student independence or ownership."
                    }
                ]
            },
            {
                id: "1e",
                title: "1e - Planning Coherent Instruction",
                parameters: [
                    {
                        name: "Clear Lesson Flow",
                        description: "Plans lessons with clear and coherent flow",
                        lookFors: "Timing for activities is realistic; Activities progress logically."
                    },
                    {
                        name: "Instructions and Task Design",
                        description: "Instructions and tasks are designed to support student learning",
                        lookFors: "Tasks facilitate application, analysis, evaluation and other higher-order skills; Differentiation is built into tasks."
                    }
                ]
            }
        ]
    },
    {
        id: "C2",
        cluster: "2",
        title: "Cluster:2 - Classroom Environment",
        subtitle: "Classroom Environment",
        subDomains: [
            {
                id: "2a",
                title: "2a - Creating an Environment of Respect and Rapport",
                parameters: [
                    {
                        name: "Teacher Interaction with Students",
                        description: "Interactions are friendly and demonstrate general caring and respect",
                        lookFors: "Teacher responds to student interests; Humor is used appropriately; Physical proximity is used to connect."
                    }
                ]
            }
        ]
    },
    {
        id: "C3",
        cluster: "3",
        title: "Cluster:3 - Instruction",
        subtitle: "Instruction",
        subDomains: [
            {
                id: "3a",
                title: "3a - Communicating with Students",
                parameters: [
                    {
                        name: "Clarity of Communication",
                        description: "Teacher's explanation of content is clear and uses appropriate language",
                        lookFors: "Spoken and written language is clear; Teacher uses correct vocabulary; Content is accessible to all students."
                    }
                ]
            }
        ]
    }
];

const SPECIALIST_DOMAINS = [
    {
        id: "S1",
        cluster: "Specialist",
        title: "S1. Specialized Instruction & Skills",
        subtitle: "Skill-Based Pedagogy",
        subDomains: [
            {
                id: "S1a",
                title: "Skill-Based Pedagogy",
                parameters: [
                    {
                        name: "Technique & Form",
                        description: "Demonstrates correct technique",
                        lookFors: "Modeling of form; Corrective feedback provided."
                    },
                    {
                        name: "Resource Usage",
                        description: "Uses specialized tools effectively",
                        lookFors: "Safe handling; Proper setup."
                    }
                ]
            }
        ]
    },
    {
        id: "S2",
        cluster: "Specialist",
        title: "S2. Student Engagement",
        subtitle: "Authentic Expression",
        subDomains: [
            {
                id: "S2a",
                title: "Authentic Expression",
                parameters: [
                    {
                        name: "Student Ownership",
                        description: "Students take ownership of their practice",
                        lookFors: "Independent work; Creative choices."
                    }
                ]
            }
        ]
    }
];

const ROUTINES = [
    "Arrival Routine", "Attendance Routine", "Class Cleaning Routines",
    "Collection Routine", "Departure Routine", "Grouping Routine",
    "Lining Up Strategies", "No Routines Observed"
];

const CULTURE_TOOLS = [
    "Affirmations", "Brain Breaks", "Check-In", "Countdown",
    "Positive Framing", "Precise Praise", "Morning Meetings",
    "Social Contract", "Normalise Error", "No Culture Tools Observed"
];

const INSTRUCTIONAL_TOOLS = [
    "Do Now", "Think-Pair-Share", "Exit Ticket", "Cold Call",
    "Choral Call", "Concept Map", "KWL", "See-Think-Wonder",
    "Turn & Talk", "Wait Time", "No Tools Observed"
];

const LA_TOOLS = [
    "Math Journal", "Error Analysis", "Graphic Organisers",
    "Claim-Evidence-Reasoning", "Socratic Seminar", "Silent Debate",
    "No LA Tool Observed"
];

const META_TAGS = [
    "Knowledge of Content and Pedagogy", "Knowledge of Students",
    "Knowledge of Resources", "Designing a Microplan", "Using Student Assessments",
    "Creating an Environment of Respect and Rapport", "Establishing a Culture for Learning",
    "Managing Classroom Procedures", "Managing Student Behaviour",
    "Communicating with Students", "Using Questioning and Discussion Techniques and Learning Tools",
    "Using Assessment in Instruction", "Organizing Physical Space", "Cleanliness", "Use of Boards",
    "Reflecting on Teaching", "Maintaining Accurate Records", "Communicating with Families",
    "Participating in a Professional Community", "Growing and Developing Professionally"
];

const GRADE_OPTIONS = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const LEARNING_AREA_CATEGORIES = [
    {
        label: "Core Subjects",
        options: ["Mathematics", "Science", "English", "Social Science", "Hindi", "Kannada", "Biology", "Physics", "Chemistry", "Computer Science"]
    },
    {
        label: "Non-Core Subjects",
        options: ["Life Skills", "Physical Education", "Visual Arts", "Music", "Value Education"]
    }
];

const ALL_LEARNING_AREAS = LEARNING_AREA_CATEGORIES.flatMap(cat => cat.options);



interface ExtendedObservation extends Partial<Observation> {
    block: string;
    grade: string;
    section: string;
    focusArea?: string;
    cluster: string;
    sessionType: string;
    engagementScore: number;
    deliveryScore: number;
    outcomeNotes: string;
    peerReview: string;
}

export function UnifiedObservationForm({ onSubmit, onAutoSave, onCancel, initialData = {}, teachers, readOnly }: UnifiedObservationFormProps) {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [dynamicDomains, setDynamicDomains] = useState<any[]>(DOMAINS);
    const [dynamicRoutines, setDynamicRoutines] = useState(ROUTINES);
    const [dynamicCultureTools, setDynamicCultureTools] = useState(CULTURE_TOOLS);
    const [dynamicInstructionalTools, setDynamicInstructionalTools] = useState(INSTRUCTIONAL_TOOLS);
    const [dynamicLaTools, setDynamicLaTools] = useState(LA_TOOLS);
    const [openGrade, setOpenGrade] = useState(false);
    const [openLA, setOpenLA] = useState(false);

    const [teacherGoals, setTeacherGoals] = useState<any[]>([]);
    const [isLoadingGoals, setIsLoadingGoals] = useState(false);
    const { setContextData, clearContextData } = useAIContext();

    // Live Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [currentNote, setCurrentNote] = useState("");

    // Internal state uses flattened classroom fields for stability
    const [formData, setFormData] = useState<ExtendedObservation>(() => {
        const obs = {
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString().split('T')[0],
            observerRole: initialData.observerRole || "Head of School",
            domains: initialData.domains || DOMAINS.map(d => ({
                domainId: d.id,
                title: d.title,
                subDomains: d.subDomains.map(sd => ({
                    id: sd.id,
                    title: sd.title,
                    parameters: sd.parameters.map(p => ({
                        name: p.name,
                        rating: "Not Observed",
                        note: ""
                    }))
                })),
                evidence: ""
            })),
            routines: initialData.routines || [],
            cultureTools: initialData.cultureTools || [],
            instructionalTools: initialData.instructionalTools || [],
            learningAreaTools: initialData.learningAreaTools || [],
            metaTags: initialData.metaTags || [],
            discussionMet: initialData.discussionMet || false,
            strengths: initialData.strengths || "",
            areasOfGrowth: initialData.areasOfGrowth || "",
            feedback: initialData.feedback || "",
            actionSteps: initialData.actionSteps || "",
            nextSteps: initialData.nextSteps || "",
            score: initialData.score || 0,
            status: initialData.status || "Draft",
            hasReflection: initialData.hasReflection || false,
            reflection: initialData.reflection || "",
            // Classroom fields flattened
            campus: initialData.campus || "CMR NPS",
            teacher: initialData.teacher || "",
            teacherId: initialData.teacherId || "",
            teacherEmail: initialData.teacherEmail || "",
            observerName: initialData.observerName || user?.fullName || "",
            block: initialData.classroom?.block || "",
            grade: initialData.classroom?.grade || "",
            section: initialData.classroom?.section || "",
            cluster: initialData.cluster || "1",
            sessionType: (initialData as any).sessionType || "Lecture",
            engagementScore: (initialData as any).engagementScore || 0,
            deliveryScore: (initialData as any).deliveryScore || 0,
            outcomeNotes: (initialData as any).outcomeNotes || "",
            peerReview: (initialData as any).peerReview || "",
            ...initialData,
            learningArea: initialData.learningArea || initialData.classroom?.learningArea || ""
        };
        return obs as ExtendedObservation;
    });

    const { isSaving } = useAutoSave({
        data: formData,
        onSave: async (data) => {
            if (onAutoSave) {
                await onAutoSave(data);
            }
        },
        enabled: !readOnly && !!formData.teacherId,
        localStorageKey: `pdi_obs_draft_${formData.id}`
    });

    // Timer Effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setTimerSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartRecording = () => {
        setIsRecording(true);
        if (!recordingStartTime) {
            setRecordingStartTime(new Date());
        }
    };

    const handleStopRecording = () => {
        setIsRecording(false);
    };

    const handleAddNote = () => {
        if (!currentNote.trim()) return;
        const timestamp = formatDuration(timerSeconds);
        const newNote = { time: timestamp, note: currentNote.trim() };
        
        setFormData(prev => ({
            ...prev,
            timestampedNotes: [...(prev.timestampedNotes || []), newNote]
        }));
        setCurrentNote("");
        toast.success(`Note added at ${timestamp}`);
    };

    useEffect(() => {
        if (formData.teacher) {
            setContextData({
                observationType: "Danielson Framework",
                teacherDetail: formData.teacher,
                currentStep: step,
                currentDomain: step > 1 && step <= dynamicDomains.length + 1 ? dynamicDomains[step - 2]?.title : "Basic Info"
            });
        }
        return () => clearContextData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.teacher, step, dynamicDomains]);

    // Handle AI Draft Handoff
    useEffect(() => {
        const draft = sessionStorage.getItem('ai_observation_draft');
        // Only load if we aren't editing an existing record (initialData.id is missing)
        if (draft && !initialData?.id) {
            try {
                const payload = JSON.parse(draft);
                
                // Lookup teacher if name is provided
                let teacherId = "";
                let teacherName = payload.teacherName || "";
                let teacherEmail = "";
                let campus = "";
                
                if (payload.teacherName && teachers) {
                    const found = teachers.find(t => t.name.toLowerCase().includes(payload.teacherName.toLowerCase()));
                    if (found) {
                        teacherId = found.id;
                        teacherName = found.name;
                        teacherEmail = found.email || "";
                        campus = found.campus || "";
                    }
                }

                setFormData(prev => ({
                    ...prev,
                    teacher: teacherName,
                    teacherId: teacherId,
                    teacherEmail: teacherEmail,
                    campus: campus || prev.campus,
                    learningArea: payload.subject || prev.learningArea,
                    grade: payload.grade || prev.grade,
                    strengths: payload.strengths || prev.strengths,
                    areasOfGrowth: payload.areasForImprovement || prev.areasOfGrowth,
                    score: payload.score || prev.score,
                    metaTags: payload.domains || prev.metaTags
                }));

                sessionStorage.removeItem('ai_observation_draft');
                toast.success("AI draft loaded! Please verify the details.");
            } catch (e) {
                console.error("Failed to parse AI draft", e);
            }
        }
    }, [teachers, initialData?.id]);

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            // Only update if it's a different observation or we have no data
            if (!formData.id || (initialData as any).id !== formData.id) {
                setFormData((prev: any) => ({
                    ...prev,
                    ...initialData,
                    block: initialData.classroom?.block || (initialData as any).block || prev.block,
                    grade: initialData.classroom?.grade || (initialData as any).grade || prev.grade,
                    section: initialData.classroom?.section || (initialData as any).section || prev.section,
                    learningArea: initialData.classroom?.learningArea || (initialData as any).learningArea || prev.learningArea
                }));

                if (initialData.domains) {
                    setDynamicDomains(initialData.domains.map(d => ({
                        id: d.domainId,
                        title: d.title,
                        subtitle: "",
                        cluster: (initialData as any).cluster || "1",
                        subDomains: (d as any).subDomains || []
                    })));
                }
            }
        }
    }, [initialData, formData.id]);

    useEffect(() => {
        const loadTemplate = async () => {
            try {
                const templates = await templateService.getAllTemplates('OBSERVATION');
                const selectedTeacher = teachers?.find(t => t.id === formData.teacherId);
                const isSpecialist = selectedTeacher?.academics === 'NON_CORE';

                const templateName = isSpecialist ? 'Specialist Observation' : 'Walkthrough Observation';
                const currentTemplate = templates.find(t => t.name === templateName) || templates.find(t => t.isDefault) || templates[0];

                if (currentTemplate && currentTemplate.structure) {
                    const fields = typeof currentTemplate.structure === 'string'
                        ? JSON.parse(currentTemplate.structure)
                        : currentTemplate.structure;

                    const routineField = fields.find((f: any) => f.id === 'routines' || f.label.includes('Routines'));
                    const cultureField = fields.find((f: any) => f.id === 'cultureTools' || f.label.includes('Culture Tools'));
                    const instructionalField = fields.find((f: any) => f.id === 'instructionalTools' || f.label.includes('Instructional Tools'));
                    const laField = fields.find((f: any) => f.id === 'learningAreaTools' || f.label.includes('LA Tool'));

                    if (routineField?.options) setDynamicRoutines(routineField.options);
                    if (cultureField?.options) setDynamicCultureTools(cultureField.options);
                    if (instructionalField?.options) setDynamicInstructionalTools(instructionalField.options);
                    if (laField?.options) setDynamicLaTools(laField.options);
                }
            } catch (error) {
                console.error("Failed to load observation template", error);
            }
        };
        // Only load template if we are not in "Edit" mode (or if teacher changes)
        if (!initialData?.id) {
            loadTemplate();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.teacherId]);



    const updateField = <K extends keyof ExtendedObservation>(
        field: K,
        value: ExtendedObservation[K]
    ) => {
        setFormData(prev => {
            if (prev[field] === value) return prev;
            return { ...prev, [field]: value };
        });
    };

    const updateMultipleFields = (updates: Partial<ExtendedObservation>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleTeacherSelect = (teacherId: string) => {
        const selectedTeacher = teachers?.find(t => t.id === teacherId);
        if (selectedTeacher) {
            const isSpecialist = selectedTeacher.academics === 'NON_CORE_ACADEMICS';
            const targetDomains = isSpecialist ? SPECIALIST_DOMAINS : DOMAINS;

            setFormData(prev => ({
                ...prev,
                teacherId: selectedTeacher.id,
                teacher: selectedTeacher.name,
                teacherEmail: selectedTeacher.email || `${selectedTeacher.name.toLowerCase().replace(' ', '.')}@ekya.in`,
                domains: targetDomains.map(d => ({
                    domainId: d.id,
                    title: d.title,
                    subDomains: (d as any).subDomains.map((sd: any) => ({
                        id: sd.id,
                        title: sd.title,
                        parameters: sd.parameters.map((p: any) => ({
                            name: p.name,
                            rating: "Not Observed",
                            note: ""
                        }))
                    })),
                    evidence: ""
                }))
            }));

            // Force reload template options
            setDynamicDomains(targetDomains);

            // Fetch teacher goals for focus area
            fetchTeacherGoals(teacherId);
        }
    };

    const fetchTeacherGoals = async (teacherId: string) => {
        setIsLoadingGoals(true);
        try {
            const res = await api.get(`/goals?teacherId=${teacherId}`);
            if (res.data.status === 'success') {
                setTeacherGoals(res.data.data.goals || []);
            }
        } catch (err) {
            console.error("Failed to fetch teacher goals", err);
        } finally {
            setIsLoadingGoals(false);
        }
    };

    const updateIndicatorRating = (domainId: string, subDomainId: string, parameterName: string, rating: DanielsonRatingScale) => {
        setFormData(prev => {
            const updatedDomains = prev.domains?.map(d => {
                if (d.domainId !== domainId) return d;

                const updatedSubDomains = (d as any).subDomains?.map((sd: any) => {
                    if (sd.id !== subDomainId) return sd;

                    const updatedParameters = sd.parameters?.map((p: any) => {
                        if (p.name !== parameterName) return p;
                        return { ...p, rating };
                    });

                    return { ...sd, parameters: updatedParameters };
                });

                return { ...d, subDomains: updatedSubDomains };
            });

            return { ...prev, domains: updatedDomains };
        });
    };

    const updateParameterNote = (domainId: string, subDomainId: string, parameterName: string, note: string) => {
        setFormData(prev => {
            const updatedDomains = prev.domains?.map(d => {
                if (d.domainId !== domainId) return d;

                const updatedSubDomains = (d as any).subDomains?.map((sd: any) => {
                    if (sd.id !== subDomainId) return sd;

                    const updatedParameters = sd.parameters?.map((p: any) => {
                        if (p.name !== parameterName) return p;
                        return { ...p, note };
                    });

                    return { ...sd, parameters: updatedParameters };
                });

                return { ...d, subDomains: updatedSubDomains };
            });

            return { ...prev, domains: updatedDomains };
        });
    };

    const updateDomainEvidence = (domainId: string, evidence: string) => {
        setFormData(prev => {
            const domain = prev.domains?.find(d => d.domainId === domainId);
            if (domain?.evidence === evidence) return prev;

            return {
                ...prev,
                domains: prev.domains?.map(d => d.domainId === domainId ? { ...d, evidence } : d)
            };
        });
    };

    const setMultiSelect = (field: keyof Observation, item: string, checked: boolean) => {
        setFormData(prev => {
            const current = Array.isArray(prev[field]) ? (prev[field] as string[]) : [];
            const exists = current.includes(item);

            if (checked && !exists) {
                return { ...prev, [field]: [...current, item] };
            } else if (!checked && exists) {
                return { ...prev, [field]: current.filter(i => i !== item) };
            }
            return prev;
        });
    };

    const validateStep = () => {
        if (step === 1) {
            if (!formData.teacher?.trim() || !formData.teacherEmail?.trim() || !formData.campus) {
                toast.error("Please fill in all required teacher details");
                return false;
            }
            if (!formData.focusArea) {
                toast.error("Please select Focus Area");
                return false;
            }
        }
        if (step === 2) {
            if (!formData.block || !formData.grade || !formData.learningArea) {
                toast.error("Please fill in all required classroom details");
                return false;
            }
        }
        if (step === 3) {
            // Check if all domaines have evidence
            const missingEvidence = formData.domains?.some(d => !d.evidence.trim());
            // Requirement from prompt: "Evidence required for every rated section"
            // Let's interpret "rated section" as a domain where at least one indicator is observed
            // For simplicity, let's require evidence for all domains in Section 3
            if (missingEvidence) {
                toast.error("Please provide evidence for every rated domain");
                return false;
            }
        }
        if (step === 4) {
            // Optional but recommended
        }
        if (step === 5) {
            if (!formData.feedback?.trim() || !formData.actionSteps?.trim()) {
                toast.error("Please complete feedback and action steps");
                return false;
            }
        }
        if (step === 6) {
            if (!formData.metaTags || formData.metaTags.length === 0) {
                toast.error("Please select at least one Meta Tag for improvement");
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep()) {
            let totalPoints = 0;
            let observedCount = 0;
            formData.domains?.forEach(d => {
                (d as any).subDomains?.forEach((sd: any) => {
                    sd.parameters?.forEach((p: any) => {
                        if (p.rating !== "Not Observed") {
                            observedCount++;
                            if (p.rating === "Highly Effective" || p.rating === "Effective") totalPoints += 4;
                            else if (p.rating === "Developing") totalPoints += 2;
                            else if (p.rating === "Basic") totalPoints += 1;
                        }
                    });
                });
            });
            const scoreValue = observedCount > 0 ? Number((totalPoints / observedCount).toFixed(1)) : 0;

            const finalGrade = formData.section ? `${formData.grade} - ${formData.section}` : formData.grade;

            const finalData: Partial<Observation> = {
                ...formData,
                score: scoreValue,
                overallRating: scoreValue, // Important for the report view
                domain: formData.metaTags?.[0] || "General Instruction",
                classroom: {
                    block: formData.block || "",
                    grade: finalGrade || "",
                    section: formData.section || "",
                    learningArea: formData.learningArea || ""
                }
            };


            onSubmit(finalData);
        }
    };

    if (readOnly) {
        return (
            <div className="pt-4 animate-in fade-in duration-700">
                <ObservationReport
                    data={{
                        ...formData,
                        overallRating: formData.score, // Danielson uses score
                    }}
                    onBack={onCancel}
                />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Progress Header */}
            <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md pt-4 pb-6 border-b mb-8 px-4">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">Observation Form</h2>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Layout className="w-4 h-4" /> Step {step} of 6: {
                                step === 1 ? "Teacher Details" :
                                    step === 2 ? "Classroom Details" :
                                        step === 3 ? "Danielson Ratings" :
                                            step === 4 ? "Routines & Tools" :
                                                step === 5 ? "Feedback" : "Meta Tags"
                            }
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300",
                            isSaving
                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        )}>
                            <Cloud className={cn("w-3.5 h-3.5", isSaving ? "animate-pulse fill-amber-600/20" : "fill-emerald-600/20")} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                {isSaving ? "Saving changes..." : "All changes auto-saved"}
                            </span>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6].map(s => (
                                <div key={s} className={cn("w-8 h-1.5 rounded-full transition-all duration-500", step >= s ? "bg-primary" : "bg-muted")} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleFormSubmit} className="px-4">
                {/* Step 1: Observation & Teacher Details */}
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="  shadow-xl">
                            <CardHeader className="bg-primary/5 rounded-t-xl py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Observation & Teacher Details</CardTitle>
                                        <CardDescription>Basic information about the session</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground">Name of the Teacher *</Label>
                                        <Select
                                            value={formData.teacherId || ""}
                                            onValueChange={(val) => {
                                                const teacher = teachers?.find(t => t.id === val);
                                                if (teacher) {
                                                    updateField("teacherId", teacher.id);
                                                    updateField("teacher", teacher.name);
                                                    updateField("teacherEmail", teacher.email || "");
                                                    updateField("campus", teacher.campus || "");
                                                    if (teacher.department) {
                                                        updateField("learningArea", teacher.department);
                                                    }
                                                }
                                            }}
                                            disabled={readOnly || !!initialData.teacherId}
                                        >
                                            <SelectTrigger className={cn("h-12 text-base rounded-xl border-muted-foreground/20", (readOnly || !!initialData.teacherId) && "bg-slate-50 text-muted-foreground")}>
                                                <SelectValue placeholder="Search or Select Teacher" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {teachers?.map(t => (
                                                    <SelectItem key={t.id} value={t.id}>{t.name} ({t.role || 'Teacher'})</SelectItem>
                                                ))}
                                                {(!teachers || teachers.length === 0) && (
                                                    <SelectItem value="manual" disabled>No teachers found</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground">Teacher Email ID *</Label>
                                        <Input
                                            type="email"
                                            placeholder="teacher@ekya.in"
                                            value={formData.teacherEmail || ""}
                                            onChange={(e) => updateField("teacherEmail", e.target.value)}
                                            readOnly={readOnly || !!initialData.teacherEmail}
                                            className={cn("h-12 text-base rounded-xl border-muted-foreground/20", (readOnly || !!initialData.teacherEmail) && "bg-slate-50 text-muted-foreground")}
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground">Observer's Name *</Label>
                                        <Input
                                            value={formData.observerName || ""}
                                            onChange={(e) => updateField("observerName", e.target.value)}
                                            readOnly={readOnly}
                                            className={cn("h-12 text-base rounded-xl border-muted-foreground/20", readOnly && "bg-slate-50 text-muted-foreground")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground">Date of Observation *</Label>
                                        <Input
                                            type="date"
                                            value={formData.date || ""}
                                            onChange={(e) => updateField("date", e.target.value)}
                                            readOnly={readOnly}
                                            className={cn("h-12 text-base rounded-xl border-muted-foreground/20", readOnly && "bg-slate-50 text-muted-foreground")}
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground">Observation Focus Area (Goal Alignment) *</Label>
                                        <Select
                                            value={formData.focusArea || ""}
                                            onValueChange={(val) => updateField("focusArea", val)}
                                        >
                                            <SelectTrigger className="h-12 text-base rounded-xl border-muted-foreground/20">
                                                <SelectValue placeholder={isLoadingGoals ? "Loading goals..." : "Select Focus Area"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {teacherGoals.length > 0 ? (
                                                    teacherGoals.map(goal => (
                                                        <SelectItem key={goal.id} value={goal.title}>{goal.title}</SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="General Observation">General Observation (No active goals)</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {teacherGoals.length > 0 && <p className="text-[10px] text-muted-foreground italic">Aligned with teacher's professional goals.</p>}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground">Campus *</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {CAMPUS_OPTIONS.map(c => (
                                            <Badge
                                                key={c}
                                                variant={formData.campus === c ? "default" : "outline"}
                                                className={cn(
                                                    "cursor-pointer px-4 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105",
                                                    formData.campus === c ? "bg-primary text-white" : "border-primary/20 text-muted-foreground hover:bg-primary/5",
                                                    readOnly && "cursor-default scale-100 opacity-80"
                                                )}
                                                onClick={() => !readOnly && updateField("campus", c)}
                                            >
                                                {c}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground">Observer's Role *</Label>
                                    <RadioGroup
                                        value={formData.observerRole}
                                        onValueChange={(val) => updateField("observerRole", val)}
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                                    >
                                        {["Academic Coordinator", "CCA Coordinator", "Head of School", "ELC Team Member", "PDI Team Member", "Other"].map(r => (
                                            <div key={r} className={cn("flex items-center space-x-2 border p-4 rounded-xl transition-colors", readOnly ? "cursor-default" : "hover:bg-muted/50 cursor-pointer")}>
                                                <RadioGroupItem value={r} id={`role-${r}`} disabled={readOnly} />
                                                <Label htmlFor={`role-${r}`} className={cn("font-medium", !readOnly && "cursor-pointer")}>{r}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Step 2: Classroom Details */}
                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="  shadow-xl">
                            <CardHeader className="bg-indigo-500/5 rounded-t-xl py-6 border-l-4 border-indigo-500">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Classroom Details</CardTitle>
                                        <CardDescription>Subject and grade context</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground">Block *</Label>
                                    <div className="flex flex-wrap gap-4">
                                        {["Early Years", "Primary", "Middle", "Senior", "Specialist"].map(b => (
                                            <div
                                                key={b}
                                                className={cn(
                                                    "flex items-center gap-2 p-4 border-2 rounded-2xl transition-all",
                                                    formData.block === b ? "border-primary bg-primary/5" : "border-muted-foreground/10 hover:border-primary/40 hover:bg-muted/20",
                                                    readOnly ? "cursor-default" : "cursor-pointer"
                                                )}
                                                onClick={() => !readOnly && updateField("block", b)}
                                            >
                                                <div className={cn("w-4 h-4 rounded-full border-2", formData.block === b ? "bg-primary border-primary" : "border-muted-foreground/20")} />
                                                <span className="font-bold">{b}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground">Session Type *</Label>
                                    <div className="flex flex-wrap gap-4">
                                        {["Lecture", "Workshop", "Lab", "Activity"].map(type => (
                                            <div
                                                key={type}
                                                className={cn(
                                                    "flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition-all",
                                                    formData.sessionType === type ? "border-primary bg-primary/5 text-primary" : "border-muted-foreground/10 hover:border-primary/40"
                                                )}
                                                onClick={() => !readOnly && updateField("sessionType", type)}
                                            >
                                                <div className={cn("w-3 h-3 rounded-full border-2", formData.sessionType === type ? "bg-primary border-primary" : "border-muted-foreground/20")} />
                                                <span className="font-bold text-sm">{type}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground">Grade *</Label>
                                        <Popover open={openGrade} onOpenChange={setOpenGrade}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openGrade}
                                                    disabled={readOnly}
                                                    className={cn("w-full h-12 justify-between border-muted-foreground/20 rounded-xl text-base", readOnly && "bg-slate-50 text-muted-foreground")}
                                                >
                                                    {formData.grade
                                                        ? GRADE_OPTIONS.find((g) => g === formData.grade)
                                                        : "Select Grade"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search grade..." />
                                                    <CommandEmpty>No grade found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {GRADE_OPTIONS.map((g) => (
                                                            <CommandItem
                                                                key={g}
                                                                value={g}
                                                                onSelect={(currentValue) => {
                                                                    updateField("grade", currentValue === formData.grade ? "" : currentValue);
                                                                    setOpenGrade(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        formData.grade === g ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {g}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground">Section</Label>
                                        <Input
                                            placeholder="e.g., A, B, Emerald"
                                            value={formData.section}
                                            onChange={(e) => updateField("section", e.target.value)}
                                            readOnly={readOnly}
                                            className={cn("h-12 text-base rounded-xl border-muted-foreground/20", readOnly && "bg-slate-50 text-muted-foreground")}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground">Learning Area *</Label>
                                    <Popover open={openLA} onOpenChange={setOpenLA}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openLA}
                                                disabled={readOnly}
                                                className={cn("w-full h-12 justify-between border-muted-foreground/20 rounded-xl text-base", readOnly && "bg-slate-50 text-muted-foreground")}
                                            >
                                                {formData.learningArea
                                                    ? ALL_LEARNING_AREAS.find((la) => la === formData.learningArea)
                                                    : "Search or Select Learning Area"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search learning area..." />
                                                <CommandEmpty>No learning area found.</CommandEmpty>
                                                {LEARNING_AREA_CATEGORIES.map((category) => (
                                                    <CommandGroup key={category.label} heading={category.label}>
                                                        {category.options.map((la) => (
                                                            <CommandItem
                                                                key={la}
                                                                value={la}
                                                                onSelect={(currentValue) => {
                                                                    const matchedArea = ALL_LEARNING_AREAS.find(
                                                                        opt => opt.toLowerCase() === currentValue.toLowerCase()
                                                                    ) || currentValue;
                                                                    updateField("learningArea", matchedArea === formData.learningArea ? "" : matchedArea);
                                                                    setOpenLA(false);
                                                                }}
                                                            >
                                                                <Check className={cn("mr-2 h-4 w-4", formData.learningArea === la ? "opacity-100" : "opacity-0")} />
                                                                {la}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                ))}
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                 {/* Cluster 3+ Advanced Metrics */}
                                {Number(formData.cluster) >= 3 && (
                                    <div className="grid md:grid-cols-2 gap-8 pt-4 animate-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground flex items-center gap-2">
                                                <Target className="w-4 h-4 text-primary" /> Engagement Metric (1-10)
                                            </Label>
                                            <Input
                                                type="number" min="0" max="10"
                                                value={formData.engagementScore}
                                                onChange={(e) => updateField("engagementScore", Number(e.target.value))}
                                                className="h-12 text-base rounded-xl border-muted-foreground/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground flex items-center gap-2">
                                                <Layout className="w-4 h-4 text-primary" /> Delivery Metric (1-10)
                                            </Label>
                                            <Input
                                                type="number" min="0" max="10"
                                                value={formData.deliveryScore}
                                                onChange={(e) => updateField("deliveryScore", Number(e.target.value))}
                                                className="h-12 text-base rounded-xl border-muted-foreground/20"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4 pt-6 border-t border-dashed border-muted-foreground/20">
                                    <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground flex items-center gap-2">
                                        <PenTool className="w-4 h-4 text-primary" /> Observation Running Notes
                                    </Label>
                                    <Textarea
                                        placeholder="Add real-time notes here during the observation..."
                                        className="min-h-[200px] p-4 text-base rounded-2xl border-muted-foreground/10 bg-slate-50/30"
                                        value={(formData as any).runningNotes || ""}
                                        onChange={(e) => updateField("runningNotes" as any, e.target.value)}
                                        readOnly={readOnly}
                                    />
                                </div>

                                <div className="space-y-4 pt-6">
                                    <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground flex items-center gap-2">
                                        <Cloud className="w-4 h-4 text-primary" /> Evidence Upload (Optional)
                                    </Label>
                                    <div className="p-8 border-2 border-dashed border-muted-foreground/20 rounded-[2rem] flex flex-col items-center justify-center gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Cloud className="w-8 h-8 text-primary/40" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-sm">Click or drag to upload files</p>
                                            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-black opacity-50">Images, PDFs, or Videos</p>
                                        </div>
                                        <Input type="file" className="hidden" id="evidence-upload" />
                                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('evidence-upload')?.click()} className="rounded-full px-6 font-bold">Choose Files</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {/* Step 3: Danielson Ratings */}
                {step === 3 && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {dynamicDomains
                            .filter(d => d.cluster === formData.cluster)
                            .map((domain, idx) => (
                            <DomainSection
                                key={domain.id}
                                domain={domain}
                                readOnly={readOnly}
                                updateIndicatorRating={updateIndicatorRating}
                                updateParameterNote={updateParameterNote}
                                formData={formData}
                            />
                        ))}
                    </div>
                )}

                {/* Step 4: Routines, Tools & Strategies */}
                {step === 4 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <Settings className="w-8 h-8 text-primary" />
                                Routines, Tools & Strategies
                            </h2>
                            <p className="text-muted-foreground mt-2">Select all that were observed during the session.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                            {/* Classroom Routines */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 border-b-2 border-primary/10 pb-2">
                                    <ClipboardCheck className="w-5 h-5 text-primary" />
                                    <h3 className="font-bold text-lg">Classroom Routines</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {dynamicRoutines.map((routine) => {
                                        const id = `routine-${routine.replace(/\s+/g, '-').toLowerCase()}`;
                                        const isChecked = formData.routines?.includes(routine);
                                        return (
                                            <div
                                                key={routine}
                                                className={cn(
                                                    "flex items-center space-x-3 p-3 rounded-xl border transition-all select-none",
                                                    isChecked ? "bg-primary/5 border-primary shadow-sm" : "hover:bg-muted/50 border-muted-foreground/10",
                                                    readOnly && "cursor-default"
                                                )}
                                            >
                                                <Checkbox
                                                    id={id}
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => !readOnly && setMultiSelect("routines", routine, !!checked)}
                                                    disabled={readOnly}
                                                />
                                                <Label htmlFor={id} className={cn("font-medium text-sm flex-1", !readOnly && "cursor-pointer")}>{routine}</Label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Culture Tools */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 border-b-2 border-indigo-500/10 pb-2">
                                    <Star className="w-5 h-5 text-indigo-500" />
                                    <h3 className="font-bold text-lg">Culture Tools Observed</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {dynamicCultureTools.map((tool) => {
                                        const id = `culture-${tool.replace(/\s+/g, '-').toLowerCase()}`;
                                        const isChecked = formData.cultureTools?.includes(tool);
                                        return (
                                            <div
                                                key={tool}
                                                className={cn(
                                                    "flex items-center space-x-3 p-3 rounded-xl border transition-all select-none",
                                                    isChecked ? "bg-indigo-500/5 border-indigo-500 shadow-sm" : "hover:bg-muted/50 border-muted-foreground/10",
                                                    readOnly && "cursor-default"
                                                )}
                                            >
                                                <Checkbox
                                                    id={id}
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => !readOnly && setMultiSelect("cultureTools", tool, !!checked)}
                                                    disabled={readOnly}
                                                />
                                                <Label htmlFor={id} className={cn("font-medium text-sm flex-1", !readOnly && "cursor-pointer")}>{tool}</Label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Instructional Tools */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 border-b-2 border-emerald-500/10 pb-2">
                                    <Target className="w-5 h-5 text-emerald-500" />
                                    <h3 className="font-bold text-lg">Instructional Tools Observed</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {dynamicInstructionalTools.map((tool) => {
                                        const id = `instructional-${tool.replace(/\s+/g, '-').toLowerCase()}`;
                                        const isChecked = formData.instructionalTools?.includes(tool);
                                        return (
                                            <div
                                                key={tool}
                                                className={cn(
                                                    "flex items-center space-x-3 p-3 rounded-xl border transition-all select-none",
                                                    isChecked ? "bg-emerald-500/5 border-emerald-500 shadow-sm" : "hover:bg-muted/50 border-muted-foreground/10",
                                                    readOnly && "cursor-default"
                                                )}
                                            >
                                                <Checkbox
                                                    id={id}
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => !readOnly && setMultiSelect("instructionalTools", tool, !!checked)}
                                                    disabled={readOnly}
                                                />
                                                <Label htmlFor={id} className={cn("font-medium text-sm flex-1", !readOnly && "cursor-pointer")}>{tool}</Label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Learning Area Tools */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 border-b-2 border-orange-500/10 pb-2">
                                    <BookOpen className="w-5 h-5 text-orange-500" />
                                    <h3 className="font-bold text-lg">LA Tools Observed</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {dynamicLaTools.map((tool) => {
                                        const id = `la-tool-${tool.replace(/\s+/g, '-').toLowerCase()}`;
                                        const isChecked = formData.learningAreaTools?.includes(tool);
                                        return (
                                            <div
                                                key={tool}
                                                className={cn(
                                                    "flex items-center space-x-3 p-3 rounded-xl border transition-all select-none",
                                                    isChecked ? "bg-orange-500/5 border-orange-500 shadow-sm" : "hover:bg-muted/50 border-muted-foreground/10",
                                                    readOnly && "cursor-default"
                                                )}
                                            >
                                                <Checkbox
                                                    id={id}
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => !readOnly && setMultiSelect("learningAreaTools", tool, !!checked)}
                                                    disabled={readOnly}
                                                />
                                                <Label htmlFor={id} className={cn("font-medium text-sm flex-1", !readOnly && "cursor-pointer")}>{tool}</Label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Feedback & Action Steps */}
                {step === 5 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="  shadow-xl">
                            <CardHeader className="bg-primary/5 rounded-t-xl py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Feedback & Action Steps</CardTitle>
                                        <CardDescription>Synthesizing the observation into growth points</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-10">
                                <div className="space-y-6">
                                    <Label className="text-base font-bold">Have you met and discussed the observation with the teacher? *</Label>
                                    <RadioGroup
                                        value={formData.discussionMet ? "Yes" : "No"}
                                        onValueChange={(val) => !readOnly && updateField("discussionMet", val === "Yes")}
                                        className="flex gap-8"
                                    >
                                        <div className={cn("flex items-center space-x-2 border p-4 rounded-xl transition-colors", readOnly ? "cursor-default" : "hover:bg-muted/50 cursor-pointer")}>
                                            <RadioGroupItem value="Yes" id="disc-yes" disabled={readOnly} />
                                            <Label htmlFor="disc-yes" className={cn("font-bold text-lg", !readOnly && "cursor-pointer")}>Yes</Label>
                                        </div>
                                        <div className={cn("flex items-center space-x-2 border p-4 rounded-xl transition-colors", readOnly ? "cursor-default" : "hover:bg-muted/50 cursor-pointer")}>
                                            <RadioGroupItem value="No" id="disc-no" disabled={readOnly} />
                                            <Label htmlFor="disc-no" className={cn("font-bold text-lg", !readOnly && "cursor-pointer")}>No</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground flex items-center gap-2">
                                        <Star className="w-4 h-4 text-primary" /> Teacher Strengths
                                    </Label>
                                    <Textarea
                                        placeholder="What went exceptionally well?"
                                        className="min-h-[120px] p-4 text-base rounded-2xl border-muted-foreground/10"
                                        value={formData.strengths}
                                        onChange={(e) => updateField("strengths", e.target.value)}
                                        readOnly={readOnly}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground flex items-center gap-2">
                                        <Target className="w-4 h-4 text-primary" /> Areas of Growth
                                    </Label>
                                    <Textarea
                                        placeholder="What are the specific areas for improvement?"
                                        className="min-h-[120px] p-4 text-base rounded-2xl border-muted-foreground/10"
                                        value={formData.areasOfGrowth}
                                        onChange={(e) => updateField("areasOfGrowth", e.target.value)}
                                        readOnly={readOnly}
                                    />
                                </div>

                                <div className="space-y-4">
                                        {/* Glows & Grows Table */}
                                        <div className="rounded-3xl border-2 border-primary/10 overflow-hidden mb-10 shadow-xl bg-white">
                                            <div className="grid grid-cols-2 bg-primary/5 border-b-2 border-primary/10">
                                                <div className="p-4 text-center font-black uppercase tracking-widest text-emerald-700 flex items-center justify-center gap-2">
                                                    <Star className="w-5 h-5" /> Glows
                                                </div>
                                                <div className="p-4 text-center font-black uppercase tracking-widest text-amber-700 border-l-2 border-primary/10 flex items-center justify-center gap-2">
                                                    <TrendingUp className="w-5 h-5" /> Grows
                                                </div>
                                            </div>
                                            <div className="divide-y-2 divide-primary/5">
                                                {DOMAINS.find(d => d.cluster === formData.cluster)?.subDomains.map((sd) => (
                                                    <div key={sd.id} className="grid grid-cols-2">
                                                        <div className="p-4 text-xs font-bold text-muted-foreground border-r-2 border-primary/5 flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                                            {sd.title}
                                                        </div>
                                                        <div className="p-4 text-xs font-bold text-muted-foreground flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                                                            {sd.title}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="grid grid-cols-2 bg-slate-50/50">
                                                    <div className="p-4">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-800 mb-2 block">What Worked Well?</Label>
                                                        <Textarea 
                                                            placeholder="Key strengths observed..." 
                                                            className="min-h-[80px] bg-transparent border-emerald-200/50 focus:border-emerald-500 text-sm"
                                                            value={formData.strengths}
                                                            onChange={(e) => updateField("strengths", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="p-4 border-l-2 border-primary/5">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-amber-800 mb-2 block">What Need Strengthening?</Label>
                                                        <Textarea 
                                                            placeholder="Key areas for improvement..." 
                                                            className="min-h-[80px] bg-transparent border-amber-200/50 focus:border-amber-500 text-sm"
                                                            value={formData.areasOfGrowth}
                                                            onChange={(e) => updateField("areasOfGrowth", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-primary/20 mb-10">
                                            <div className="flex items-center gap-3 mb-6">
                                                <PenTool className="w-6 h-6 text-primary" />
                                                <h3 className="text-lg font-black tracking-tight">Select Suggested Actions</h3>
                                            </div>
                                            <div className="flex flex-col gap-4 text-sm font-bold text-slate-600 italic">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    There is scope for the teacher to work on 
                                                    <Input 
                                                        className="w-full md:w-[300px] h-10 bg-white border-b-2 border-x-0 border-t-0 border-primary rounded-none px-2 italic font-black text-primary"
                                                        placeholder="________________________"
                                                        value={formData.actionStep}
                                                        onChange={(e) => updateField("actionStep" as any, e.target.value)}
                                                    />
                                                    by 
                                                    <Input 
                                                        type="date"
                                                        className="w-full md:w-[200px] h-10 bg-white border-b-2 border-x-0 border-t-0 border-primary rounded-none px-2 italic font-black text-primary"
                                                        value={(formData as any).followUpDate || ""}
                                                        onChange={(e) => updateField("followUpDate" as any, e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4 text-primary" /> Observer's Feedback
                                            </Label>
                                            {!readOnly && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={async () => {
                                                        try {
                                                            toast.loading("Antigravity AI is generating feedback...");
                                                            const res = await api.post('/ai/generate', {
                                                                prompt: `You are an expert academic evaluator and instructional coach.
Your task is to generate clear, actionable, and structured feedback based on the input provided. 

Context:
- Cluster: ${formData.cluster}
- Session Type: ${formData.sessionType}
- Subject/Topic: ${formData.learningArea}
- Instructor Name: ${formData.teacher}
- Feedback Inputs: Strengths: ${formData.strengths}, Areas of Growth: ${formData.areasOfGrowth}, Evidence: ${formData.domains?.map(d => (d as any).subDomains?.map((sd: any) => sd.parameters.map((p: any) => `${p.name}: ${p.rating} ${p.note}`)).flat()).flat().join('. ')}

Instructions:
1. Analyze the input deeply — identify patterns, strengths, and gaps.
2. Do NOT repeat raw responses. Interpret them.
3. Generate feedback in the following structured format:

### 1. Overall Performance Summary
### 2. Key Strengths
### 3. Areas for Improvement
### 4. Learner Experience Insights
### 5. Priority Recommendations
### 6. Suggested Next Steps

Tone Guidelines: Professional, constructive, supportive.
Output Constraints: 200–300 words.`,
                                                                stream: false
                                                            });
                                                            
                                                            const feedback = res.data?.data?.response || res.data?.response;
                                                            if (feedback) {
                                                                updateField("feedback", feedback);
                                                                toast.dismiss();
                                                                toast.success("AI feedback generated successfully!");
                                                            } else {
                                                                throw new Error("No feedback generated");
                                                            }
                                                        } catch (err) {
                                                            toast.dismiss();
                                                            toast.error("Failed to generate AI feedback");
                                                            console.error(err);
                                                        }
                                                    }}
                                                    className="gap-2 text-xs font-bold bg-primary/5 text-primary hover:bg-primary/10 border-primary/20"
                                                >
                                                    <Sparkles className="w-3.5 h-3.5" /> Generate AI Feedback
                                                </Button>
                                            )}
                                        </div>
                                    <Textarea
                                        placeholder="Consolidated feedback for the teacher..."
                                        className="min-h-[250px] p-4 text-base rounded-2xl border-muted-foreground/10 bg-slate-50/30"
                                        value={formData.feedback}
                                        onChange={(e) => updateField("feedback", e.target.value)}
                                        readOnly={readOnly}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground flex items-center gap-2">
                                        <Settings className="w-4 h-4 text-primary" /> Action Steps
                                    </Label>
                                    <Textarea
                                        placeholder="Agreed upon immediate action items..."
                                        className="min-h-[120px] p-4 text-base rounded-2xl border-muted-foreground/10"
                                        value={formData.actionSteps}
                                        onChange={(e) => updateField("actionSteps", e.target.value)}
                                        readOnly={readOnly}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Step 6: Meta Tags */}
                {step === 6 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="  shadow-xl bg-background overflow-hidden">
                            <CardHeader className="bg-primary/5 border-b py-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Tag className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-bold">Meta Tags – Areas for Improvement</CardTitle>
                                        <CardDescription className="text-base">Select the key tags that best reflect the feedback and action steps.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-10">
                                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-4 mb-4 shadow-sm">
                                    <Sparkles className="w-6 h-6 text-emerald-600 mt-1" />
                                    <div>
                                        <p className="font-bold text-emerald-800">Insight Engine Integration</p>
                                        <p className="text-sm text-emerald-700/80">These tags power the AI analytics engine to identify recurring growth areas across teams and campuses.</p>
                                    </div>
                                </div>

                                <MultiSelectSection title="Meta Tags for Feedback & Coaching" items={META_TAGS} field="metaTags" formData={formData} setMultiSelect={setMultiSelect} readOnly={readOnly} />

                                <div className="pt-10 border-t flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-10 h-10 text-success" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">Ready to Submit</h3>
                                        <p className="text-muted-foreground max-w-md">Every single detail matters for the educator's growth journey. Thank you for your thorough documentation.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Sticky Bottom Actions */}
                <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t py-4 z-30 px-6">
                    <div className="max-w-5xl mx-auto flex justify-between items-center">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onCancel}
                            className="gap-2 font-bold px-6 border border-muted-foreground/20"
                        >
                            <ChevronLeft className="w-4 h-4" /> {readOnly ? "Close" : "Cancel"}
                        </Button>

                        <div className="flex gap-4">
                            {step > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    className="gap-2 font-bold px-6"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Back
                                </Button>
                            )}

                            {step < 6 ? (
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="gap-2 font-bold px-8 bg-primary hover:bg-primary/90 text-white"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </Button>
                            ) : readOnly ? (
                                <Button
                                    type="button"
                                    onClick={onCancel}
                                    className="gap-2 font-bold px-10 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                                >
                                    <CheckCircle2 className="w-4 h-4" /> Back to Growth
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="gap-2 font-bold px-10 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                                >
                                    <Save className="w-4 h-4" /> {initialData.id ? "Update Observation" : "Submit Observation"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

const MultiSelectSection = ({ title, items, field, formData, setMultiSelect, readOnly }: any) => (
    <Card className="shadow-xl">
        <CardHeader className="bg-primary/5 py-4">
            <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
                {items.map((item: string) => {
                    const id = `meta-${item.replace(/\s+/g, '-').toLowerCase()}`;
                    const isChecked = formData[field]?.includes(item);
                    return (
                        <div
                            key={item}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl border-2 transition-all group",
                                isChecked
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-muted-foreground/10 hover:border-primary/40",
                                readOnly ? "cursor-default" : "cursor-pointer"
                            )}
                        >
                            <Checkbox
                                id={id}
                                checked={isChecked}
                                onCheckedChange={(checked) => !readOnly && setMultiSelect(field, item, !!checked)}
                                disabled={readOnly}
                                className={cn(isChecked ? "border-primary bg-primary" : "border-muted-foreground/30")}
                            />
                            <Label htmlFor={id} className={cn("font-semibold text-sm cursor-pointer")}>{item}</Label>
                        </div>
                    );
                })}
            </div>
        </CardContent>
    </Card>
);

const DomainSection = ({ domain, readOnly, updateIndicatorRating, updateParameterNote, formData }: any) => {
    return (
        <Card className="shadow-2xl overflow-hidden border-none rounded-[2rem] bg-background/50 backdrop-blur-xl">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent py-8 px-10">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-3xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <BookOpen className="w-7 h-7" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-black tracking-tight">{domain.title}</CardTitle>
                        <CardDescription className="font-bold text-primary/60 uppercase tracking-[0.2em] text-xs">
                            Performance Standards & Look-fors
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-muted/50 text-muted-foreground">
                                <th className="p-4 text-left text-xs font-black uppercase tracking-widest border-b border-muted-foreground/10">Parameter</th>
                                <th className="p-4 text-left text-xs font-black uppercase tracking-widest border-b border-muted-foreground/10">Description</th>
                                <th className="p-4 text-left text-xs font-black uppercase tracking-widest border-b border-muted-foreground/10">Look Fors</th>
                                <th className="p-4 text-center text-xs font-black uppercase tracking-widest border-b border-muted-foreground/10">Yes</th>
                                <th className="p-4 text-center text-xs font-black uppercase tracking-widest border-b border-muted-foreground/10">Partially Seen</th>
                                <th className="p-4 text-center text-xs font-black uppercase tracking-widest border-b border-muted-foreground/10">Not Seen</th>
                                <th className="p-4 text-center text-xs font-black uppercase tracking-widest border-b border-muted-foreground/10">N/A</th>
                            </tr>
                        </thead>
                        <tbody>
                            {domain.subDomains.map((sd: any) => (
                                <React.Fragment key={sd.id}>
                                    <tr className="bg-primary/5">
                                        <td colSpan={7} className="p-4 font-black text-sm text-primary uppercase tracking-widest border-b border-primary/10">
                                            Sub Domain: {sd.title}
                                        </td>
                                    </tr>
                                    {sd.parameters.map((p: any) => {
                                        const currentRating = formData.domains
                                            ?.find((d: any) => d.domainId === domain.id)
                                            ?.subDomains.find((s: any) => s.id === sd.id)
                                            ?.parameters.find((param: any) => param.name === p.name);
                                        
                                        const rating = currentRating?.rating || "Not Observed";

                                        return (
                                            <React.Fragment key={p.name}>
                                                <tr className="hover:bg-muted/30 transition-colors border-b border-muted-foreground/5">
                                                    <td className="p-4 font-bold text-sm align-top w-[150px]">{p.name}</td>
                                                    <td className="p-4 text-sm text-muted-foreground align-top w-[200px]">{p.description}</td>
                                                    <td className="p-4 text-xs italic text-muted-foreground/70 align-top max-w-[300px]">
                                                        <div className="flex items-start gap-2">
                                                            <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                                            {p.lookFors}
                                                        </div>
                                                    </td>
                                                    {["Effective", "Developing", "Basic", "Not Observed"].map((r, i) => {
                                                        const label = r === "Effective" ? "Yes" : 
                                                                      r === "Developing" ? "Partially Seen" : 
                                                                      r === "Basic" ? "Not Seen" : "N/A";
                                                        
                                                        return (
                                                            <td key={r} className="p-4 text-center align-top">
                                                                <button
                                                                    type="button"
                                                                    disabled={readOnly}
                                                                    onClick={() => updateIndicatorRating(domain.id, sd.id, p.name, r as any)}
                                                                    className={cn(
                                                                        "w-6 h-6 rounded-lg border-2 transition-all mx-auto flex items-center justify-center",
                                                                        rating === r 
                                                                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                                                                            : "border-muted-foreground/20 hover:border-primary/40"
                                                                    )}
                                                                >
                                                                    {rating === r && <Check className="w-4 h-4" />}
                                                                </button>
                                                                <span className="text-[10px] font-bold mt-1 block uppercase text-muted-foreground/50">{label}</span>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                                {rating === "Developing" && (
                                                    <tr className="bg-amber-500/5">
                                                        <td colSpan={7} className="p-4">
                                                            <div className="flex items-start gap-3 bg-white/50 p-4 rounded-2xl border border-amber-500/20 shadow-inner">
                                                                <PenTool className="w-4 h-4 text-amber-600 mt-1" />
                                                                <div className="flex-1">
                                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2 block">What Needs Strengthening? (Max 1 Line)</Label>
                                                                    <Input 
                                                                        placeholder="Enter strengthening point..." 
                                                                        className="h-10 text-sm bg-transparent border-none focus-visible:ring-0 p-0"
                                                                        value={currentRating?.note || ""}
                                                                        onChange={(e) => {
                                                                            updateParameterNote(domain.id, sd.id, p.name, e.target.value);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};
