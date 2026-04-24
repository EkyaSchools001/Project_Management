
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileText, Workflow, Save, AlertCircle, Database, Layout, Smartphone, Key, Trash2, Info, LayoutDashboard, Search, Check, MapPin, Users, Activity, Download, Upload, Eye, Clock, RotateCcw } from "lucide-react";
import { Lightning, UsersThree, Desktop } from "@phosphor-icons/react";

import { DashboardBuilder } from "@/components/DashboardBuilder";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from "@/components/ui/select";
import { dashboardService } from "@/services/dashboardService";
import { useSearchParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CAMPUS_OPTIONS } from "@/lib/constants";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import api from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { defaultAccessMatrix } from "@/contexts/PermissionContext";

interface PermissionSetting {
    moduleId: string;
    moduleName: string;
    roles: {
        SUPERADMIN: boolean;
        ADMIN: boolean;
        LEADER: boolean;
        MANAGEMENT: boolean;
        COORDINATOR: boolean;
        TEACHER: boolean;
        TESTER: boolean;
    };
}

interface FormFlowConfig {
    id: string;
    formName: string;
    senderRole: string;
    targetDashboard: string;
    targetLocation: string;
    subjectType?: string;
    specificSubjects?: string;
    targetSchool?: string;
}


// Aligned with FormTemplate names + Attendance Submission (used by AttendanceForm)
const defaultFormFlows: FormFlowConfig[] = [
    { id: '1', formName: 'Walkthrough Observation', senderRole: 'LEADER', targetDashboard: 'Teacher Dashboard', targetLocation: 'Growth Reports', targetSchool: 'ALL', subjectType: 'ALL', specificSubjects: '' },
    { id: '2', formName: 'Professional Goal', senderRole: 'TEACHER', targetDashboard: 'Leader Dashboard', targetLocation: 'Pending Approvals', targetSchool: 'ALL', subjectType: 'ALL', specificSubjects: '' },
    { id: '3', formName: 'MOOC Evidence', senderRole: 'TEACHER', targetDashboard: 'Admin Dashboard', targetLocation: 'Course Reviews', targetSchool: 'ALL', subjectType: 'ALL', specificSubjects: '' },
    { id: '4', formName: 'Teacher Reflection', senderRole: 'TEACHER', targetDashboard: 'Teacher Dashboard', targetLocation: 'My Portfolio', targetSchool: 'ALL', subjectType: 'ALL', specificSubjects: '' },
    { id: '5', formName: 'Attendance Submission', senderRole: 'TEACHER', targetDashboard: 'Admin Dashboard', targetLocation: 'Attendance Register', targetSchool: 'ALL', subjectType: 'ALL', specificSubjects: '' },
    { id: '6', formName: 'Specialist Observation', senderRole: 'LEADER', targetDashboard: 'Teacher Dashboard', targetLocation: 'Growth Reports', targetSchool: 'ALL', subjectType: 'ALL', specificSubjects: '' },
    { id: '7', formName: 'Formal Classroom Observation', senderRole: 'LEADER', targetDashboard: 'Teacher Dashboard', targetLocation: 'Growth Reports', targetSchool: 'ALL', subjectType: 'ALL', specificSubjects: '' },
    { id: '8', formName: 'Peer Observation', senderRole: 'TEACHER', targetDashboard: 'Teacher Dashboard', targetLocation: 'Growth Reports', targetSchool: 'ALL', subjectType: 'ALL', specificSubjects: '' },
    { id: '9', formName: 'Quick Check Maintenance', senderRole: 'LEADER', targetDashboard: 'Teacher Dashboard', targetLocation: 'Growth Reports', targetSchool: 'ALL', subjectType: 'ALL', specificSubjects: '' },
    { id: '10', formName: 'Learning Walk', senderRole: 'LEADER', targetDashboard: 'Teacher Dashboard', targetLocation: 'Growth Reports', targetSchool: 'ALL', subjectType: 'ALL', specificSubjects: '' },
    { id: '11', formName: 'Instructional Focus Visit', senderRole: 'LEADER', targetDashboard: 'Teacher Dashboard', targetLocation: 'Growth Reports', targetSchool: 'ALL', subjectType: 'ALL', specificSubjects: '' },
    { id: '12', formName: 'Deep Dive Observation', senderRole: 'LEADER', targetDashboard: 'Teacher Dashboard', targetLocation: 'Growth Reports', targetSchool: 'ALL', subjectType: 'ALL', specificSubjects: '' },
    { id: '13', formName: 'Curriculum Alignment Check', senderRole: 'LEADER', targetDashboard: 'Teacher Dashboard', targetLocation: 'Growth Reports', targetSchool: 'ALL', subjectType: 'ALL', specificSubjects: '' },
    { id: '14', formName: 'Student Engagement Scan', senderRole: 'LEADER', targetDashboard: 'Teacher Dashboard', targetLocation: 'Growth Reports', targetSchool: 'ALL', subjectType: 'ALL', specificSubjects: '' },
    { id: '15', formName: 'Differentiation Spotlight', senderRole: 'LEADER', targetDashboard: 'Teacher Dashboard', targetLocation: 'Growth Reports', targetSchool: 'ALL', subjectType: 'ALL', specificSubjects: '' },
    { id: '16', formName: 'Assessment Integration Review', senderRole: 'LEADER', targetDashboard: 'Teacher Dashboard', targetLocation: 'Growth Reports', targetSchool: 'ALL', subjectType: 'ALL', specificSubjects: '' },
];

const FORM_NAME_OPTIONS = [
    'Walkthrough Observation', 'Specialist Observation', 'Formal Classroom Observation', 'Peer Observation',
    'Quick Check Maintenance', 'Learning Walk', 'Instructional Focus Visit', 'Deep Dive Observation',
    'Curriculum Alignment Check', 'Student Engagement Scan', 'Differentiation Spotlight', 'Assessment Integration Review',
    'Teacher Reflection', 'Self-Reflection', 'MOOC Evidence', 'MOOC Submission', 'Professional Goal', 'Attendance Submission',
    'Annual Goal Setting', 'External Certifications Submission'
];

const coreSubjects = ["Mathematics", "Science", "English", "Social Science", "Hindi", "Kannada", "Biology", "Physics", "Chemistry", "Computer Science"];
const nonCoreSubjects = ["Life Skills", "Physical Education", "Visual Arts", "Music", "Value Education"];

