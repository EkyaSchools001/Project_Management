import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useFormFlow } from '@/hooks/useFormFlow';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Target, CheckCircle2, AlertCircle, Clock, FileText, Sparkles, TrendingUp, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { GoalSettingForm } from '@/components/GoalSettingForm';

const safeJsonParse = (str: any, fallback: any = {}) => {
    if (!str || str === 'null') return fallback;
    if (typeof str === 'object') return str || fallback;
    try {
        const parsed = JSON.parse(str);
        return parsed || fallback;
    } catch (e) {
        return fallback;
    }
};

const CORE_FRAMEWORK = [
    {
        id: 'A',
        section: 'Section A: Planning & Preparation - Live the Lesson',
        items: [
            'Demonstrating Knowledge of Content and Pedagogy',
            'Demonstrating Knowledge of Students',
            'Demonstrating Knowledge of Resources',
            'Designing A Microplan',
            'Using Student Assessments'
        ],
        evidenceId: 'A'
    },
    {
        id: 'B1',
        section: 'Section B: Classroom Practice - Care about Culture',
        items: [
            'Creating an Environment of Respect and Rapport',
            'Establishing a Culture for Learning',
            'Managing Classroom Procedures',
            'Managing Student behaviour'
        ],
        evidenceId: 'B1'
    },
    {
        id: 'B2',
        section: 'Section B: Classroom Practice - Instruct to Inspire',
        items: [
            'Communicating with Students',
            'Using Questioning and Discussion Techniques and Learning Tools',
            'Engages in student’s learning',
            'Demonstrating Flexibility and Responsiveness'
        ],
        evidenceId: 'B2'
    },
    {
        id: 'B3',
        section: 'Section B: Classroom Practice - Authentic Assessments',
        items: [
            'Using Assessments in Instructions'
        ],
        evidenceId: 'B3'
    },
    {
        id: 'B4',
        section: 'Section B: Classroom Practice - Engaging Environment',
        items: [
            'Organizing Physical Space',
            'Cleanliness',
            'Use of Boards'
        ],
        evidenceId: 'B4'
    },
    {
        id: 'C1',
        section: 'Section C: Professional Practice',
        items: [
            'Reflecting on Teaching',
            'Maintaining Accurate Records',
            'Communicating with Families',
            'Participating in a Professional Community',
            'Growing and Developing Professionally'
        ],
        evidenceId: 'C1'
    }
];

const PA_FRAMEWORK = [
    {
        id: 'A',
        section: 'Section A: Curriculum and Instruction',
        items: [
            'I clearly inform students about the learning objectives in every lesson.',
            'I give clear and explicit directions to my students.',
            'I share relevant examples and demonstrate techniques to students.',
            'I provide sufficient practice time and assistance to my students.',
            'I correct my student\'s skills and provide encouraging feedback.',
            'I state safety procedures for each activity and immediately address unsafe practices.'
        ],
        evidenceId: 'A'
    },
    {
        id: 'B',
        section: 'Section B: Culture and Environment',
        items: [
            'My transitions between activities is smooth and effective.',
            'I maintain student engagement throughout the class through voice and movement.',
            'My students are engaged in an activity at least 50% or more of the total class duration.',
            'I monitor students behaviour and actively correct it.',
            'I share rules with each procedure and state expectations of each activity clearly.'
        ],
        evidenceId: 'B'
    },
    {
        id: 'C',
        section: 'Section C: PA Classroom Procedures',
        items: [
            'Students participate in an instant warm-up activity to prepare their bodies and minds for the class.',
            'Students are assigned or choose their performance groups or partners if applicable.',
            'Students participate in a cool-down activity to help them recover from physical exertion.',
            'Students follow routines to wind up PA Class and to get back to their home class in an organized manner.'
        ],
        evidenceId: 'C'
    }
];

const PE_FRAMEWORK = [
    {
        id: 'A',
        section: 'Section A: Curriculum and Instruction',
        items: [
            'I clearly inform students about the learning objectives in every lesson.',
            'I give clear and explicit directions to my students.',
            'I share relevant examples and demonstrate techniques to students.',
            'I provide sufficient practice time and assistance to my students.',
            'I correct my student\'s skills and provide encouraging feedback.',
            'I state safety procedures for each activity and immediately address unsafe practices.'
        ],
        evidenceId: 'A'
    },
    {
        id: 'B',
        section: 'Section B: Culture and Environment',
        items: [
            'My transitions between activities is smooth and effective.',
            'I maintain student engagement throughout the class through voice and movement.',
            'My students are engaged in an activity at least 50% or more of the total class duration.',
            'I monitor students behaviour and actively correct it.',
            'I treat all my students with respect and in a fair manner.',
            'I keep equipment ready prior to the class and store excess equipment safely.',
            'I share rules with each procedure and state expectations of each activity clearly.'
        ],
        evidenceId: 'B'
    },
    {
        id: 'C',
        section: 'Section C: PE Classroom Procedures',
        items: [
            'Students engage in an instant warm up activity upon entering PE Room / Outdoor Ground.',
            'Students engage in a warm up activity to prepare for participation in moderate to vigorous physical activity.',
            'Students engage in a cool-down activity to recover from moderate to vigorous physical activity.',
            'Students follow routines to wind up PE Class and to get back to their home class in an organized manner.'
        ],
        evidenceId: 'C'
    }
];

const VA_FRAMEWORK = [
    {
        id: 'A',
        section: 'Section A: Planning & Preparation - Live the Lesson',
        items: [
            'Teacher displays extensive knowledge of the important concepts in the discipline and how these relate both to one another to other disciplines',
            'Teacher understands and teaches the mental tools and processes that will promote student understanding.',
            'Teacher is able to demonstrate the knowledge of various physical and digital resources.',
            'The teacher is able to create a lesson plan that is in aligned with the Master Plan'
        ],
        evidenceId: 'A'
    },
    {
        id: 'B1',
        section: 'Section B: Classroom Practice - Care about Culture',
        items: [
            'Teacher and student interactions are respectful.',
            'The classroom has a culture of respect for their peers.',
            'The classroom has a culture of respect for each other’s artwork.',
            'The classroom has a culture of respect for the resources.',
            'The classroom has a culture of learning reflected by the teacher communicating the passion for the subject, having high expectations and students taking pride in their work.',
            'The teacher is able to effectively manage classroom routines such as assigning of the groups, management of transitions in between activities, and management of resources and materials.'
        ],
        evidenceId: 'B1'
    },
    {
        id: 'B2',
        section: 'Section B: Classroom Practice - Instruct to Inspire',
        items: [
            'Teacher is able to communicate the goal and objective of the session to students.',
            'Teachers\' directions and procedures are clear and coherent for students.',
            'Teacher is able to integrate technology in class while using visual art and makery vocabulary.',
            'Teacher is able to use various tools and questioning techniques appropriate for a Visual Arts Classroom.',
            'Teacher is able to engage students in active learning with the help of demonstrations and design crit sessions.',
            'Teacher demonstrates flexibility and responsiveness along that is reflected in lesson adjustments as per the needs of the classroom, building on students responses and persevering their efforts in helping students who need support.'
        ],
        evidenceId: 'B2'
    },
    {
        id: 'B3',
        section: 'Section B: Classroom Practice - Authentic Assessments',
        items: [
            'Teacher uses student assessments results to plan future instructions.'
        ],
        evidenceId: 'B3'
    },
    {
        id: 'B4',
        section: 'Section B: Classroom Practice - Engaging Environment',
        items: [
            'Teacher keeps the visual art studio organised and free from clutter.',
            'Teachers and students use physical resources easily and skillfully.',
            'Student thinking is made visible through work produced on the pin up boards. Following boards are maintained- information wall, wall of questions, wall of images.',
            'Student work is displayed during crit and feedback sessions.'
        ],
        evidenceId: 'B4'
    },
    {
        id: 'C1',
        section: 'Section C: Professional Practice',
        items: [
            'Teacher maintains accurate records that include the student\'s portfolio, teacher\'s LP, parent- teacher records.',
            'Teachers participate in the professional community as reflected by maintaining cooperative relationships with peers, volunteering in various events, projects. etc.',
            'Teachers seek out opportunities for Teacher Development and make a systematic effort by enrolling themselves in courses related to visual arts, design and makery and attending training sessions.',
            'Teacher communicates and behaves professionally as reflected by a prompt response over email, updating classroom images and maintaining notes on what went right and what could be better.'
        ],
        evidenceId: 'C1'
    }
];

