import React, { useState, useEffect } from 'react';
import {
    Megaphone,
    Calendar,
    Bell,
    Plus,
    MoreVertical,
    Trash2,
    Edit,
    Eye,
    CheckCircle2,
    Pin,
    Search,
    User as UserIcon,
    Shield,
    Users,
    ChevronDown,
    ListFilter,
    XCircle
} from 'lucide-react';
import { PageHeader } from '@pdi/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@pdi/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@pdi/components/ui/table';
import { ScrollArea } from '@pdi/components/ui/scroll-area';

import { useAuth } from '@pdi/hooks/useAuth';
import { Role } from '@pdi/components/RoleBadge';
import { Button } from '@pdi/components/ui/button';
import { Badge } from '@pdi/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@pdi/components/ui/dialog';
import { Input } from '@pdi/components/ui/input';
import { Label } from '@pdi/components/ui/label';
import { Textarea } from '@pdi/components/ui/textarea';
import {
    SelectValue,
    SelectGroup,
    SelectLabel
} from '@pdi/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@pdi/components/ui/dropdown-menu";
import { Checkbox } from '@pdi/components/ui/checkbox';
import { announcementService, Announcement } from '@pdi/services/announcementService';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@pdi/lib/utils';
import { getSocket } from '@pdi/lib/socket';
import { AnnouncementFormModal } from '@pdi/components/announcements/AnnouncementFormModal';