const getModuleCategory = (moduleId: string) => {
    if (['okr', 'portfolio', 'superadmin'].includes(moduleId)) return 'Super Admin Console';
    if (['observations', 'growth-analytics', 'goals', 'danielson', 'quick-feedback', 'performing-arts', 'life-skills', 'pe-obs', 'va-obs'].includes(moduleId)) return 'Observation & Goals';
    if (['users', 'settings', 'forms', 'team'].includes(moduleId)) return 'Administration & Settings';
    if (['courses', 'assessments', 'festival', 'mooc'].includes(moduleId)) return 'Courses';
    if (['calendar', 'hours'].includes(moduleId)) return 'Training';
    if (['attendance', 'meetings', 'reports', 'insights', 'survey', 'announcements', 'documents'].includes(moduleId)) return 'Operations';
    
    // educator-hub modules
    if (['edu-hub', 'who-we-are', 'my-campus', 'teaching', 'my-classroom', 'interactions', 'tickets', 'grow', 'culture-environment', 'co-curricular'].includes(moduleId)) return 'Educator Hub';
    
    // hr modules
    if (['resources', 'educator-essentials', 'educator-guide', 'wellbeing'].includes(moduleId)) return 'HR & WellBeing';
    
    // technology modules
    if (['tech-sites-login', 'greythr', 'schoology', 'google-workspace', 'zoom', 'slack', 'email-signature', 'ekyaverse', 'audit-reports'].includes(moduleId)) return 'Technology';
    
    return 'Other Modules';
};

const CATEGORIES_ORDER = ['Super Admin Console', 'Observation & Goals', 'Administration & Settings', 'Courses', 'Training', 'Operations', 'Educator Hub', 'HR & WellBeing', 'Technology', 'Other Modules'];