const SPECIALIST_TOOLS = [
    '321', 'Affirmations', 'All Eyes on Me', 'Brain Breaks (any 2)', 'Brainstorming',
    'Catch a Bubble (EY-2)', 'Choral Call', 'Circle Time (EY-2)', 'Circulate',
    'Cold Call', 'Concept Map', 'Countdown', 'Do Now', 'Entry Ticket', 'Exit Ticket',
    'Find somebody who', 'Give me Five (EY-2)', 'Glow & Grow', 'Good Things',
    'Grounding', 'Hand Signals', 'Help Now Strategies', 'HoH - Care', 'HoH - Grit',
    'I use to Think/Now I Know', 'KWL', 'Mingle', 'Morning Greetings', 'Parking Lot',
    'Post the Plan', 'Put on your Thinking Cap (Grades EY - 4)', 'Quick Draw - Quick Write',
    'Resourcing', 'Round Table Discussion', 'Shift & Stay', 'Show Call',
    'Social Contract', 'T-Chart', 'Talking sticks', 'Think-Pair-Share', 'Timeout',
    'Tracking', 'Turn & Talk', 'Wait Time'
];

const SPECIALIST_ROUTINES = [
    'Arrival Routine', 'Attendance Routine', 'Class Cleaning Routines',
    'Collection Routine', 'Departure Routine', 'Grouping Routine', 'Lining Up Strategies'
];

const RATING_LEVELS = ['Basic', 'Developing', 'Effective', 'Highly Effective'];

interface GoalWorkflowFormsProps {
    goal: any;
    role: 'TEACHER' | 'LEADER' | 'ADMIN';
    onComplete: () => void;
    onClose: () => void;
}

type Phase = 'SELF_REFLECTION' | 'GOAL_SETTING' | 'GOAL_COMPLETION' | 'VIEW' | 'MASTER_FORM';