const AnnouncementsPage: React.FC = () => {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Acknowledgement stats
    const [announcementStats, setAnnouncementStats] = useState<{ count: number, users: any[] } | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(false);

    // Column-level Filters
    const [nameFilter, setNameFilter] = useState('');
    const [priorityColumnFilter, setPriorityColumnFilter] = useState('all');
    const [creatorFilter, setCreatorFilter] = useState('');
    const [dateColumnFilter, setDateColumnFilter] = useState('');
    const [statusColumnFilter, setStatusColumnFilter] = useState('all');

    const userRole = user?.role?.toUpperCase() || '';

    // Explicitly check for authorized roles to avoid accidental teacher access
    const isCreatorRole = ['ADMIN', 'SUPERADMIN', 'LEADER', 'SCHOOL_LEADER', 'MANAGEMENT', 'COORDINATOR', 'HOS'].includes(userRole) && userRole !== 'TEACHER';

    useEffect(() => {
        fetchAnnouncements();

        // Socket listener for new announcements
        const socket = getSocket();
        socket.on('announcement:new', (newAnn: Announcement) => {
            setAnnouncements(prev => {
                if (prev.some(a => a.id === newAnn.id)) return prev;
                return [newAnn, ...prev];
            });
            toast.info(`New Announcement: ${newAnn.title}`);
        });

        socket.on('announcement:updated', (updatedAnn: Announcement) => {
            setAnnouncements(prev => prev.map(a => a.id === updatedAnn.id ? { ...a, ...updatedAnn } : a));
        });

        socket.on('announcement:deleted', (data: { id: string }) => {
            setAnnouncements(prev => prev.filter(a => a.id !== data.id));
        });

        socket.on('announcement:acknowledged', () => {
            // Refresh stats if a modal is open
            // We could be more surgical but this is safe
        });

        return () => {
            socket.off('announcement:new');
            socket.off('announcement:updated');
            socket.off('announcement:deleted');
            socket.off('announcement:acknowledged');
        };
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const data = await announcementService.getAnnouncements();
            setAnnouncements(data);
        } catch (error) {
            console.error('Failed to fetch announcements', error);
            toast.error('Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    const handleAcknowledge = async (id: string) => {
        try {
            await announcementService.acknowledgeAnnouncement(id);
            setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isAcknowledged: true } : a));
            toast.success('Announcement acknowledged');
        } catch (error) {
            toast.error('Failed to acknowledge');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;
        try {
            await announcementService.deleteAnnouncement(id);
            setAnnouncements(prev => prev.filter(a => a.id !== id));
            toast.success('Announcement deleted');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const handleCreateSuccess = (newAnn: Announcement) => {
        setAnnouncements(prev => {
            if (prev.some(a => a.id === newAnn.id)) return prev;
            return [newAnn, ...prev];
        });
    };

    const handleViewDetails = async (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsViewModalOpen(true);
        setAnnouncementStats(null);

        if (isCreatorRole) {
            try {
                setIsLoadingStats(true);
                const stats = await announcementService.getAnnouncementStats(announcement.id);
                setAnnouncementStats(stats);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setIsLoadingStats(false);
            }
        }
    };

    const filteredAnnouncements = announcements.filter(a => {
        const matchesTitle = !nameFilter || a.title.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesPriority = priorityColumnFilter === 'all' || a.priority === priorityColumnFilter;
        const matchesCreator = !creatorFilter ||
            a.createdBy?.fullName.toLowerCase().includes(creatorFilter.toLowerCase()) ||
            a.createdBy?.role.toLowerCase().includes(creatorFilter.toLowerCase());
        const matchesDate = !dateColumnFilter || format(new Date(a.createdAt), 'MMM d, yyyy').toLowerCase().includes(dateColumnFilter.toLowerCase());

        const status = a.isAcknowledged ? 'acknowledged' : 'pending';
        const matchesStatus = statusColumnFilter === 'all' || status === statusColumnFilter;

        // Still hide archived by default if no active tab, but since we removed tabs, we can let user filter if we add it.
        // For now, keep it showing active only.
        const isActive = a.status !== 'Archived';

        return matchesTitle && matchesPriority && matchesCreator && matchesDate && matchesStatus && isActive;
    });

    const getPriorityBadge = (priority: string) => {
        if (priority === 'High') {
            return <Badge variant="destructive" className="bg-red-500 text-foreground font-bold capitalize tracking-wider text-[10px]">High Priority</Badge>;
        }
        return <Badge variant="secondary" className="bg-backgroundlue-100 text-blue-700 font-bold capitalize tracking-wider text-[10px]">Normal</Badge>;
    };

    return (

        <div className="container mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <PageHeader
                    title="Announcements"
                    subtitle="Key updates, news, and communications for the TD community"
                />
                {isCreatorRole && (
                    <Button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2">
                        <Plus className="w-4 h-4" />
                        Post Announcement
                    </Button>
                )}
            </div>



            <div className="w-full">
                <Card className="shadow-lg border-muted/50 overflow-hidden">
                        <ScrollArea className="w-full h-[600px] overflow-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead className="w-[150px] text-zinc-900">
                                            <div className="flex items-center gap-1.5 pt-1">
                                                <span className="font-bold">Priority</span>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted rounded-full">
                                                            <ChevronDown className={cn("h-3 w-3", priorityColumnFilter !== 'all' && "text-primary")} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start">
                                                        <DropdownMenuItem onClick={() => setPriorityColumnFilter('all')}>All</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setPriorityColumnFilter('High')}>High Priority</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setPriorityColumnFilter('Normal')}>Normal</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-zinc-900">
                                            <div className="flex items-center gap-1.5 pt-1">
                                                <span className="font-bold">Title</span>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted rounded-full">
                                                            <Search className={cn("h-3 w-3", nameFilter && "text-primary")} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" className="w-64 p-2">
                                                        <Input 
                                                            placeholder="Search title..." 
                                                            className="h-8 text-xs mb-1"
                                                            value={nameFilter}
                                                            onChange={(e) => setNameFilter(e.target.value)}
                                                            autoFocus
                                                        />
                                                        <Button variant="ghost" className="w-full h-7 text-[10px] justify-start px-2 hover:text-primary" onClick={() => setNameFilter("")}>Clear</Button>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-zinc-900">
                                            <div className="flex items-center gap-1.5 pt-1">
                                                <span className="font-bold">Creator</span>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted rounded-full">
                                                            <UserIcon className={cn("h-3 w-3", creatorFilter && "text-primary")} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" className="w-64 p-2">
                                                        <Input 
                                                            placeholder="Search creator..." 
                                                            className="h-8 text-xs mb-1"
                                                            value={creatorFilter}
                                                            onChange={(e) => setCreatorFilter(e.target.value)}
                                                            autoFocus
                                                        />
                                                        <Button variant="ghost" className="w-full h-7 text-[10px] justify-start px-2 hover:text-primary" onClick={() => setCreatorFilter("")}>Clear</Button>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-zinc-900">
                                            <div className="flex items-center gap-1.5 pt-1">
                                                <span className="font-bold">Date</span>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted rounded-full">
                                                            <Calendar className={cn("h-3 w-3", dateColumnFilter && "text-primary")} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" className="w-56 p-2">
                                                        <Input 
                                                            placeholder="Filter date..." 
                                                            className="h-8 text-xs mb-1"
                                                            value={dateColumnFilter}
                                                            onChange={(e) => setDateColumnFilter(e.target.value)}
                                                            autoFocus
                                                        />
                                                        <Button variant="ghost" className="w-full h-7 text-[10px] justify-start px-2 hover:text-primary" onClick={() => setDateColumnFilter("")}>Clear</Button>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableHead>
                                        <TableHead className="w-[150px] text-zinc-900">
                                            <div className="flex items-center gap-1.5 pt-1">
                                                <span className="font-bold">Status</span>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted rounded-full">
                                                            <ListFilter className={cn("h-3 w-3", statusColumnFilter !== 'all' && "text-primary")} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start">
                                                        <DropdownMenuItem onClick={() => setStatusColumnFilter('all')}>All</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setStatusColumnFilter('acknowledged')}>Acknowledged</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setStatusColumnFilter('pending')}>Pending</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-right w-[250px] text-zinc-900">
                                            <div className="flex items-center justify-end gap-2 pt-1">
                                                <span className="font-bold">Actions</span>
                                                {(nameFilter || priorityColumnFilter !== 'all' || creatorFilter || dateColumnFilter || statusColumnFilter !== 'all') && (
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-primary hover:bg-primary/5 rounded-full" onClick={() => {
                                                        setNameFilter("");
                                                        setPriorityColumnFilter("all");
                                                        setCreatorFilter("");
                                                        setDateColumnFilter("");
                                                        setStatusColumnFilter("all");
                                                    }}>
                                                        <XCircle className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array(4).fill(0).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell colSpan={6} className="h-16 bg-muted/20 animate-pulse border-b" />
                                            </TableRow>
                                        ))
                                    ) : filteredAnnouncements.length > 0 ? (
                                        filteredAnnouncements.map((announcement) => (
                                            <TableRow
                                                key={announcement.id}
                                                className={cn(
                                                    "group hover:bg-muted/10 transition-colors cursor-pointer",
                                                    announcement.priority === 'High' ? "border-l-4 border-l-destructive" : "border-l-4 border-l-primary/40"
                                                )}
                                                onClick={() => handleViewDetails(announcement)}
                                            >
                                                <TableCell>
                                                    {getPriorityBadge(announcement.priority)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 font-bold text-gray-900 group-hover:text-primary transition-colors">
                                                        {announcement.isPinned && <Pin className="w-3.5 h-3.5 text-amber-500 fill-current" />}
                                                        <span className="truncate max-w-[250px]">{announcement.title}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium whitespace-nowrap">
                                                        <UserIcon className="w-3.5 h-3.5" />
                                                        {announcement.createdBy?.fullName} ({announcement.createdBy?.role})
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium whitespace-nowrap">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {format(new Date(announcement.createdAt), 'MMM d, yyyy')}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {announcement.isAcknowledged ? (
                                                        <Badge variant="outline" className="text-emerald-600 bg-backgroundmerald-50 border-emerald-100 font-bold capitalize tracking-wider text-[10px] gap-1 whitespace-nowrap">
                                                            <CheckCircle2 className="w-3 h-3" /> Acknowledged
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic font-medium">Pending</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
                                                        <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-primary hover:bg-primary/5 gap-1.5" onClick={() => handleViewDetails(announcement)}>
                                                            <Eye className="w-3.5 h-3.5" /> View
                                                        </Button>

                                                        {!announcement.isAcknowledged && (user?.role === 'TEACHER' || user?.role === 'LEADER') && (
                                                            <Button size="sm" className="h-8 text-xs font-bold bg-primary hover:bg-primary/90 gap-1.5 px-3" onClick={() => handleAcknowledge(announcement.id)}>
                                                                <CheckCircle2 className="w-3 h-3" /> Ack
                                                            </Button>
                                                        )}

                                                        {(announcement.createdById === user?.id || ['ADMIN', 'SUPERADMIN'].includes(userRole)) && (
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(announcement.id)}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-64">
                                                <div className="flex flex-col items-center justify-center space-y-4">
                                                    <div className="p-4 rounded-full bg-muted/50">
                                                        <Megaphone className="w-12 h-12 text-muted-foreground opacity-30" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-muted-foreground font-bold italic">No announcements found matching your criteria.</p>
                                                        <Button variant="link" className="mt-2" onClick={() => {
                                                            setNameFilter('');
                                                            setPriorityColumnFilter('all');
                                                            setCreatorFilter('');
                                                            setDateColumnFilter('');
                                                            setStatusColumnFilter('all');
                                                        }}>Clear all filters</Button>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </Card>
            </div>

            {/* Create Modal */}
            <AnnouncementFormModal
                isOpen={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSuccess={handleCreateSuccess}
                userRole={userRole}
            />

            {/* View Details Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-2 shadow-2xl">
                    <DialogHeader className="sr-only">
                        <DialogTitle>{selectedAnnouncement?.title || "Announcement Details"}</DialogTitle>
                        <DialogDescription>
                            Detailed view of the selected announcement.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedAnnouncement && (
                        <div className="flex flex-col">
                            <div className={cn(
                                "p-8 text-foreground",
                                selectedAnnouncement.priority === 'High' ? "bg-destructive" : "bg-primary"
                            )}>
                                <div className="flex justify-between items-start mb-4">
                                    {getPriorityBadge(selectedAnnouncement.priority)}
                                    <Button variant="ghost" size="icon" className="text-foreground hover:bg-white/10 -mt-2 -mr-2" onClick={() => setIsViewModalOpen(false)}>
                                        <XCircle className="w-5 h-5 transition-transform hover:rotate-90" />
                                    </Button>
                                </div>
                                <h2 className="text-3xl font-black tracking-tight">{selectedAnnouncement.title}</h2>
                                <div className="flex flex-wrap items-center gap-4 mt-6 text-foreground/80 text-sm font-medium">
                                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                                        <UserIcon className="w-4 h-4" />
                                        {selectedAnnouncement.createdBy?.fullName}
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                                        <Calendar className="w-4 h-4" />
                                        {format(new Date(selectedAnnouncement.createdAt), 'MMMM d, yyyy')}
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                                        <Shield className="w-4 h-4" />
                                        {selectedAnnouncement.role || 'TD'}
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-backgroundackground">
                                <ScrollArea className="max-h-[400px]">
                                    <div className="prose prose-slate max-w-none">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                                            {selectedAnnouncement.description}
                                        </p>
                                    </div>

                                    {isCreatorRole && (
                                        <div className="mt-8 pt-6 border-t">
                                            <h4 className="text-sm font-bold text-muted-foreground capitalize tracking-widest flex items-center gap-2 mb-4">
                                                <CheckCircle2 className="w-4 h-4" /> Acknowledgement Status
                                            </h4>
                                            {isLoadingStats ? (
                                                <div className="text-sm text-muted-foreground animate-pulse">Loading stats...</div>
                                            ) : announcementStats ? (
                                                <div className="space-y-4">
                                                    <div className="text-2xl font-black text-primary">
                                                        {announcementStats.count} <span className="text-base font-medium text-muted-foreground">users have acknowledged</span>
                                                    </div>
                                                    {announcementStats.users.length > 0 && (
                                                        <div className="bg-backgroundackground rounded-xl border shadow-sm overflow-hidden">
                                                            <ScrollArea className="h-[250px] w-full">
                                                                <Table>
                                                                    <TableHeader className="bg-muted/30 sticky top-0 z-10">
                                                                        <TableRow>
                                                                            <TableHead className="font-bold text-zinc-900">User</TableHead>
                                                                            <TableHead className="font-bold text-zinc-900">Role</TableHead>
                                                                            <TableHead className="font-bold text-right text-zinc-900">Campus</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {announcementStats.users.map((u: any, idx: number) => (
                                                                            <TableRow key={idx}>
                                                                                <TableCell className="font-medium">{u.fullName}</TableCell>
                                                                                <TableCell className="text-muted-foreground">{u.role}</TableCell>
                                                                                <TableCell className="text-right text-muted-foreground">{u.campusId || "-"}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </ScrollArea>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    )}
                                </ScrollArea>

                                <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground capitalize tracking-widest">
                                        <span className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4" />
                                            Target: {JSON.parse(selectedAnnouncement.targetRoles).length > 0
                                                ? JSON.parse(selectedAnnouncement.targetRoles).join(', ')
                                                : 'All Roles'}
                                        </span>
                                    </div>
                                    {!selectedAnnouncement.isAcknowledged && (user?.role === 'TEACHER' || user?.role === 'LEADER') && (
                                        <Button className="w-full md:w-auto px-10 py-6 text-lg font-black capitalize tracking-widest gap-2 bg-backgroundmerald-600 hover:bg-backgroundmerald-700 shadow-lg shadow-emerald-500/20" onClick={() => {
                                            handleAcknowledge(selectedAnnouncement.id);
                                            setIsViewModalOpen(false);
                                        }}>
                                            <CheckCircle2 className="w-6 h-6" /> Acknowledge This Update
                                        </Button>
                                    )}
                                    {selectedAnnouncement.isAcknowledged && (
                                        <div className="flex items-center gap-2 text-emerald-600 font-bold bg-backgroundmerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
                                            <CheckCircle2 className="w-5 h-5" />
                                            You have acknowledged this
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>

    );
};

export default AnnouncementsPage;