export function SuperAdminView() {
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultTab = searchParams.get('tab') || "access";
    const [matrix, setMatrix] = useState<any[]>([]);
    const parseStructure = (structure: any) => {
        if (!structure) return [];
        if (typeof structure === 'string') {
            try {
                return JSON.parse(structure) || [];
            } catch (e) {
                return [];
            }
        }
        if (Array.isArray(structure)) return structure;
        return [];
    };

    const [isLoading, setIsLoading] = useState(true);
    const [accessMatrix, setAccessMatrix] = useState<PermissionSetting[]>(defaultAccessMatrix);
    const [formFlows, setFormFlows] = useState<FormFlowConfig[]>(defaultFormFlows);
    const [formTemplates, setFormTemplates] = useState<{ name: string; type: string }[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [userSearch, setUserSearch] = useState("");
    const [userFilterCampus, setUserFilterCampus] = useState("all");
    const [userFilterRole, setUserFilterRole] = useState("all");
    const [selectedRoleTab, setSelectedRoleTab] = useState<keyof PermissionSetting['roles']>('SUPERADMIN');

    // States for adding new module to access matrix
    const [newModuleName, setNewModuleName] = useState("");
    const [newModuleId, setNewModuleId] = useState("");

    // States for Audit & Health
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [isAuditLogsLoading, setIsAuditLogsLoading] = useState(false);
    const [healthMetrics, setHealthMetrics] = useState<any>(null);

    useEffect(() => {
        if (defaultTab === 'audit-logs') {
            fetchAuditLogs();
            fetchSystemHealth();
        }
    }, [defaultTab]);

    const fetchAuditLogs = async () => {
        try {
            setIsAuditLogsLoading(true);
            const response = await api.get('/settings/audit-logs/all');
            if (response.data?.status === 'success') {
                setAuditLogs(response.data.data.logs || []);
            }
        } catch (e) {
            console.error("Failed to fetch audit logs", e);
        } finally {
            setIsAuditLogsLoading(false);
        }
    };

    const fetchSystemHealth = async () => {
        try {
            const response = await api.get('/settings/system-health/metrics');
            if (response.data?.status === 'success') {
                setHealthMetrics(response.data.data);
            }
        } catch (e) {
            console.error("Failed to fetch system health", e);
        }
    };

    const handleRollback = async (logId: string) => {
        try {
            await api.post(`/settings/audit-logs/${logId}/restore`);
            toast.success("Configuration successfully rolled back!");
            // Refresh logs
            fetchAuditLogs();
            // Force a reload so the frontend matrix UI gets updated too
            setTimeout(() => window.location.reload(), 1000);
        } catch (e) {
            console.error(e);
            toast.error("Failed to rollback configuration.");
        }
    };

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await api.get('/settings/access_matrix_config');
                if (response.data.status === 'success' && response.data.data.setting) {
                    const valueData = response.data.data.setting.value;
                    const value = typeof valueData === 'string' ? JSON.parse(valueData) : valueData;
                    if (value && value.accessMatrix) {
                        const mergedMatrix = defaultAccessMatrix.map(defaultItem => {
                            const loadedItem = value.accessMatrix.find((item: any) => item.moduleId === defaultItem.moduleId);
                            if (loadedItem) {
                                return {
                                    ...defaultItem,
                                    ...loadedItem,
                                    roles: {
                                        SUPERADMIN: loadedItem.roles?.SUPERADMIN ?? defaultItem.roles.SUPERADMIN,
                                        ADMIN: loadedItem.roles?.ADMIN ?? defaultItem.roles.ADMIN,
                                        LEADER: loadedItem.roles?.LEADER ?? defaultItem.roles.LEADER,
                                        MANAGEMENT: loadedItem.roles?.MANAGEMENT ?? defaultItem.roles.MANAGEMENT,
                                        COORDINATOR: loadedItem.roles?.COORDINATOR ?? defaultItem.roles.COORDINATOR,
                                        TEACHER: loadedItem.roles?.TEACHER ?? defaultItem.roles.TEACHER,
                                        TESTER: loadedItem.roles?.TESTER ?? (defaultItem.roles as any).TESTER ?? false,
                                    }
                                };
                            }
                            return defaultItem;
                        });
                        setAccessMatrix(mergedMatrix);
                    }
                    if (value.formFlows) setFormFlows(value.formFlows);
                }
            } catch (e) {
                console.error("Failed to load access matrix settings", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);

    useEffect(() => {
        const loadTemplates = async () => {
            try {
                const response = await api.get('/templates');
                if (response.data?.status === 'success' && response.data?.data?.templates) {
                    const templatesData = response.data.data.templates.map((t: any) => ({
                        name: t.name,
                        type: t.type || '',
                        structure: t.structure || []
                    }));
                    setFormTemplates(templatesData);
                }
            } catch (e) {
                console.error("Failed to load form templates", e);
            }
        };
        loadTemplates();
    }, []);

    useEffect(() => {
        if (defaultTab === 'user-mapping') {
            fetchUsers();
        }
    }, [defaultTab]);

    const fetchUsers = async () => {
        try {
            setIsUsersLoading(true);
            const response = await api.get('/users');
            if (response.data?.status === 'success') {
                setAllUsers(response.data.data.users || []);
            }
        } catch (e) {
            console.error("Failed to fetch users", e);
            toast.error("Failed to load users list");
        } finally {
            setIsUsersLoading(false);
        }
    };

    const handleUpdateCampusAccess = async (userId: string, campuses: string[]) => {
        try {
            const campusStr = campuses.join(',');
            await api.patch(`/users/${userId}`, { campusAccess: campusStr });
            setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, campusAccess: campusStr } : u));
            toast.success("User campus access updated successfully");
        } catch (e) {
            console.error("Failed to update campus access", e);
            toast.error("Update failed");
        }
    };

    const handleExportCSV = () => {
        const header = "Email,Full Name,Role,Home Campus,Mapped Campuses";
        const rows = allUsers.map(u => {
            const escapeCSV = (val: string | null) => val ? `"${val.replace(/"/g, '""')}"` : '""';
            return [
                escapeCSV(u.email),
                escapeCSV(u.fullName),
                escapeCSV(u.role),
                escapeCSV(u.campusId || ''),
                escapeCSV(u.campusAccess || '')
            ].join(",");
        });
        const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent([header, ...rows].join("\n"));
        const link = document.createElement("a");
        link.setAttribute("href", csvContent);
        link.setAttribute("download", "user_mapping_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = (e.target?.result as string);
            const lines = text.split("\n").filter(line => line.trim());
            // Process lines skipping header
            let successCount = 0;
            for (let i = 1; i < lines.length; i++) {
                // Parse CSV correctly with quotes
                const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
                const matches = [];
                let match;
                while ((match = regex.exec(lines[i])) !== null) {
                    matches.push(match[1]);
                }

                const email = matches[0]?.replace(/^"|"$/g, '').replace(/""/g, '"');
                const mappedCampuses = matches[4]?.replace(/^"|"$/g, '').replace(/""/g, '"');

                if (email && mappedCampuses !== undefined) {
                    const user = allUsers.find(u => u.email === email);
                    if (user && user.campusAccess !== mappedCampuses) {
                        try {
                            await api.patch(`/users/${user.id}`, { campusAccess: mappedCampuses });
                            successCount++;
                        } catch (err) {
                            console.error(`Failed to update ${email}`);
                        }
                    }
                }
            }
            if (successCount > 0) {
                toast.success(`Successfully updated mapping for ${successCount} users`);
                fetchUsers();
            } else {
                toast.info("No modifications detected from CSV.");
            }
        };
        reader.readAsText(file);
        // Reset file input
        event.target.value = '';
    };

    const { login: authLogin } = useAuth();

    const handleImpersonate = async (userId: string, name: string) => {
        try {
            toast.loading(`Switching session to ${name}...`);
            const response = await api.post(`/auth/impersonate/${userId}`);
            
            if (response.data?.status === 'success' && response.data?.token) {
                const { token, data } = response.data;
                // Use the login function from useAuth to update session and redirect
                authLogin(token, data.user);
                toast.dismiss();
                toast.success(`Now viewing as ${name}`);
            } else {
                throw new Error("Invalid response during impersonation");
            }
        } catch (error) {
            console.error("Impersonation failed:", error);
            toast.dismiss();
            toast.error("Failed to switch session. Please check backend logs.");
        }
    };

    const handleSave = async () => {
        console.log('[SUPERADMIN] Attempting to save configurations...', { accessMatrix, formFlows });
        try {
            const payload = {
                key: "access_matrix_config",
                value: { accessMatrix, formFlows }
            };
            const response = await api.post('/settings/upsert', payload);
            console.log('[SUPERADMIN] Save successful:', response.data);
            toast.success("SuperAdmin configurations saved successfully");
        } catch (e) {
            console.error('[SUPERADMIN] Save failed:', e);
            toast.error("Failed to save configurations");
        }
    };

    const togglePermission = (moduleId: string, role: string) => {
        const roleKey = role as keyof PermissionSetting['roles'];
        setAccessMatrix(prev => prev.map(item =>
            item.moduleId === moduleId
                ? { ...item, roles: { ...item.roles, [roleKey]: !(item.roles[roleKey]) } }
                : item
        ));
    };

    const handleAddModule = () => {
        if (!newModuleName.trim() || !newModuleId.trim()) {
            toast.error("Please enter both module name and module ID (path segment).");
            return;
        }
        const cleanModuleId = newModuleId.toLowerCase().replace(/[^a-z0-9-]/g, '');
        if (accessMatrix.find(m => m.moduleId === cleanModuleId)) {
            toast.error("Module ID already exists in the matrix.");
            return;
        }
        setAccessMatrix(prev => [...prev, {
            moduleId: cleanModuleId,
            moduleName: newModuleName.trim(),
            roles: { SUPERADMIN: true, ADMIN: false, LEADER: false, MANAGEMENT: false, COORDINATOR: false, TEACHER: false, TESTER: false }
        }]);
        setNewModuleName("");
        setNewModuleId("");
        toast.success("Page added to matrix. Don't forget to 'Submit & Apply Configurations'.");
    };

    const removeModule = (moduleId: string) => {
        // Prevent removal of default modules
        if (defaultAccessMatrix.find(m => m.moduleId === moduleId)) {
            toast.error("Cannot remove default system modules.");
            return;
        }
        setAccessMatrix(prev => prev.filter(m => m.moduleId !== moduleId));
        toast.success("Page removed from matrix. Don't forget to 'Submit & Apply Configurations'.");
    };

    const updateFormFlow = (id: string, field: keyof FormFlowConfig, value: string) => {
        setFormFlows(prev => prev.map(flow =>
            flow.id === id ? { ...flow, [field]: value } : flow
        ));
    };

    const addFormFlow = () => {
        const firstTemplate = formTemplates[0]?.name || FORM_NAME_OPTIONS[0] || 'New Form';
        const newFlow: FormFlowConfig = {
            id: Date.now().toString(),
            formName: firstTemplate,
            senderRole: 'TEACHER',
            targetDashboard: 'Leader Dashboard',
            targetLocation: 'Reports',
            targetSchool: 'ALL',
            subjectType: 'ALL',
            specificSubjects: ''
        };
        setFormFlows([...formFlows, newFlow]);
    };

    const removeFormFlow = (id: string) => {
        setFormFlows(formFlows.filter(f => f.id !== id));
    };

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading SuperAdmin console...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PageHeader
                title="SuperAdmin Console"
                subtitle="High-level system governance, role permissions, and global form routing"
                actions={
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-bold border border-success/20 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-success"></span>
                            Live Sync Active
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="bg-primary hover:bg-primary/90 shadow-lg px-6 h-11 font-bold">
                                    <Save className="w-4 h-4 mr-2" />
                                    Submit & Apply Configurations
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2 text-primary font-bold">
                                        <AlertCircle className="w-5 h-5" /> Execute Ecosystem Build?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription asChild>
                                        <div className="space-y-3 mt-2 text-slate-600">
                                            <p>You are initiating a global system configuration change that will impact user sessions across the platform in real-time.</p>
                                            <div className="bg-slate-50 p-3 rounded-md text-sm border border-slate-200">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span>Access Matrices updated:</span>
                                                    <strong className="text-blue-600">{accessMatrix.length}</strong>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span>Workflows modified:</span>
                                                    <strong className="text-blue-600">{formFlows.length}</strong>
                                                </div>
                                            </div>
                                            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded relative before:absolute before:inset-0 before:border-l-4 before:border-amber-500 before:rounded-l overflow-hidden">
                                                If you proceed, this payload will immediately dispatch over WebSockets to all connected clients and force a silent background re-render of their visible UI metrics.
                                                <br /><strong>This action is irreversible and recorded in the permanent audit ledger.</strong>
                                            </p>
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="mt-4">
                                    <AlertDialogCancel className="font-bold">Abort Mission</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleSave} className="bg-primary text-white hover:bg-primary/90 font-bold">
                                        Proceed & Broadcast Sync
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                }
            />

            <Tabs
                value={defaultTab}
                className="w-full"
                onValueChange={(val) => setSearchParams({ tab: val })}
            >
                <TabsList className="flex flex-col sm:grid sm:grid-cols-5 w-full h-auto sm:h-10">
                    <TabsTrigger value="access" className="gap-2 font-bold focus-visible:ring-primary">
                        <Shield className="w-4 h-4" /> Access Matrix
                    </TabsTrigger>
                    <TabsTrigger value="workflows" className="gap-2 font-bold focus-visible:ring-primary">
                        <Workflow className="w-4 h-4" /> Form Workflows
                    </TabsTrigger>
                    <TabsTrigger value="user-mapping" className="gap-2 font-bold focus-visible:ring-primary">
                        <Users className="w-4 h-4" /> User Mapping
                    </TabsTrigger>
                    <TabsTrigger value="dashboard-builder" className="gap-2 font-bold focus-visible:ring-primary">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard Builder
                    </TabsTrigger>
                    <TabsTrigger value="audit-logs" className="gap-2 font-bold focus-visible:ring-primary">
                        <Activity className="w-4 h-4" /> Audit & Health
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="access" className="space-y-6 mt-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-6">
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-primary" /> System Security
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold italic text-primary">High Priority</div>
                                <p className="text-xs text-zinc-900 font-bold mt-1">Manage global role access levels</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-amber-500/5 border-amber-500/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Workflow className="w-4 h-4 text-amber-600" /> Workflow Engine
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-amber-600">{formFlows.length} Active Flows</div>
                                <p className="text-xs text-zinc-900 font-bold mt-1">Rerouting form data across dashboards</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-blue-500/5 border-blue-500/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Database className="w-4 h-4 text-blue-600" /> Platform Mapping
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">Unified</div>
                                <p className="text-xs text-zinc-900 font-bold mt-1">Cross-campus synchronization active</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-primary" />
                                    <div>
                                        <CardTitle className="font-bold">Global Access Matrix</CardTitle>
                                        <CardDescription>Define which user roles can access specific modules across the platform.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {(() => {
                                    const groupedMatrix = accessMatrix.reduce((acc, module) => {
                                        const category = getModuleCategory(module.moduleId);
                                        if (!acc[category]) acc[category] = [];
                                        acc[category].push(module);
                                        return acc;
                                    }, {} as Record<string, PermissionSetting[]>);
                                    
                                    return (
                                        <div className="flex flex-col gap-6">
                                            {/* Top Role Selector */}
                                            <div className="flex flex-col gap-4 bg-[#24181F] p-4 rounded-xl border border-[#3E2D36] shadow-xl">
                                                <div className="text-[10px] uppercase tracking-widest font-bold text-[#EA104A] ml-1">Current Configuration Role</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {(['SUPERADMIN', 'ADMIN', 'LEADER', 'MANAGEMENT', 'COORDINATOR', 'TEACHER', 'TESTER'] as const).map(role => (
                                                        <button
                                                            key={role}
                                                            onClick={() => setSelectedRoleTab(role)}
                                                            className={`px-4 py-2 rounded-lg font-bold text-[11px] transition-all tracking-wider focus:outline-none flex-1 md:flex-none min-w-[100px] border ${selectedRoleTab === role ? 'bg-[#EA104A] text-white border-[#EA104A] shadow-lg shadow-[#EA104A]/20' : 'bg-[#31212B] text-white/50 border-[#3E2D36] hover:bg-[#3E2D36] hover:text-white'}`}
                                                        >
                                                            {role}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Sidebar-like Accordion */}
                                            <div className="w-full bg-[#24181F] text-white p-6 rounded-2xl shadow-2xl border border-[#3E2D36]">
                                                <div className="text-[11px] uppercase tracking-[0.2em] font-black text-[#EA104A] mb-6 flex items-center justify-between">
                                                    <span>Platform Navigation</span>
                                                     <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none mt-2">
                                                        {/* Section 1: Educator Hub */}
                                                        <div className="min-w-[140px] bg-[#31212B] p-4 rounded-xl border border-[#3E2D36] shadow-lg animate-in slide-in-from-left-2 duration-500">
                                                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#3E2D36]/50">
                                                                <Lightning className="w-4 h-4 text-[#EA104A] font-bold" weight="fill" />
                                                                <span className="text-[11px] font-black uppercase tracking-wider text-white">Educator Hub</span>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {['Home', 'Who we are', 'My campus', 'Teaching', 'My classroom', 'Interactions', 'Tickets', 'Grow'].map(item => (
                                                                    <div key={item} className="text-[10px] text-white/50 font-medium hover:text-white/80 transition-colors cursor-default whitespace-nowrap">{item}</div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Section 2: HR & WellBeing */}
                                                        <div className="min-w-[140px] bg-[#31212B] p-4 rounded-xl border border-[#3E2D36] shadow-lg animate-in slide-in-from-left-4 duration-700">
                                                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#3E2D36]/50 border-double">
                                                                <UsersThree className="w-4 h-4 text-[#EA104A]" weight="fill" />
                                                                <span className="text-[11px] font-black uppercase tracking-wider text-white">HR & WellBeing</span>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {['Resources', 'Educator Essentials', 'Educator Guide', 'WellBeing'].map(item => (
                                                                    <div key={item} className="text-[10px] text-white/50 font-medium hover:text-white/80 transition-colors cursor-default whitespace-nowrap">{item}</div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Section 3: Technology */}
                                                        <div className="min-w-[140px] bg-[#31212B] p-4 rounded-xl border border-[#3E2D36] shadow-lg animate-in slide-in-from-left-6 duration-1000">
                                                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#3E2D36]/50">
                                                                <Desktop className="w-4 h-4 text-[#EA104A]" weight="fill" />
                                                                <span className="text-[11px] font-black uppercase tracking-wider text-white">Technology</span>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {['Educator Site', 'GreytHR', 'Schoology', 'Google Workspace', 'Zoom', 'Slack', 'Email Signature Templates', 'Ekyaverse-Neverskip', 'Audit & Reports'].map(item => (
                                                                    <div key={item} className="text-[10px] text-white/50 font-medium hover:text-white/80 transition-colors cursor-default whitespace-nowrap">{item}</div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                     </div>
                                                </div>
                                                <Accordion type="multiple" className="w-full space-y-2" defaultValue={['Super Admin Console', 'Administration & Settings']}>
                                                    {CATEGORIES_ORDER.map(category => {
                                                        const modules = groupedMatrix[category];
                                                        if (!modules || modules.length === 0) return null;
                                                        
                                                        return (
                                                            <AccordionItem value={category} key={category} className="border-none bg-[#31212B] rounded-xl overflow-hidden shadow-sm transition-all duration-300">
                                                                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-[#3E2D36] transition-all font-bold tracking-wide text-sm">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#EA104A]/50" />
                                                                        {category}
                                                                    </div>
                                                                </AccordionTrigger>
                                                                <AccordionContent className="bg-[#24181F]/50 pt-2 pb-3">
                                                                    <div className="flex flex-col space-y-1 px-2">
                                                                        {modules.map(module => (
                                                                            <div key={module.moduleId} className="group flex items-center justify-between px-6 py-3 hover:bg-[#31212B]/80 transition-all rounded-lg border border-transparent hover:border-[#3E2D36]">
                                                                                <div className="flex flex-col">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span className="font-semibold text-sm text-white/90 group-hover:text-white transition-colors">{module.moduleName}</span>
                                                                                        {!defaultAccessMatrix.find(m => m.moduleId === module.moduleId) && (
                                                                                            <Badge variant="outline" className="text-[8px] h-4 px-1.5 shrink-0 bg-[#EA104A]/10 text-[#EA104A] border-[#EA104A]/20">New</Badge>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-center gap-6 shrink-0">
                                                                                    <div className="hidden md:flex flex-col items-end mr-2">
                                                                                        {module.roles[selectedRoleTab] ? (
                                                                                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest opacity-80 group-hover:opacity-100">LIVE ACCESS</span>
                                                                                        ) : (
                                                                                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Restricted</span>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Switch
                                                                                            className="data-[state=checked]:bg-[#EA104A] data-[state=unchecked]:bg-[#3E2D36] scale-[0.9]"
                                                                                            checked={module.roles[selectedRoleTab]}
                                                                                            onCheckedChange={() => togglePermission(module.moduleId, selectedRoleTab)}
                                                                                            disabled={(module.moduleId === 'settings' || module.moduleId === 'access') && selectedRoleTab === 'SUPERADMIN'}
                                                                                        />
                                                                                        {!defaultAccessMatrix.find(m => m.moduleId === module.moduleId) && (
                                                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-white/20 hover:text-red-400 hover:bg-red-400/10 ml-1 rounded-full" onClick={() => removeModule(module.moduleId)}>
                                                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                                            </Button>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        );
                                                    })}
                                                </Accordion>
                                            </div>
                                        </div>
                                    );
                                })()}
                                <div className="mt-4 pt-4 border-t border-dashed">
                                    <h4 className="text-sm font-semibold mb-3">Add Custom Page/Module</h4>
                                    <div className="flex items-end gap-3 flex-wrap md:flex-nowrap">
                                        <div className="space-y-1.5 flex-1 min-w-[200px]">
                                            <Label className="text-xs">Page / Module Name</Label>
                                            <Input
                                                placeholder="e.g. Activity Log"
                                                value={newModuleName}
                                                onChange={(e) => setNewModuleName(e.target.value)}
                                                className="h-9"
                                            />
                                        </div>
                                        <div className="space-y-1.5 flex-1 min-w-[200px]">
                                            <Label className="text-xs">Module ID (URL Path Segment)</Label>
                                            <Input
                                                placeholder="e.g. activity-log"
                                                value={newModuleId}
                                                onChange={(e) => setNewModuleId(e.target.value)}
                                                className="h-9"
                                            />
                                            <p className="text-[10px] text-zinc-900 font-bold mt-1">This should match the URL slug (e.g., if /leader/activity-log, enter 'activity-log').</p>
                                        </div>
                                        <Button onClick={handleAddModule} className="h-9 shrink-0 gap-2 mb-[22px]">
                                            <Layout className="w-4 h-4" /> Add to Matrix
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 flex gap-4 items-start">
                            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-destructive">Crucial System Override</h4>
                                <p className="text-sm text-zinc-900 font-bold">
                                    Careless modifications to the Access Matrix can lock out entire groups of users.
                                </p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="workflows" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Workflow className="w-5 h-5 text-amber-600" />
                                <div>
                                    <CardTitle className="font-bold">Advanced Form Workflows</CardTitle>
                                    <CardDescription>Configure how forms move between roles and where responses are displayed.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6">
                                {formFlows.map((flow) => (
                                    <div key={flow.id} className="p-4 border rounded-xl bg-card hover:shadow-md transition-all group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 flex-1 max-w-md">
                                                <FileText className="w-4 h-4 shrink-0 text-primary" />
                                                <Select
                                                    value={flow.formName}
                                                    onValueChange={(v) => updateFormFlow(flow.id, 'formName', v)}
                                                >
                                                    <SelectTrigger className="h-9 font-semibold text-primary border-primary/20">
                                                        <SelectValue placeholder="Select form" />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-[400px]">
                                                        {Object.entries(
                                                            [...formTemplates, ...FORM_NAME_OPTIONS.map(name => ({ name, type: 'OTHER' }))]
                                                                .reduce((acc, t) => {
                                                                    const type = t.type || 'OTHER';
                                                                    if (!acc[type]) acc[type] = [];
                                                                    if (!acc[type].find(existing => existing.name === t.name)) {
                                                                        acc[type].push(t);
                                                                    }
                                                                    return acc;
                                                                }, {} as Record<string, { name: string; type: string }[]>)
                                                        ).map(([type, groupTemplates], groupIdx, arr) => (
                                                            <SelectGroup key={type}>
                                                                <SelectLabel className="text-blue-600 font-bold bg-blue-50/50 py-1 px-3 mb-1 rounded-sm text-xs capitalize tracking-wider">
                                                                    {type} ({groupTemplates.length})
                                                                </SelectLabel>
                                                                {groupTemplates.sort((a, b) => a.name.localeCompare(b.name)).map(t => {
                                                                    const fields = parseStructure((t as any).structure);
                                                                    return (
                                                                        <HoverCard key={t.name} openDelay={200}>
                                                                            <HoverCardTrigger asChild>
                                                                                <SelectItem value={t.name} className="pl-4 pr-10 cursor-pointer relative data-[highlighted]:bg-primary/5">
                                                                                    <span className="flex-1 text-left block w-full pr-6 truncate">{t.name}</span>
                                                                                    <Info className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                                                </SelectItem>
                                                                            </HoverCardTrigger>
                                                                            <HoverCardContent side="right" align="start" sideOffset={10} className="w-[320px] max-w-[90vw] z-[100] max-h-[350px] overflow-y-auto pointer-events-none shadow-2xl border-slate-200 bg-white/95 backdrop-blur-sm">
                                                                                <h4 className="font-semibold text-sm mb-3 pb-2 border-b text-slate-800 border-slate-200 flex items-center justify-between">
                                                                                    <span>{t.name} Fields</span>
                                                                                    <Badge variant="outline" className="text-[10px] bg-slate-50">{fields.length} item{fields.length !== 1 && 's'}</Badge>
                                                                                </h4>
                                                                                <ul className="text-xs text-slate-600 space-y-2.5">
                                                                                    {fields.map((f: any, idx: number) => (
                                                                                        <li key={f.id || idx} className="flex gap-2 leading-tight items-start bg-slate-50/50 p-1.5 rounded-md border border-primary/20">
                                                                                            <span className="text-red-500 w-[8px] shrink-0 font-bold mt-0.5">{f.required ? '*' : ''}</span>
                                                                                            <span className="font-semibold text-slate-700 shrink-0 min-w-[65px] capitalize text-[10px] tracking-wider bg-slate-200/50 px-1 py-0.5 rounded text-center mt-0.5">{(f.type === 'header' ? 'Header' : f.type)}</span>
                                                                                            <span className="break-words mt-0.5">{f.label || f.id || 'Unnamed field'}</span>
                                                                                        </li>
                                                                                    ))}
                                                                                    {fields.length === 0 && <li className="text-slate-400 italic text-center py-4 bg-slate-50 rounded-md">No fields defined for this template.</li>}
                                                                                </ul>
                                                                            </HoverCardContent>
                                                                        </HoverCard>
                                                                    );
                                                                })}
                                                                {groupIdx < arr.length - 1 && <SelectSeparator className="my-2" />}
                                                            </SelectGroup>
                                                        ))}
                                                    </SelectContent>

                                                </Select>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Flow ID: {flow.id}</Badge>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeFormFlow(flow.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4 mt-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs capitalize text-zinc-900 font-bold">Subject Type</Label>
                                                <Select
                                                    value={flow.subjectType || 'ALL'}
                                                    onValueChange={(v) => updateFormFlow(flow.id, 'subjectType', v)}
                                                >
                                                    <SelectTrigger className="h-9">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ALL">Any / All</SelectItem>
                                                        <SelectItem value="CORE">Core Subjects</SelectItem>
                                                        <SelectItem value="NON_CORE">Non-Core Subjects</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs capitalize text-zinc-900 font-bold">Specific Subjects</Label>
                                                <Select
                                                    value={flow.specificSubjects || 'NONE'}
                                                    onValueChange={(v) => updateFormFlow(flow.id, 'specificSubjects', v === 'NONE' ? '' : v)}
                                                >
                                                    <SelectTrigger className="h-9">
                                                        <SelectValue placeholder="Any Subject" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="NONE">Any / Not Specified</SelectItem>
                                                        <SelectItem disabled value="label-core" className="font-bold text-gray-800 bg-gray-50">--- Core Subjects ---</SelectItem>
                                                        {coreSubjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                                        <SelectItem disabled value="label-noncore" className="font-bold text-gray-800 bg-gray-50 mt-2">--- Non-Core Subjects ---</SelectItem>
                                                        {nonCoreSubjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="text-xs capitalize text-zinc-900 font-bold">Target School</Label>
                                                <Select
                                                    value={flow.targetSchool || 'ALL'}
                                                    onValueChange={(v) => updateFormFlow(flow.id, 'targetSchool', v)}
                                                >
                                                    <SelectTrigger className="h-9">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {["ALL", "Ekya ITPL", "Ekya BTM", "Ekya JP Nagar", "Ekya Byrathi", "Ekya NICE Road", "CMR NPS", "CMR NPUC"].map(s => (
                                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4 mt-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs capitalize text-zinc-900 font-bold">Sent By</Label>
                                                <Select
                                                    value={flow.senderRole}
                                                    onValueChange={(v) => updateFormFlow(flow.id, 'senderRole', v)}
                                                >
                                                    <SelectTrigger className="h-9">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="SUPERADMIN">SuperAdmin</SelectItem>
                                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                                        <SelectItem value="LEADER">Leader</SelectItem>
                                                        <SelectItem value="COORDINATOR">Coordinator</SelectItem>
                                                        <SelectItem value="MANAGEMENT">Management</SelectItem>
                                                        <SelectItem value="TEACHER">Teacher</SelectItem>
                                                        <SelectItem value="CORE_TEACHER">Core Teacher</SelectItem>
                                                        <SelectItem value="NON_CORE_TEACHER">Non-Core Teacher</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs capitalize text-zinc-900 font-bold">Redirect To Dashboard</Label>
                                                <Select
                                                    value={flow.targetDashboard}
                                                    onValueChange={(v) => updateFormFlow(flow.id, 'targetDashboard', v)}
                                                >
                                                    <SelectTrigger className="h-9">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Admin Dashboard">Admin Dashboard</SelectItem>
                                                        <SelectItem value="Leader Dashboard">Leader Dashboard</SelectItem>
                                                        <SelectItem value="Coordinator Dashboard">Coordinator Dashboard</SelectItem>
                                                        <SelectItem value="Teacher Dashboard">Teacher Dashboard</SelectItem>
                                                        <SelectItem value="Management Dashboard">Management Dashboard</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="text-xs capitalize text-muted-foreground">Response Display Location</Label>
                                                <Input
                                                    className="h-9"
                                                    value={flow.targetLocation}
                                                    onChange={(e) => updateFormFlow(flow.id, 'targetLocation', e.target.value)}
                                                    placeholder="e.g. Activity Log > Reviews"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
                                            <Workflow className="w-3.5 h-3.5" />
                                            <span>
                                                <strong>Logic:</strong> When a <strong>{flow.senderRole}</strong>
                                                {flow.targetSchool && flow.targetSchool !== 'ALL' && ` at ${flow.targetSchool}`} submits <strong>{flow.formName}</strong>
                                                {flow.subjectType && flow.subjectType !== 'ALL' && ` (for ${flow.subjectType} ${flow.specificSubjects ? `: ${flow.specificSubjects}` : ''})`},
                                                the response will be visible in the <strong>{flow.targetDashboard}</strong> under <strong>{flow.targetLocation}</strong>.
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full border-dashed" onClick={addFormFlow}>
                                + Add New Form Flow
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 flex gap-4 items-start">
                        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-destructive">Crucial System Override</h4>
                            <p className="text-sm text-muted-foreground">
                                Changes made in the SuperAdmin console bypass standard administration rules.
                                Careless modifications to the Access Matrix can lock out entire groups of users.
                            </p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="user-mapping" className="space-y-6 mt-6">
                    <Card className="border-primary/10 shadow-lg">
                        <CardHeader className="border-b bg-muted/50 py-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Users className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">User Access Mapping</CardTitle>
                                        <CardDescription>Configure cross-school visibility for any person in the system.</CardDescription>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2 shrink-0">
                                        <Download className="w-4 h-4" /> Export CSV
                                    </Button>
                                    <div className="relative shrink-0">
                                        <Button variant="outline" size="sm" className="gap-2 w-full justify-start cursor-pointer dark:text-foreground">
                                            <Upload className="w-4 h-4" /> Bulk Import
                                        </Button>
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleImportCSV}
                                            className="absolute inset-0 opacity-0 cursor-pointer text-[0]"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search name/email..."
                                            className="pl-9 w-[200px] bg-background"
                                            value={userSearch}
                                            onChange={(e) => setUserSearch(e.target.value)}
                                        />
                                    </div>
                                    <Select value={userFilterRole} onValueChange={setUserFilterRole}>
                                        <SelectTrigger className="w-[140px] bg-background font-medium">
                                            <Shield className="w-4 h-4 mr-2 text-primary" />
                                            <SelectValue placeholder="Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Roles</SelectItem>
                                            <SelectItem value="TEACHER">Teacher</SelectItem>
                                            <SelectItem value="LEADER">Leader</SelectItem>
                                            <SelectItem value="SCHOOL_LEADER">School Leader</SelectItem>
                                            <SelectItem value="MANAGEMENT">Management</SelectItem>
                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={userFilterCampus} onValueChange={setUserFilterCampus}>
                                        <SelectTrigger className="w-[160px] bg-background font-medium">
                                            <MapPin className="w-4 h-4 mr-2 text-primary" />
                                            <SelectValue placeholder="School" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Schools</SelectItem>
                                            {CAMPUS_OPTIONS.map(c => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/30 border-b">
                                        <tr>
                                            <th className="p-4 text-left font-bold text-xs capitalize text-muted-foreground w-16 text-center">#</th>
                                            <th className="p-4 text-left font-bold text-xs capitalize text-muted-foreground">User Details</th>
                                            <th className="p-4 text-left font-bold text-xs capitalize text-muted-foreground">Base Role</th>
                                            <th className="p-4 text-left font-bold text-xs capitalize text-muted-foreground">Home Campus</th>
                                            <th className="p-4 text-left font-bold text-xs capitalize text-muted-foreground">Extended Visibility</th>
                                            <th className="p-4 text-right font-bold text-xs capitalize text-muted-foreground">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-muted/10">
                                        {isUsersLoading ? (
                                            <tr>
                                                <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                        <span>Decrypting user records...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : allUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="p-12 text-center text-muted-foreground italic">No users identified in the database.</td>
                                            </tr>
                                        ) : allUsers
                                            .filter(user => {
                                                const matchesSearch = user.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
                                                    user.email.toLowerCase().includes(userSearch.toLowerCase());
                                                const matchesCampus = userFilterCampus === 'all' || user.campusId === userFilterCampus;
                                                const matchesRole = userFilterRole === 'all' || user.role === userFilterRole;
                                                return matchesSearch && matchesCampus && matchesRole;
                                            })
                                            .map((user, index) => {
                                                const currentAccess = user.campusAccess ? user.campusAccess.split(',') : [];
                                                return (
                                                    <tr key={user.id} className="hover:bg-primary/5 transition-colors group">
                                                        <td className="p-4 text-center font-bold text-muted-foreground/50">{index + 1}</td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">
                                                                    {user.fullName.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-800 group-hover:text-primary transition-colors">{user.fullName}</div>
                                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <Badge variant="secondary" className="text-[10px] font-bold capitalize tracking-wider">{user.role}</Badge>
                                                        </td>
                                                        <td className="p-4">
                                                            <Badge variant="outline" className="font-medium bg-muted/50 border-muted-foreground/10">{user.campusId || "Unassigned"}</Badge>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {currentAccess.length === 0 ? (
                                                                    <span className="text-[10px] capitalize font-bold text-slate-400 tracking-wider">Default only</span>
                                                                ) : currentAccess.map(c => (
                                                                    <Badge key={c} variant="secondary" className="text-[9px] font-bold bg-blue-100 text-blue-700 border-blue-200 capitalize tracking-tighter">
                                                                        {c}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button variant="outline" size="sm" className="h-9 gap-2 font-bold hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                                                                        <Layout className="w-4 h-4" /> Map Schools
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-60 p-0" align="end">
                                                                    <div className="p-3 border-b bg-muted/30">
                                                                        <div className="font-bold text-xs capitalize tracking-wider">Extended Access</div>
                                                                        <div className="text-[10px] text-muted-foreground">Grant visibility to {user.fullName}</div>
                                                                    </div>
                                                                    <ScrollArea className="h-64">
                                                                        <div className="p-2 space-y-1">
                                                                            {CAMPUS_OPTIONS.map(campus => {
                                                                                const isSelected = currentAccess.includes(campus);
                                                                                return (
                                                                                    <div
                                                                                        key={campus}
                                                                                        className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
                                                                                        onClick={() => {
                                                                                            const newSelection = isSelected
                                                                                                ? currentAccess.filter(i => i !== campus)
                                                                                                : [...currentAccess, campus];
                                                                                            handleUpdateCampusAccess(user.id, newSelection);
                                                                                        }}
                                                                                    >
                                                                                        <Checkbox
                                                                                            checked={isSelected}
                                                                                            onCheckedChange={() => { }}
                                                                                        />
                                                                                        <label className="text-sm font-medium leading-none cursor-pointer flex-1">
                                                                                            {campus}
                                                                                        </label>
                                                                                        {isSelected && <Check className="w-3 h-3 text-primary" />}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </ScrollArea>
                                                                    <div className="p-2 border-t bg-muted/10 text-center">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="w-full text-[10px] h-7"
                                                                            onClick={() => handleUpdateCampusAccess(user.id, [])}
                                                                        >
                                                                            Clear All Extra Access
                                                                        </Button>
                                                                    </div>
                                                                </PopoverContent>
                                                            </Popover>
                                                            <div className="mt-4 pt-4 border-t flex flex-wrap gap-2 justify-end">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="gap-2 text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50 border-indigo-200"
                                                                    onClick={() => {
                                                                        setSearchParams({ tab: 'dashboard-builder', role: user.role });
                                                                    }}
                                                                >
                                                                    <LayoutDashboard className="w-4 h-4" /> Build Dashboard
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="gap-2 text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50 border-indigo-200"
                                                                    onClick={() => handleImpersonate(user.id, user.fullName)}
                                                                >
                                                                    <Eye className="w-4 h-4" /> View As User
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-4 items-start">
                        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-blue-800">Campus Visibility Rules</h4>
                            <p className="text-sm text-blue-700/80">
                                This mapping allows users to see reports, observations, and team data across multiple campuses.
                                It is particularly useful for <strong>Specialist Teachers</strong>, <strong>Cluster Heads</strong>, and <strong>Regional Management</strong>.
                            </p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="dashboard-builder">
                    <DashboardBuilder initialRole={searchParams.get('role') || undefined} />
                </TabsContent>

                <TabsContent value="audit-logs" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-1">
                            <CardHeader className="bg-muted/30 pb-4 border-b">
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-primary" />
                                    System Telemetry
                                </CardTitle>
                                <CardDescription>Real-time platform health</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {healthMetrics ? (
                                    <>
                                        <div className="flex justify-between items-center bg-green-50/50 p-3 rounded-lg border border-green-100">
                                            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Active Connections</span>
                                            <span className="font-bold text-green-700 text-lg">{healthMetrics.activeConnections}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-lg border bg-muted/20">
                                            <span className="text-sm font-medium text-muted-foreground">Uptime</span>
                                            <span className="font-mono text-sm">{Math.floor(healthMetrics.uptimeSeconds / 3600)}h {Math.floor((healthMetrics.uptimeSeconds % 3600) / 60)}m</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-lg border bg-muted/20">
                                            <span className="text-sm font-medium text-muted-foreground">Memory Usage</span>
                                            <span className="font-mono text-sm">{Math.round(healthMetrics.memoryUsage.rss / 1024 / 1024)} MB</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-32 flex items-center justify-center text-muted-foreground">Fetching telemetry...</div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader className="bg-muted/30 pb-4 border-b flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <RotateCcw className="w-5 h-5 text-indigo-600" />
                                        Configuration History
                                    </CardTitle>
                                    <CardDescription>Immutable ledger of system changes</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={fetchAuditLogs}>
                                    <RotateCcw className={`w-4 h-4 mr-2 ${isAuditLogsLoading ? 'animate-spin' : ''}`} /> Refresh
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[400px]">
                                    {auditLogs.length > 0 ? (
                                        <div className="divide-y relative">
                                            {auditLogs.map((log) => (
                                                <div key={log.id} className="p-4 hover:bg-muted/30 transition-colors flex items-start gap-4">
                                                    <div className="shrink-0 pt-1">
                                                        <Clock className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex justify-between items-start">
                                                            <div className="font-semibold text-sm">
                                                                {log.actorName} <span className="text-muted-foreground font-normal ml-1">modified {log.targetEntity}</span>
                                                            </div>
                                                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                                                                {new Date(log.timestamp).toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <div className="text-xs font-mono bg-muted/50 max-inline-size-max-content rounded px-2 py-1 text-primary w-fit">
                                                            {log.action}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="outline" size="sm" className="h-8 text-xs font-semibold gap-1 hover:text-red-600 hover:border-red-200 hover:bg-red-50">
                                                                    <RotateCcw className="w-3 h-3" /> Rollback
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="text-red-600">Revert System State?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        You are about to roll back <strong className="text-red-500">{log.targetEntity}</strong> to the state it was in right before {new Date(log.timestamp).toLocaleString()}.
                                                                        This will immediately disconnect all overriding permissions made since then.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleRollback(log.id)}>Confirm Rollback</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-12 text-center">
                                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                                                <Clock className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <h3 className="font-semibold">No history recorded</h3>
                                            <p className="text-sm text-muted-foreground">There are currently no recorded configuration changes in the system.</p>
                                        </div>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