export const GoalWorkflowForms = ({ goal, role, onComplete, onClose }: GoalWorkflowFormsProps) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { getRedirectionPath } = useFormFlow();
    const getInitialPhase = (r: string, status: string): Phase => {
        if (r === 'TEACHER') {
            if (status === 'SELF_REFLECTION_PENDING' || status === 'IN_PROGRESS') return 'SELF_REFLECTION';
            return 'VIEW';
        } else if (r === 'LEADER') {
            if (status === 'SELF_REFLECTION_SUBMITTED') return 'GOAL_SETTING';
            if (status === 'GOAL_SET') return 'GOAL_COMPLETION';
            return 'VIEW';
        } else if (r === 'ADMIN') {
            return 'MASTER_FORM';
        }
        return 'VIEW';
    };

    const [phase, setPhase] = useState<Phase>(() => getInitialPhase(role, goal.status));
    const [formData, setFormData] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [windows, setWindows] = useState<any[]>([]);
    const [formStep, setFormStep] = useState(0); // wizard step (growth module pattern)

    const getFrameworkType = (g: any, u: any) => {
        const email = g.teacherEmail?.toLowerCase() || u?.email?.toLowerCase() || '';
        const dept = g.teacherDepartment || u?.department || '';
        const title = g.title?.toLowerCase() || '';
        const category = g.category || '';

        const isPE = dept === 'Physical Education' || email.includes('.pe') || category === 'Physical Education' || title.includes('physical education') || title.includes('p.e');
        if (isPE) return 'PE';

        const isVA = dept === 'Visual Arts' || email.includes('.va') || category === 'Visual Arts' || title.includes('visual arts');
        if (isVA) return 'VA';

        const isPA = dept === 'Performing Arts' || dept === 'Arts' || email.includes('.art') || category === 'Performing Arts' || title.includes('performing arts') || title.includes('arts');
        if (isPA) return 'PA';

        if (g.academicType === 'CORE') return 'CORE';
        return 'SIMPLE';
    };

    useEffect(() => {
        fetchWindows();
        if (phase === 'VIEW') determinePhase();

        // 🚨 FIX: Only override formData if we don't have local unsaved changes for THIS goal
        // or if the goal ID has changed.
        const currentRefData = safeJsonParse(goal.selfReflectionForm);
        setFormData((prev: any) => {
            // If goal ID changed, reset everything
            if (prev?._lastGoalId !== goal.id) {
                return { ...currentRefData, _lastGoalId: goal.id };
            }
            // If we have local state, keep it (don't overwrite with server data while editing)
            return prev;
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [goal.id, goal.selfReflectionForm, phase]); // Refined dependencies

    const fetchWindows = async () => {
        try {
            const res = await api.get('/goal-windows');
            setWindows(res.data.data.windows);
        } catch (err) {
            console.error("Failed to fetch goal windows", err);
        }
    };

    const determinePhase = () => {
        setPhase(getInitialPhase(role, goal.status));
    };

    const isWindowOpen = (p: string) => {
        const win = windows.find(w => w.phase === p);
        if (!win || win.status === 'CLOSED') return false;
        const now = new Date();
        if (win.startDate && now < new Date(win.startDate)) return false;
        if (win.endDate && now > new Date(win.endDate)) return false;
        return true;
    };

    const validateStep = (currentStep: number): boolean => {
        if (phase !== 'SELF_REFLECTION') return true;
        
        const fwType = getFrameworkType(goal, user);
        const isPE = fwType === 'PE';
        const isPA = fwType === 'PA';
        const isVA = fwType === 'VA';
        const isCore = fwType === 'CORE';

        if (isCore) {
            const isFinalCoreStep = currentStep === CORE_FRAMEWORK.length;
            if (isFinalCoreStep) {
                const r = formData?.reflection;
                if (!r?.strengths || !r?.improvement || !r?.goal) {
                    toast.error("Please fill all mandatory fields (marked with *)");
                    return false;
                }
                return true;
            } else {
                const section = CORE_FRAMEWORK[currentStep];
                // Check ratings
                const missingRating = section.items.some(item => !formData?.ratings?.[item]);
                if (missingRating) {
                    toast.error(`Please provide ratings for all items in "${section.section.split(': ')[1]}"`);
                    return false;
                }
                // Check evidence
                if (!formData?.evidence?.[section.evidenceId]) {
                    toast.error(`Please provide evidence for "${section.section.split(': ')[1]}"`);
                    return false;
                }
                return true;
            }
        }

        if (isPA || isPE || isVA) {
            const framework = isPA ? PA_FRAMEWORK : isPE ? PE_FRAMEWORK : VA_FRAMEWORK;
            const isBlockStep = currentStep === 0;
            const isDynamicsStep = currentStep === framework.length + 1;
            const isFinalStep = currentStep === framework.length + 2;
            const sectionIdx = !isBlockStep && !isDynamicsStep && !isFinalStep ? currentStep - 1 : null;

            if (isBlockStep) {
                if (!formData?.block) {
                    toast.error("Please select a category block before proceeding");
                    return false;
                }
                return true;
            }

            if (sectionIdx !== null) {
                const section = framework[sectionIdx];
                const missingRating = section.items.some(item => !formData?.ratings?.[item]);
                if (missingRating) {
                    toast.error(`Please provide ratings for all items in "${section.section}"`);
                    return false;
                }
                if (!formData?.evidence?.[section.id]) {
                    toast.error(`Please provide evidence for "${section.section}"`);
                    return false;
                }
                return true;
            }

            if (isDynamicsStep) {
                if (!formData?.overallRating) {
                    toast.error("Please provide an overall classroom rating");
                    return false;
                }
                return true;
            }

            if (isFinalStep) {
                const r = formData?.reflection;
                if (!r?.strengths || !r?.improvement || !r?.goal) {
                    toast.error("Please fill all mandatory fields (marked with *)");
                    return false;
                }
                return true;
            }
        }

        if (fwType === 'SIMPLE') {
            if (!formData?.impact || !formData?.evidence || !formData?.text) {
                toast.error("Please fill all mandatory fields (Impact, Evidence, and Summary)");
                return false;
            }
            return true;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (role !== 'ADMIN' && !isWindowOpen(phase)) {
            toast.error("Submission window is currently closed");
            return;
        }

        if (phase === 'SELF_REFLECTION' && !validateStep(formStep)) {
            return;
        }

        setIsSubmitting(true);
        try {
            let endpoint = '';
            let payload = {};

            if (phase === 'SELF_REFLECTION') {
                endpoint = `/goals/${goal.id}/self-reflection`;
                payload = { reflectionData: formData };
            } else if (phase === 'GOAL_SETTING') {
                endpoint = `/goals/${goal.id}/goal-setting`;
                payload = { settingData: formData };
            } else if (phase === 'GOAL_COMPLETION') {
                endpoint = `/goals/${goal.id}/goal-completion`;
                payload = { completionData: formData, status: formData.status || 'GOAL_COMPLETED' };
            }

            const res = await api.post(endpoint, payload);
            if (res.data.status === 'success') {
                toast.success("Submitted successfully");

                if (user?.role) {
                    const formName = phase === 'SELF_REFLECTION' ? 'GOAL_REFLECTION'
                        : phase === 'GOAL_SETTING' ? 'GOAL_SETTING'
                            : 'GOAL_COMPLETION';
                    const redirectPath = getRedirectionPath(formName, user.role);
                    if (redirectPath) {
                        navigate(redirectPath);
                        return;
                    }
                }

                onComplete();
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to submit");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderContent = () => {
        if (phase === 'MASTER_FORM') {
            return (
                <ScrollArea className="h-[65vh] w-full">
                    <GoalSettingForm
                        userCampus={user?.campusId}
                        isLeader={role === 'LEADER'}
                        teachers={[{ id: goal.teacherId || "temp-id", name: goal.teacher || "Unknown", email: goal.teacherEmail || "", academics: goal.academicType || "CORE" }]}
                        defaultCoachName={goal.assignedBy || "Admin"}
                        initialData={{
                            educatorName: goal.teacher,
                            teacherEmail: goal.teacherEmail || "",
                            coachName: goal.assignedBy || "Admin",
                            campus: goal.campus || "HQ",
                            dateOfGoalSetting: goal.createdAt ? new Date(goal.createdAt) : new Date(),
                            goalForYear: goal.title,
                            reasonForGoal: goal.description || "Defined during goal setting",
                            actionStep: goal.actionStep || "Initial planning",
                            pillarTag: goal.category || goal.pillar || "Professional Practice",
                            goalEndDate: goal.dueDate ? new Date(goal.dueDate) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                            awareOfProcess: "yes",
                            awareOfFramework: "yes",
                            reflectionCompleted: "yes",
                            evidenceProvided: "yes",
                            ...safeJsonParse(goal.goalSettingForm)
                        }}
                        onSubmit={async (data) => {
                            if (role !== 'ADMIN') return;
                            try {
                                setIsSubmitting(true);
                                const payload = {
                                    title: data.goalForYear || goal.title,
                                    description: data.reasonForGoal !== undefined ? data.reasonForGoal : goal.description,
                                    actionStep: data.actionStep !== undefined ? data.actionStep : goal.actionStep,
                                    pillar: data.pillarTag || goal.pillar,
                                    category: data.pillarTag || goal.category,
                                    campus: data.campus || goal.campus,
                                    dueDate: data.goalEndDate ? new Date(data.goalEndDate).toISOString() : goal.dueDate,
                                    goalSettingForm: JSON.stringify(data)
                                };
                                const res = await api.patch(`/goals/${goal.id}`, payload);
                                if (res.data?.status === 'success' || res.status === 200) {
                                    toast.success(`Goal master form updated for ${goal.teacher}.`);

                                    if (user?.role) {
                                        const redirectPath = getRedirectionPath('GOAL_SETTING', user.role);
                                        if (redirectPath) {
                                            navigate(redirectPath);
                                            return;
                                        }
                                    }

                                    onComplete();
                                }
                            } catch (err) {
                                toast.error("Failed to update goal via master form.");
                            } finally {
                                setIsSubmitting(false);
                            }
                        }}
                        onCancel={onClose}
                    />
                </ScrollArea>
            );
        }

        if (phase === 'SELF_REFLECTION') {
            const fwType = getFrameworkType(goal, user);
            const isPE = fwType === 'PE';
            const isPA = fwType === 'PA';
            const isVA = fwType === 'VA';
            const isCore = fwType === 'CORE';

            if (isCore) {
                const isFinalCoreStep = formStep === CORE_FRAMEWORK.length;
                const coreSection = !isFinalCoreStep ? CORE_FRAMEWORK[formStep] : null;
                return (
                    <div className="space-y-6">
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-primary shadow-[0_8px_20px_rgba(234,16,74,0.25)] text-white">
                                        {isFinalCoreStep ? <CheckCircle2 className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-foreground tracking-tight">
                                            {isFinalCoreStep ? 'Final Reflection' : coreSection?.section.split(': ')[1] || coreSection?.section}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] font-bold capitalize tracking-widest border-primary/20 text-primary">
                                                {isFinalCoreStep ? 'Review Phase' : `Step ${formStep + 1} of ${CORE_FRAMEWORK.length}`}
                                            </Badge>
                                            <div className="flex gap-1">
                                                {CORE_FRAMEWORK.map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={cn(
                                                            "h-1 rounded-full transition-all duration-500",
                                                            i < formStep ? "w-4 bg-emerald-500" : i === formStep ? "w-8 bg-primary shadow-[0_0_10px_rgba(234,16,74,0.3)]" : "w-4 bg-muted"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            !isFinalCoreStep && coreSection ? (
                                <>
                                    <div className="grid gap-3">
                                        {coreSection.items.map((item, itemIdx) => (
                                            <div key={itemIdx} className="p-4 rounded-xl bg-muted/30 border border-muted-foreground/10 hover:border-primary/20 transition-colors space-y-3">
                                                <p className="text-sm font-semibold text-foreground/90">{item}</p>
                                                <RadioGroup
                                                    name={`core-ratings-${coreSection.id}-${itemIdx}`}
                                                    onValueChange={(val) => setFormData((prev: any) => ({ ...(prev || {}), ratings: { ...(prev?.ratings || {}), [item]: val } }))}
                                                    value={formData?.ratings?.[item] || ''}
                                                    className="flex flex-wrap gap-2 pt-1"
                                                >
                                                    {RATING_LEVELS.map((level, levelIdx) => {
                                                        const sId = `core-${coreSection.id}-${itemIdx}-${levelIdx}`;
                                                        return (
                                                            <div key={levelIdx} className="flex items-center space-x-2 bg-background px-3 py-1.5 rounded-full border border-muted hover:border-primary/30 transition-colors cursor-pointer">
                                                                <RadioGroupItem value={level} id={sId} className="w-4 h-4" />
                                                                <Label htmlFor={sId} className="text-xs cursor-pointer font-medium">{level}</Label>
                                                            </div>
                                                        );
                                                    })}
                                                </RadioGroup>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`core-evidence-${coreSection.id}`} className="text-xs font-bold text-muted-foreground capitalize flex items-center gap-1.5">
                                            <FileText className="w-3.5 h-3.5" /> Evidence for {coreSection.evidenceId}
                                        </Label>
                                        <Textarea
                                            id={`core-evidence-${coreSection.id}`}
                                            name={`core-evidence-${coreSection.id}`}
                                            placeholder="Provide specific evidence to support your ratings..."
                                            className="min-h-[90px] rounded-xl"
                                            value={formData?.evidence?.[coreSection.evidenceId] || ''}
                                            onChange={(e) => {
                                                const newEvidence = { ...(formData?.evidence || {}), [coreSection.evidenceId]: e.target.value };
                                                setFormData((prev: any) => ({ ...(prev || {}), evidence: newEvidence }));
                                            }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    {[
                                        { id: 'strengths', l: 'What are your strengths? *' },
                                        { id: 'improvement', l: 'What do you need to improve on? *' },
                                        { id: 'goal', l: 'What goal would you like to set for yourself? *' },
                                        { id: 'anythingElse', l: "Anything else you'd like to share" }
                                    ].map(field => {
                                        const fieldId = `core-reflection-${field.id}`;
                                        return (
                                            <div key={field.id} className="space-y-2">
                                                <Label htmlFor={fieldId} className="text-xs font-bold">{field.l}</Label>
                                                <Textarea
                                                    id={fieldId}
                                                    name={fieldId}
                                                    className="min-h-[80px] rounded-xl bg-background"
                                                    value={formData?.reflection?.[field.id] || ''}
                                                    onChange={(e) => setFormData((prev: any) => ({ ...(prev || {}), reflection: { ...(prev?.reflection || {}), [field.id]: e.target.value } }))}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        }
                    </div >
                );
            }

            if (isPA || isPE || isVA) {
                const framework = isPA ? PA_FRAMEWORK : isPE ? PE_FRAMEWORK : VA_FRAMEWORK;
                const frameworkName = isPA ? 'Performing Arts' : isPE ? 'Physical Education' : 'Visual Arts';
                const ratingOptions = isVA ? ['Yes', 'No', 'Not Applicable'] : ['Yes', 'No'];

                // Steps: 0=block, 1..N=sections, N+1=classroom dynamics, N+2=final reflection
                const isBlockStep = formStep === 0;
                const isDynamicsStep = formStep === framework.length + 1;
                const isFinalStep = formStep === framework.length + 2;
                const sectionIdx = !isBlockStep && !isDynamicsStep && !isFinalStep ? formStep - 1 : null;
                const currentSection = sectionIdx !== null ? framework[sectionIdx] : null;

                const stepLabel = isBlockStep ? 'Grade Level'
                    : isDynamicsStep ? 'Classroom Dynamics'
                        : isFinalStep ? 'Final Reflection'
                            : `Section ${sectionIdx !== null ? sectionIdx + 1 : ''}`;

                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg border border-primary/20">
                                {isBlockStep ? '⊞' : isFinalStep ? '✓' : isDynamicsStep ? '⚡' : (sectionIdx ?? 0) + 1}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground capitalize tracking-wider">
                                    {frameworkName} Track · {stepLabel}
                                </p>
                                <p className="font-semibold text-foreground">
                                    {isBlockStep ? 'Select your category block'
                                        : isDynamicsStep ? 'Classroom Dynamics & Tools'
                                            : isFinalStep ? 'Strengths, Goals & Improvements'
                                                : currentSection?.section}
                                </p>
                            </div>
                        </div>

                        {isBlockStep && (
                            <div className="space-y-3">
                                <Label htmlFor="grade-level-select" className="text-xs font-bold text-muted-foreground capitalize">Select your current category block *</Label>
                                <RadioGroup
                                    id="grade-level-select"
                                    name="grade-level"
                                    onValueChange={(b) => setFormData((prev: any) => ({ ...(prev || {}), block: b }))}
                                    value={formData?.block || ''}
                                    className="flex flex-wrap gap-3 pt-1"
                                >
                                    {['Early Years', 'Primary', 'Middle', 'Senior', 'Whole School'].map((b, bIdx) => {
                                        const bId = `block-${bIdx}`;
                                        const isSelected = formData?.block === b;
                                        return (
                                            <div key={bIdx} className="flex items-center">
                                                <RadioGroupItem value={b} id={bId} className="sr-only" />
                                                <Label
                                                    htmlFor={bId}
                                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-primary/10 border-primary/50 font-bold text-primary' : 'bg-muted/30 border-muted-foreground/10 hover:border-primary/20'}`}
                                                >
                                                    <span className={`w-3 h-3 rounded-full border-2 ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'}`} />
                                                    <span className="text-sm">{b}</span>
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </RadioGroup>
                            </div>
                        )}

                        {currentSection && (
                            <>
                                <div className="grid gap-3">
                                    {currentSection.items.map((item, itemIdx) => (
                                        <div key={itemIdx} className="p-4 rounded-xl bg-muted/30 border border-muted-foreground/10 hover:border-primary/20 transition-colors space-y-3">
                                            <p className="text-sm font-semibold text-foreground/90">{item}</p>
                                            <RadioGroup
                                                name={`spec-ratings-${currentSection.id}-${itemIdx}`}
                                                onValueChange={(val) => setFormData((prev: any) => ({ ...(prev || {}), ratings: { ...(prev?.ratings || {}), [item]: val } }))}
                                                value={formData?.ratings?.[item] || ''}
                                                className="flex flex-wrap gap-2 pt-1"
                                            >
                                                {RATING_LEVELS.map((level, levelIdx) => {
                                                    const sId = `spec-${currentSection.id}-${itemIdx}-${levelIdx}`;
                                                    return (
                                                        <div key={levelIdx} className="flex items-center space-x-2 bg-background px-3 py-1.5 rounded-full border border-muted hover:border-primary/30 transition-colors cursor-pointer">
                                                            <RadioGroupItem value={level} id={sId} className="w-4 h-4" />
                                                            <Label htmlFor={sId} className="text-xs cursor-pointer font-medium">{level}</Label>
                                                        </div>
                                                    );
                                                })}
                                            </RadioGroup>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`spec-evidence-${currentSection.id}`} className="text-xs font-bold text-muted-foreground capitalize flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5" /> Evidence for {currentSection.id}
                                    </Label>
                                    <Textarea
                                        id={`spec-evidence-${currentSection.id}`}
                                        name={`spec-evidence-${currentSection.id}`}
                                        placeholder="Provide specific evidence..."
                                        className="min-h-[80px] rounded-xl"
                                        value={formData?.evidence?.[currentSection.id] || ''}
                                        onChange={(e) => {
                                            const newEvidence = { ...(formData?.evidence || {}), [currentSection.id]: e.target.value };
                                            setFormData((prev: any) => ({ ...(prev || {}), evidence: newEvidence }));
                                        }}
                                    />
                                </div>
                            </>
                        )}

                        {isDynamicsStep && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="overall-rating-radio" className="text-xs font-bold">How would you rate your classroom overall?</Label>
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <span className="text-xs text-muted-foreground font-medium">Basic</span>
                                        <RadioGroup
                                            id="overall-rating-radio"
                                            name="overall-rating"
                                            className="flex gap-3"
                                            onValueChange={(val) => setFormData((prev: any) => ({ ...(prev || {}), overallRating: val }))}
                                            value={formData?.overallRating || ''}
                                        >
                                            {['1', '2', '3', '4'].map((r, rIdx) => (
                                                <div key={rIdx} className="flex flex-col items-center gap-1 bg-background p-2 rounded-xl border border-muted hover:border-primary/30 transition-colors cursor-pointer min-w-[48px]">
                                                    <RadioGroupItem value={r} id={`rating-${rIdx}`} />
                                                    <Label htmlFor={`rating-${rIdx}`} className="text-xs font-bold cursor-pointer">{r}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                        <span className="text-xs text-primary font-bold">Highly Effective</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold">Tools you actively use in your classroom:</Label>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-1">
                                        {SPECIALIST_TOOLS.map((tool, tIdx) => (
                                            <div key={tIdx} className="flex items-center gap-2 bg-muted/30 p-2 px-3 rounded-lg border border-muted hover:border-primary/20 transition-colors">
                                                <Checkbox
                                                    id={`tool-${tIdx}`}
                                                    name={`tool-${tool}`}
                                                    checked={(formData?.tools || []).includes(tool)}
                                                    onCheckedChange={(checked) => {
                                                        setFormData((prev: any) => {
                                                            const tools = prev?.tools || [];
                                                            return { ...(prev || {}), tools: checked ? [...tools, tool] : tools.filter((t: string) => t !== tool) };
                                                        });
                                                    }}
                                                />
                                                <Label htmlFor={`tool-${tIdx}`} className="text-xs cursor-pointer font-medium leading-tight">{tool}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold">Routines you actively use in your classroom:</Label>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-1">
                                        {SPECIALIST_ROUTINES.map((routine, rIdx) => (
                                            <div key={rIdx} className="flex items-center gap-2 bg-muted/30 p-2 px-3 rounded-lg border border-muted hover:border-primary/20 transition-colors">
                                                <Checkbox
                                                    id={`routine-${rIdx}`}
                                                    name={`routine-${routine}`}
                                                    checked={(formData?.routines || []).includes(routine)}
                                                    onCheckedChange={(checked) => {
                                                        setFormData((prev: any) => {
                                                            const routines = prev?.routines || [];
                                                            return { ...(prev || {}), routines: checked ? [...routines, routine] : routines.filter((r: string) => r !== routine) };
                                                        });
                                                    }}
                                                />
                                                <Label htmlFor={`routine-${rIdx}`} className="text-xs cursor-pointer font-medium leading-tight">{routine}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {isFinalStep && (
                            <div className="space-y-4">
                                {[
                                    { id: 'strengths', l: isPE ? 'What are your strengths as a PE educator? *' : isVA ? 'What are your strengths as a visual arts educator? *' : 'What are your strengths? *' },
                                    { id: 'improvement', l: 'What do you need to improve on? *' },
                                    { id: 'goal', l: 'What goal would you like to set for yourself? *' },
                                    { id: 'anythingElse', l: "Anything else you'd like to share" }
                                ].map(field => {
                                    const fieldId = `spec-reflection-${field.id}`;
                                    return (
                                        <div key={field.id} className="space-y-2">
                                            <Label htmlFor={fieldId} className="text-xs font-bold">{field.l}</Label>
                                            <Textarea
                                                id={fieldId}
                                                name={fieldId}
                                                className="min-h-[80px] rounded-xl bg-background"
                                                value={formData?.reflection?.[field.id] || ''}
                                                onChange={(e) => setFormData((prev: any) => ({ ...(prev || {}), reflection: { ...(prev?.reflection || {}), [field.id]: e.target.value } }))}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            }

            return (
                <div className="space-y-4">
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                        <p className="text-sm font-medium">Goal: {goal.title}</p>
                        <Badge variant="secondary" className="mt-2 text-[10px] capitalize">Non-Core Track</Badge>
                    </div>

                    <Card className="  shadow-sm bg-primary/5 overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold capitalize text-primary">Non-Core Self-Reflection</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="simple-impact" className="text-xs font-bold text-muted-foreground capitalize">Professional Contribution</Label>
                                <Textarea
                                    id="simple-impact"
                                    name="simple-impact"
                                    placeholder="Describe your professional contribution and collaboration..."
                                    className="min-h-[100px] bg-background"
                                    value={formData?.impact || ''}
                                    onChange={(e) => setFormData((prev: any) => ({ ...(prev || {}), impact: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="simple-evidence" className="text-xs font-bold text-muted-foreground capitalize">Skill Development & Alignment</Label>
                                <Textarea
                                    id="simple-evidence"
                                    name="simple-evidence"
                                    placeholder="Describe skills developed and alignment with school needs..."
                                    className="min-h-[100px] bg-background"
                                    value={formData?.evidence || ''}
                                    onChange={(e) => setFormData((prev: any) => ({ ...(prev || {}), evidence: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="simple-summary" className="text-xs font-bold text-muted-foreground capitalize">Summary</Label>
                                <Textarea
                                    id="simple-summary"
                                    name="simple-summary"
                                    placeholder="Final summary and any additional support required..."
                                    className="min-h-[120px] bg-background"
                                    value={formData?.text || ''}
                                    onChange={(e) => setFormData((prev: any) => ({ ...(prev || {}), text: e.target.value }))}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        const renderDetailedReflection = () => {
            if (!goal.selfReflectionForm) return null;
            const refData = safeJsonParse(goal.selfReflectionForm);

            const fwType = getFrameworkType(goal, user);
            const isPE = fwType === 'PE';
            const isVA = fwType === 'VA';
            const isPA = fwType === 'PA';
            const isCore = fwType === 'CORE';

            if (isPA || isPE || isVA) {
                const framework = isPA ? PA_FRAMEWORK : isPE ? PE_FRAMEWORK : VA_FRAMEWORK;
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-primary/5 p-4 rounded-xl border border-primary/10">
                            <div>
                                <p className="text-[10px] font-bold text-primary capitalize">Category Block</p>
                                <p className="text-sm font-semibold">{refData.block}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-primary capitalize">Overall Rating</p>
                                <Badge className="bg-primary text-white">{refData.overallRating || 'N/A'}/4</Badge>
                            </div>
                        </div>

                        {framework.map(section => (
                            <Card key={section.id} className="shadow-sm bg-muted/20 overflow-hidden">
                                <CardHeader className="bg-primary/5 pb-2">
                                    <CardTitle className="text-xs font-bold capitalize tracking-tight text-primary">
                                        {section.section}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3">
                                    <div className="grid gap-2">
                                        {section.items.map(item => (
                                            <div key={item} className="flex justify-between items-center text-[11px] p-2 bg-background rounded border border-muted-foreground/5 shadow-sm">
                                                <span className="font-medium max-w-[80%]">{item}</span>
                                                <Badge variant={refData.ratings?.[item] === 'Yes' ? 'default' : 'outline'} className="text-[10px]">
                                                    {refData.ratings?.[item] || 'N/A'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                                        <p className="text-[10px] font-bold text-primary/70 capitalize mb-1 flex items-center gap-1.5">
                                            <FileText className="w-3 h-3" /> Evidence ({section.id})
                                        </p>
                                        <p className="text-xs italic leading-relaxed text-muted-foreground line-clamp-3">
                                            {refData.evidence?.[section.id] || 'No evidence provided'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <Card className="bg-primary/5">
                            <CardContent className="p-4 space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-primary uppercase mb-2">Classroom Tools Used</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(refData.tools || []).map((tool: string) => (
                                            <Badge key={tool} variant="outline" className="bg-background text-[10px]">{tool}</Badge>
                                        ))}
                                        {(!refData.tools || refData.tools.length === 0) && <p className="text-xs italic text-muted-foreground">None listed</p>}
                                    </div>
                                </div>
                                <Separator className="bg-primary/10" />
                                <div>
                                    <p className="text-[10px] font-bold text-primary uppercase mb-2">Active Routines</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(refData.routines || []).map((routine: string) => (
                                            <Badge key={routine} variant="outline" className="bg-background text-[10px]">{routine}</Badge>
                                        ))}
                                        {(!refData.routines || refData.routines.length === 0) && <p className="text-xs italic text-muted-foreground">None listed</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-4 pt-4">
                            {[
                                { l: 'Strengths', v: refData.reflection?.strengths, icon: <Sparkles className="w-3 h-3" /> },
                                { l: 'Areas for Improvement', v: refData.reflection?.improvement, icon: <TrendingUp className="w-3 h-3" /> },
                                { l: 'Set Goal', v: refData.reflection?.goal, icon: <Target className="w-3 h-3" /> },
                                { l: 'Additional Notes', v: refData.reflection?.anythingElse, icon: <MessageSquare className="w-3 h-3" /> }
                            ].map(item => (
                                <Card key={item.l} className="bg-primary/5 border border-primary/10">
                                    <CardContent className="p-4 space-y-2">
                                        <p className="text-[10px] font-bold text-primary uppercase flex items-center gap-1.5">
                                            {item.icon} {item.l}
                                        </p>
                                        <p className="text-xs leading-relaxed font-medium">
                                            {item.v || 'N/A'}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                );
            }

            if (isCore) {
                return (
                    <div className="space-y-6">
                        {CORE_FRAMEWORK.map(section => (
                            <Card key={section.id} className="shadow-sm bg-muted/20 overflow-hidden">
                                <CardHeader className="bg-primary/5 pb-2">
                                    <CardTitle className="text-xs font-bold capitalize tracking-tight text-primary">
                                        {section.section}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3">
                                    <div className="grid gap-2">
                                        {section.items.map(item => (
                                            <div key={item} className="flex justify-between items-center text-[11px] p-2 bg-background rounded border border-muted-foreground/5 shadow-sm">
                                                <span className="font-medium">{item}</span>
                                                <Badge variant="outline" className="text-[10px] bg-background">
                                                    {refData.ratings?.[item] || 'Not Rated'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                                        <p className="text-[10px] font-bold text-primary/70 capitalize mb-1 flex items-center gap-1.5">
                                            <FileText className="w-3 h-3" /> Evidence ({section.evidenceId})
                                        </p>
                                        <p className="text-xs italic leading-relaxed text-muted-foreground line-clamp-3">
                                            {refData.evidence?.[section.evidenceId] || 'No evidence provided'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <div className="grid md:grid-cols-2 gap-4 pt-4">
                            {[
                                { l: 'Strengths', v: refData.reflection?.strengths, icon: <Sparkles className="w-3 h-3" /> },
                                { l: 'Areas for Improvement', v: refData.reflection?.improvement, icon: <TrendingUp className="w-3 h-3" /> },
                                { l: 'Set Goal', v: refData.reflection?.goal, icon: <Target className="w-3 h-3" /> },
                                { l: 'Additional Notes', v: refData.reflection?.anythingElse, icon: <MessageSquare className="w-3 h-3" /> }
                            ].map(item => (
                                <Card key={item.l} className="bg-primary/5 border border-primary/10">
                                    <CardContent className="p-4 space-y-2">
                                        <p className="text-[10px] font-bold text-primary uppercase flex items-center gap-1.5">
                                            {item.icon} {item.l}
                                        </p>
                                        <p className="text-xs leading-relaxed font-medium">
                                            {item.v || 'N/A'}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                );
            }

            return (
                <div className="space-y-3">
                    {['Impact', 'Evidence', 'Text'].map(field => (
                        <div key={field} className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-[9px] font-bold text-muted-foreground capitalize mb-1">{field}</p>
                            <p className="text-xs italic">"{refData[field.toLowerCase()] || 'N/A'}"</p>
                        </div>
                    ))}
                </div>
            );
        };

        if (phase === 'GOAL_SETTING') {
            return (
                <ScrollArea className="h-[75vh] pr-4">
                    <div className="space-y-8">
                        {/* Reference Section for HOS */}
                        <div className="space-y-4 bg-muted/20 p-6 rounded-2xl border border-muted-foreground/10">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
                                <FileText className="w-4 h-4" />
                                Review Teacher's Self-Reflection
                            </h3>
                            <div className="bg-background/50 rounded-xl border border-muted p-4">
                                {renderDetailedReflection()}
                            </div>
                        </div>

                        <Separator className="my-8" />

                        {/* HOS Formal Goal Setting Form */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-primary hover:bg-primary/90">Step 6: HOS Goal Setting</Badge>
                                <span className="text-xs font-medium text-muted-foreground italic">Fill the formal goal setting details below</span>
                            </div>

                            <div className="bg-background rounded-2xl border border-primary/20 shadow-sm overflow-hidden">
                                <GoalSettingForm
                                    userCampus={user?.campusId}
                                    isLeader={role === 'LEADER'}
                                    teachers={[{ id: goal.teacherId || "temp-id", name: goal.teacher || "Unknown", email: goal.teacherEmail || "", academics: goal.academicType || "CORE" }]}
                                    defaultCoachName={user?.fullName || "Coach"}
                                    initialData={{
                                        educatorName: goal.teacher,
                                        teacherEmail: goal.teacherEmail || "",
                                        coachName: user?.fullName || "Coach",
                                        campus: goal.campus || "HQ",
                                        dateOfGoalSetting: new Date(),
                                        goalForYear: goal.title,
                                        reasonForGoal: goal.description || "",
                                        actionStep: goal.actionStep || "",
                                        pillarTag: goal.category || goal.pillar || "Professional Practice",
                                        goalEndDate: goal.dueDate ? new Date(goal.dueDate) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                                        awareOfProcess: "yes",
                                        awareOfFramework: "yes",
                                        reflectionCompleted: "yes",
                                        evidenceProvided: "yes",
                                        ...safeJsonParse(goal.goalSettingForm)
                                    }}
                                    onSubmit={async (data) => {
                                        try {
                                            setIsSubmitting(true);
                                            const payload = {
                                                settingData: data
                                            };
                                            const res = await api.post(`/goals/${goal.id}/goal-setting`, payload);
                                            if (res.data?.status === 'success') {
                                                toast.success(`HOS Goal Setting completed for ${goal.teacher}.`);
                                                onComplete();
                                            }
                                        } catch (err) {
                                            toast.error("Failed to complete goal setting.");
                                        } finally {
                                            setIsSubmitting(false);
                                        }
                                    }}
                                    onCancel={onClose}
                                />
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            );
        }

        if (phase === 'GOAL_COMPLETION') {
            return (
                <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-6">
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge className="bg-emerald-600">Final Evaluation</Badge>
                                <span className="text-xs font-medium text-emerald-800">Phase 3: Goal Outcome</span>
                            </div>

                            <div className="space-y-4">
                                <div className="p-3 bg-white rounded-lg border border-emerald-100 shadow-sm">
                                    <p className="text-[10px] font-bold text-emerald-700 uppercase mb-1">Expectations Set Previously (Action Step):</p>
                                    <p className="text-xs font-medium">{goal.actionStep || safeJsonParse(goal.goalSettingForm).actionStep || '-'}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hos-final-feedback" className="text-xs font-bold text-emerald-900">Final Feedback & Narrative</Label>
                                    <Textarea
                                        id="hos-final-feedback"
                                        name="hos-final-feedback"
                                        placeholder="Final assessment of teacher's accomplishments..."
                                        className="min-h-[120px] text-xs bg-white"
                                        value={formData?.text || ''}
                                        onChange={(e) => setFormData((prev: any) => ({ ...(prev || {}), text: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-emerald-900">Final Goal Status</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { id: 'GOAL_COMPLETED', label: 'Goal Completed', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200' },
                                            { id: 'PARTIALLY_MET', label: 'Partially Met', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200' },
                                            { id: 'NOT_MET', label: 'Not Met', color: 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200' }
                                        ].map(s => (
                                            <Button
                                                key={s.id}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setFormData((prev: any) => ({ ...(prev || {}), status: s.id }))}
                                                className={cn(
                                                    "text-[10px] h-8 font-bold",
                                                    formData?.status === s.id ? s.color : "opacity-60"
                                                )}
                                            >
                                                {s.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4 opacity-80 scale-[0.98] origin-top">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                Reference: Teacher's Reflection
                            </h3>
                            {renderDetailedReflection()}
                        </div>
                    </div>
                </ScrollArea>
            );
        }

        // VIEW mode
        const refData = safeJsonParse(goal.selfReflectionForm);
        const fwType = getFrameworkType(goal, user);
        const isPE = fwType === 'PE';
        const isPA = fwType === 'PA';
        const isVA = fwType === 'VA';
        const framework = isPA ? PA_FRAMEWORK : isPE ? PE_FRAMEWORK : isVA ? VA_FRAMEWORK : null;
        const isComplex = !!(refData?.ratings) || !!framework;

        return (
            <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6">
                    {goal.selfReflectionForm && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-2 text-xs font-bold text-primary capitalize">
                                <Badge>Teacher Reflection</Badge>
                                {isComplex ? "Ekya Danielson Framework" : "Simple Track"}
                            </div>

                            {isComplex && refData.block && framework ? (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-primary/5 p-4 rounded-xl border border-primary/10">
                                        <div>
                                            <p className="text-[10px] font-bold text-primary capitalize">Category Block</p>
                                            <p className="text-sm font-semibold">{refData.block}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-primary capitalize">Overall Rating</p>
                                            <Badge className="bg-primary text-white">{refData.overallRating || 'N/A'}/4</Badge>
                                        </div>
                                    </div>

                                    {framework.map(section => (
                                        <Card key={section.id} className="shadow-sm bg-muted/20 overflow-hidden">
                                            <CardHeader className="bg-primary/5 pb-2">
                                                <CardTitle className="text-xs font-bold capitalize tracking-tight text-primary">
                                                    {section.section}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-4 space-y-4">
                                                <div className="grid gap-2">
                                                    {section.items.map(item => (
                                                        <div key={item} className="flex justify-between items-center text-[11px] p-2 bg-background rounded border border-muted-foreground/5 shadow-sm">
                                                            <span className="font-medium max-w-[80%]">{item}</span>
                                                            <Badge variant={refData.ratings?.[item] === 'Yes' ? 'default' : 'outline'} className="text-[10px]">
                                                                {refData.ratings?.[item] || 'N/A'}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                                                    <p className="text-[10px] font-bold text-primary/70 capitalize mb-1 flex items-center gap-1.5">
                                                        <FileText className="w-3 h-3" /> Evidence ({section.id})
                                                    </p>
                                                    <p className="text-xs italic leading-relaxed text-muted-foreground">
                                                        {refData.evidence?.[section.id] || 'No evidence provided'}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    <Card className="  bg-primary/5">
                                        <CardContent className="p-4 space-y-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-primary capitalize mb-2">Classroom Tools Used</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {(refData.tools || []).map((tool: string) => (
                                                        <Badge key={tool} variant="outline" className="bg-background text-[10px]">{tool}</Badge>
                                                    ))}
                                                    {(!refData.tools || refData.tools.length === 0) && <p className="text-xs italic text-muted-foreground">None listed</p>}
                                                </div>
                                            </div>
                                            <Separator className="bg-primary/10" />
                                            <div>
                                                <p className="text-[10px] font-bold text-primary capitalize mb-2">Active Routines</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {(refData.routines || []).map((routine: string) => (
                                                        <Badge key={routine} variant="outline" className="bg-background text-[10px]">{routine}</Badge>
                                                    ))}
                                                    {(!refData.routines || refData.routines.length === 0) && <p className="text-xs italic text-muted-foreground">None listed</p>}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="grid md:grid-cols-2 gap-4 pt-4">
                                        {[
                                            { l: 'Strengths', v: refData.reflection?.strengths, icon: <Sparkles className="w-3 h-3" /> },
                                            { l: 'Areas for Improvement', v: refData.reflection?.improvement, icon: <TrendingUp className="w-3 h-3" /> },
                                            { l: 'Set Goal', v: refData.reflection?.goal, icon: <Target className="w-3 h-3" /> },
                                            { l: 'Additional Notes', v: refData.reflection?.anythingElse, icon: <MessageSquare className="w-3 h-3" /> }
                                        ].map(item => (
                                            <Card key={item.l} className="bg-primary/5 border border-primary/10">
                                                <CardContent className="p-4 space-y-2">
                                                    <p className="text-[10px] font-bold text-primary capitalize flex items-center gap-1.5">
                                                        {item.icon} {item.l}
                                                    </p>
                                                    <p className="text-xs leading-relaxed font-medium">
                                                        {item.v || 'N/A'}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ) : isComplex && !refData.block ? (
                                <div className="space-y-6">
                                    {CORE_FRAMEWORK.map(section => (
                                        <Card key={section.id} className="shadow-sm bg-muted/20 overflow-hidden">
                                            <CardHeader className="bg-primary/5 pb-2">
                                                <CardTitle className="text-xs font-bold capitalize tracking-tight text-primary">
                                                    {section.section}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-4 space-y-4">
                                                <div className="grid gap-2">
                                                    {section.items.map(item => (
                                                        <div key={item} className="flex justify-between items-center text-[11px] p-2 bg-background rounded border border-muted-foreground/5 shadow-sm">
                                                            <span className="font-medium">{item}</span>
                                                            <Badge variant="outline" className="text-[10px] bg-background">
                                                                {refData.ratings?.[item] || 'Not Rated'}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                                                    <p className="text-[10px] font-bold text-primary/70 capitalize mb-1 flex items-center gap-1.5">
                                                        <FileText className="w-3 h-3" /> Evidence ({section.evidenceId})
                                                    </p>
                                                    <p className="text-xs italic leading-relaxed text-muted-foreground">
                                                        {refData.evidence?.[section.evidenceId] || 'No evidence provided'}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    <div className="grid md:grid-cols-2 gap-4 pt-4">
                                        {[
                                            { l: 'Strengths', v: refData.reflection?.strengths, icon: <Sparkles className="w-3 h-3" /> },
                                            { l: 'Areas for Improvement', v: refData.reflection?.improvement, icon: <TrendingUp className="w-3 h-3" /> },
                                            { l: 'Set Goal', v: refData.reflection?.goal, icon: <Target className="w-3 h-3" /> },
                                            { l: 'Additional Notes', v: refData.reflection?.anythingElse, icon: <MessageSquare className="w-3 h-3" /> }
                                        ].map(item => (
                                            <Card key={item.l} className="bg-primary/5 border border-primary/10">
                                                <CardContent className="p-4 space-y-2">
                                                    <p className="text-[10px] font-bold text-primary capitalize flex items-center gap-1.5">
                                                        {item.icon} {item.l}
                                                    </p>
                                                    <p className="text-xs leading-relaxed font-medium">
                                                        {item.v || 'N/A'}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground capitalize">Impact / Contribution</p>
                                        <div className="p-3 bg-muted/30 rounded-lg text-sm italic">
                                            "{refData.impact || 'N/A'}"
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground capitalize">Evidence / Skills</p>
                                        <div className="p-3 bg-muted/30 rounded-lg text-sm italic">
                                            "{refData.evidence || 'N/A'}"
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground capitalize">Summary</p>
                                        <div className="p-3 bg-muted/30 rounded-lg text-sm italic">
                                            "{refData.text || 'N/A'}"
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {goal.goalSettingForm && (
                        <div className="space-y-1 pt-4 border-t border-muted">
                            <p className="text-[10px] font-bold text-primary capitalize">HOS Expectations</p>
                            <div className="p-3 bg-info/5 border border-info/10 rounded-lg text-sm font-medium">
                                {safeJsonParse(goal.goalSettingForm).text}
                            </div>
                        </div>
                    )}
                    {goal.goalCompletionForm && (
                        <div className="space-y-1 pt-4 border-t border-muted">
                            <p className="text-[10px] font-bold text-emerald-600 capitalize">Final Evaluation</p>
                            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-sm">
                                {safeJsonParse(goal.goalCompletionForm).text}
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        );
    };

    // ── Wizard step count logic ──────────────────────────────────────────────
    const getStepCount = () => {
        if (phase !== 'SELF_REFLECTION') return 1;
        const fwType = getFrameworkType(goal, user);
        if (fwType === 'CORE') return CORE_FRAMEWORK.length + 1;
        if (fwType === 'PE') return 1 + PE_FRAMEWORK.length + 1 + 1;
        if (fwType === 'PA') return 1 + PA_FRAMEWORK.length + 1 + 1;
        if (fwType === 'VA') return 1 + VA_FRAMEWORK.length + 1 + 1;
        return 1;
    };
    const totalSteps = getStepCount();
    const isWizard = phase === 'SELF_REFLECTION' && totalSteps > 1;
    const isLastStep = formStep === totalSteps - 1;

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 border-2 shadow-2xl overflow-hidden"
            >
                {/* Sticky header */}
                <DialogHeader className="px-6 py-4 border-b bg-background shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="rounded-md font-mono text-[10px] capitalize">
                                {(goal.status || 'IN_PROGRESS').replace(/_/g, ' ')}
                            </Badge>
                            {role === 'ADMIN' && (
                                <Badge variant="destructive" className="rounded-md font-mono text-[10px] capitalize">
                                    Admin Override
                                </Badge>
                            )}
                        </div>
                        {isWizard && (
                            <span className="text-sm font-medium text-muted-foreground tabular-nums">
                                Step {formStep + 1} / {totalSteps}
                            </span>
                        )}
                    </div>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2 mt-1">
                        <Target className="w-5 h-5 text-primary shrink-0" />
                        {phase === 'VIEW' ? 'Goal Details' : phase === 'SELF_REFLECTION' ? 'Self Reflection Form' : phase.replace(/_/g, ' ')}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium text-foreground/80">{goal.teacher?.fullName || goal.teacher}</span>
                        <span>—</span>
                        <span className="italic truncate">{goal.title}</span>
                    </DialogDescription>
                    {role === 'ADMIN' && (
                        <Tabs value={phase} onValueChange={(v: any) => { setPhase(v as any); setFormStep(0); }} className="w-full mt-3">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="MASTER_FORM">Goal Creation</TabsTrigger>
                                <TabsTrigger value="SELF_REFLECTION">Self Reflection</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    )}
                    {isWizard && (
                        <div className="w-full h-1.5 bg-muted rounded-full mt-3 overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
                                style={{ width: `${((formStep + 1) / totalSteps) * 100}%` }}
                            />
                        </div>
                    )}
                </DialogHeader>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="max-w-3xl mx-auto">
                        {renderContent()}
                    </div>
                </div>

                {/* Footer */}
                {phase !== 'MASTER_FORM' && (
                    <div className="px-6 py-4 border-t bg-muted/10 shrink-0">
                        <div className="flex items-center justify-between max-w-3xl mx-auto">
                            <div className="flex items-center gap-2">
                                {isWizard && formStep > 0 && (
                                    <Button variant="outline" onClick={() => setFormStep(s => Math.max(s - 1, 0))} disabled={isSubmitting}>
                                        ← Back
                                    </Button>
                                )}
                                <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                                    {phase === 'VIEW' ? 'Close' : 'Cancel'}
                                </Button>
                            </div>
                            <div>
                                {phase !== 'VIEW' && (
                                    isWizard && !isLastStep ? (
                                        <Button 
                                            onClick={() => {
                                                if (validateStep(formStep)) {
                                                    setFormStep(s => Math.min(s + 1, totalSteps - 1));
                                                }
                                            }} 
                                            className="gap-2"
                                        >
                                            Next →
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting || (role !== 'ADMIN' && !isWindowOpen(phase))}
                                            className="gap-2"
                                        >
                                            {isSubmitting ? <Clock className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                            Submit {phase === 'SELF_REFLECTION' ? 'self reflection' : phase.toLowerCase().replace(/_/g, ' ')}
                                        </Button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
