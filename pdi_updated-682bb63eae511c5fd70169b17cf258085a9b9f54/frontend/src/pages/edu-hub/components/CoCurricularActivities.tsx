// Co-Curricular Activities Component - Updated with Full Image Editing
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Compass,
    HandHeart,
    Heartbeat,
    Briefcase,
    Target,
    Trophy,
    Code,
    MicrophoneStage,
    UsersThree,
    CaretDown,
    Info,
    ArrowRight,
    Quotes,
    CaretLeft,
    PencilSimple,
    Sparkle
} from "@phosphor-icons/react";
import { useNavigate } from 'react-router-dom';
import { cn, getAssetUrl } from "@/lib/utils";
import { sanitizeContent } from "@/utils/contentSanitizer";
import { PortalBanner } from '@/components/layout/PortalBanner';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { Button } from '@/components/ui/button';

const activityCards = [
    {
        title: "WAP Around",
        purpose: "Support social, physical, emotional, cognitive development.",
        experiences: ["High ropes", "Adventure sports", "Confidence building"],
        icon: <Compass className="w-6 h-6 text-blue-600" weight="bold" />
    },
    {
        title: "Healthy Camps",
        purpose: "Continue learning and development during holidays.",
        experiences: ["High activity", "Water sports", "Outdoor games"],
        icon: <Target className="w-6 h-6 text-emerald-600" weight="bold" />
    },
    {
        title: "Competitions & Events",
        purpose: "Discover potential and nurture confidence.",
        experiences: ["Debates", "Sports", "Cultural competitions"],
        icon: <Trophy className="w-6 h-6 text-amber-600" weight="bold" />
    },
    {
        title: "Student Clubs",
        purpose: "Gain knowledge, skills and exposure in areas of interest.",
        experiences: ["Robotics", "Coding", "Debate", "Arts"],
        icon: <Code className="w-6 h-6 text-purple-600" weight="bold" />
    },
    {
        title: "School Teams",
        purpose: "Encourage physical fitness and build school spirit.",
        experiences: ["Sports tournaments", "Team competitions"],
        icon: <UsersThree className="w-6 h-6 text-rose-600" weight="bold" />
    },
    {
        title: "Student Leaders",
        purpose: "Develop leadership and management skills.",
        experiences: ["Student councils", "Event leadership", "House captains"],
        icon: <MicrophoneStage className="w-6 h-6 text-indigo-600" weight="bold" />
    }
];

const sanitizedActivityCards = activityCards.map(card => ({
    ...card,
    experiences: card.experiences.filter(exp => exp && exp.trim() !== "" && exp.trim() !== "---")
}));

const CoCurricularActivities = ({ hideInternalBanner = false }: { hideInternalBanner?: boolean }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [data, setData] = useState({
        heroImage: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop",
        quote: "The Student Development vertical aims at enabling students in their journey of self-discovery, wellbeing, community and service to discover a world of possibilities.",
        introText: "We curate experiences that enable students to FIND their unique voice and FIND their place in the world. Every initiative in our school campus is designed with intent and executed with purpose and planning.",
        findGraphic: "/find-graphic.png",
        outboundText: "Help students make real-world connections and evolve into wholesome individuals.",
        outboundImage: "/outbound.png",
        serviceText: "Help students identify as part of the community, develop civic engagement skills and integrate meaningful service with instruction.",
        serviceImage: "/service.png",
        wellbeingText: "Every student should feel seen, heard, valued, supported and encouraged to achieve their full potential.",
        wellbeingImage: "/wellbeing.png",
        wepText: "Internships in Design, Education, Robotics, Travel, and Accountancy.",
        wepImage: "/internship.png",
        friendImage1: "/service.png",
        friendImage2: "/outbound.png",
        friendImage3: "/wellbeing.png",
        friendImage4: "/internship.png",
        friendsItemsText: 'Parent discussions\nExpert talks\nWorkshops\nDeep dive sessions',
        friendReview: "I absolutely loved interacting with the students and colleagues. The conversations were very authentic and full of curiosity.",
        friendReviewAuthor: "Parent Review",
        friendReviewInitial: "P",
        customSections: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await settingsService.getSetting("page_co_curricular");
                if (result && result.value) {
                    setData(prev => sanitizeContent({ ...prev, ...result.value }));
                }
            } catch (error) {
                console.error("Failed to fetch co-curricular content:", error);
            }
        };
        fetchData();

        // Listen for external editor trigger
        const handleOpenEditor = () => setIsEditorOpen(true);
        window.addEventListener('open-co-curricular-editor', handleOpenEditor);
        return () => window.removeEventListener('open-co-curricular-editor', handleOpenEditor);
    }, []);

    useEffect(() => {
        const handleOpenEditor = () => setIsEditorOpen(true);
        document.addEventListener('open-cocurricular-editor', handleOpenEditor);
        return () => document.removeEventListener('open-cocurricular-editor', handleOpenEditor);
    }, []);

    const canEdit = () => {
    const role = (user?.role || "").toUpperCase();
    const allowedRoles = ["ADMIN", "SUPERADMIN", "TESTER", "MANAGEMENT", "MANAGER", "LEADER", "COORDINATOR", "HEAD", "PRINCIPAL"];
    const isAllowed = allowedRoles.some(r => role.includes(r));
    return isAllowed;
  };

    const sections = [
        { id: 'overview', title: 'Overview' },
        { id: 'outbound', title: 'Outbound Learning' },
        { id: 'service', title: 'Service Learning' },
        { id: 'wellbeing', title: 'Student Wellbeing' },
        { id: 'wep', title: 'Work Exposure' },
        { id: 'programs', title: 'Programs' },
        { id: 'friends', title: 'Friends of Ekya' },
    ];

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="bg-[#FAF9F6] min-h-screen text-slate-800 selection:bg-rose-500/30">
            <PageEditorControls
                settingKey="page_co_curricular"
                initialData={data}
                onSave={setData}
                title="Co-Curricular Content"
                isOpenExternal={isEditorOpen}
                onOpenChangeExternal={setIsEditorOpen}
                hideFloatingButton={true}
                fields={[
                    { key: "heroImage", label: "Hero Background Image", type: "image" },
                    { key: "quote", label: "Main Quote (Italic)", type: "textarea" },
                    { key: "introText", label: "Introduction Text", type: "textarea" },
                    { key: "findGraphic", label: "FIND Graphic Image", type: "image" },
                    { key: "outboundText", label: "Outbound Learning Text", type: "textarea" },
                    { key: "outboundImage", label: "Outbound Section Photo", type: "image" },
                    { key: "serviceText", label: "Service Learning Text", type: "textarea" },
                    { key: "serviceImage", label: "Service Section Photo", type: "image" },
                    { key: "wellbeingText", label: "Student Wellbeing Text", type: "textarea" },
                    { key: "wellbeingImage", label: "Wellbeing Section Photo", type: "image" },
                    { key: "wepText", label: "Work Exposure Text", type: "textarea" },
                    { key: "wepImage", label: "WEP Section Photo", type: "image" },
                    { key: "friendImage1", label: "Friends Gallery Photo 1", type: "image" },
                    { key: "friendImage2", label: "Friends Gallery Photo 2", type: "image" },
                    { key: "friendImage3", label: "Friends Gallery Photo 3", type: "image" },
                    { key: "friendImage4", label: "Friends Gallery Photo 4", type: "image" },
                    { key: "friendsItemsText", label: "Friends of Ekya Items (1 per line)", type: "textarea" },
                    { key: "friendReview", label: "Friend Review Text", type: "textarea" },
                    { key: "friendReviewAuthor", label: "Review Author Name", type: "input" },
                    { key: "friendReviewInitial", label: "Review Author Initial", type: "input" },
                    { 
                        key: "customSections", 
                        label: "Add New Sections", 
                        type: "list",
                        itemFields: [
                            { key: "title", label: "Section Title", type: "input" },
                            { key: "image", label: "Section Image", type: "image" },
                            { key: "content", label: "Section Content", type: "textarea" }
                        ]
                    }
                ]}
            />


            {!hideInternalBanner && (
                <PortalBanner
                    title="Student Development"
                    subtitle="Our co-curricular programs, student leadership, and wellbeing initiatives."
                    icon={Sparkle}
                    onBack={() => navigate('/edu-hub')}
                    onEdit={() => setIsEditorOpen(true)}
                    canEdit={canEdit()}
                    backgroundImage={data.heroImage}
                    className="mt-6 mb-12"
                >
                    <div className="flex items-center gap-4 md:gap-8 overflow-x-auto scrollbar-none">

                        {sections.map(s => (
                            <button 
                                key={s.id}
                                onClick={() => scrollTo(s.id)}
                                className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all whitespace-nowrap"
                            >
                                {s.title}
                            </button>
                        ))}
                    </div>

                </PortalBanner>
            )}

            <div className="flex flex-col">

                <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-32">
                    {/* Subtext Section */}
                    <section className="text-center max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-1000">
                        <p className="text-2xl md:text-4xl text-slate-700 font-medium leading-tight italic">
                            {data.quote}
                        </p>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                            {data.introText}
                        </p>
                    </section>

                    {/* 2. FIND YOUR PLACE IN THE WORLD */}
                    <section className="space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary">Your Journey</h2>
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800">FIND YOUR PLACE IN THE WORLD</h3>
                        </div>

                        <div className="relative rounded-3xl overflow-hidden aspect-[21/9] group shadow-xl">
                            <img
                                src={getAssetUrl(data.findGraphic)}
                                alt="FIND Graphic"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                        </div>

                        <div className="space-y-32">
                            {/* 3. OUTBOUND LEARNING */}
                            <div id="outbound" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="p-3 bg-blue-50 rounded-2xl w-fit">
                                        <Compass className="w-8 h-8 text-blue-500" weight="fill" />
                                    </div>
                                    <h4 className="text-4xl font-black tracking-tight text-slate-900">OUTBOUND LEARNING</h4>
                                    <p className="text-slate-500 text-lg leading-relaxed">
                                        {data.outboundText}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['Experiential Learning', 'Adventure', 'Sustainability', 'Service'].map(tag => (
                                            <div key={tag} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">
                                                • {tag}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border-l-4 border-blue-500 shadow-lg">
                                        <Quotes className="w-6 h-6 text-blue-500 mb-2 opacity-50" weight="fill" />
                                        <p className="text-md italic text-slate-700 font-medium leading-relaxed">
                                            "I have learnt to understand and respect the balance of the ecosystem and how human intervention deeply affects the life of the forest."
                                        </p>
                                        <div className="mt-4 text-[10px] font-black uppercase text-blue-500 tracking-widest">STUDENT VOICE</div>
                                    </div>
                                </motion.div>
                                <div className="rounded-3xl overflow-hidden aspect-square md:aspect-[4/5] shadow-2xl">
                                    <img src={getAssetUrl(data.outboundImage)} className="w-full h-full object-cover" alt="Outbound Learning" />
                                </div>
                            </div>

                            {/* 4. SERVICE LEARNING PROGRAM */}
                            <div id="service" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className="rounded-3xl overflow-hidden aspect-square md:aspect-[4/5] shadow-2xl order-2 md:order-1">
                                    <img src={getAssetUrl(data.serviceImage)} className="w-full h-full object-cover" alt="Service Learning" />
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="space-y-6 order-1 md:order-2"
                                >
                                    <div className="p-3 bg-red-50 rounded-2xl w-fit">
                                        <HandHeart className="w-8 h-8 text-primary" weight="fill" />
                                    </div>
                                    <h4 className="text-4xl font-black tracking-tight text-slate-900">SERVICE LEARNING PROGRAM</h4>
                                    <p className="text-slate-500 text-lg leading-relaxed">
                                        {data.serviceText}
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {['Fundraisers', 'Volunteering', 'Research', 'Advocacy'].map(tag => (
                                            <div key={tag} className="px-4 py-2 bg-primary/5 border border-primary/20 rounded-full text-xs font-bold text-primary">
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border-l-4 border-primary shadow-lg">
                                        <p className="text-md italic text-slate-700 font-medium leading-relaxed">
                                            "The energy level from the students is great. The fundraiser for cataract surgeries is really amazing. You are supporting 75 underprivileged individuals."
                                        </p>
                                        <div className="mt-4 text-[10px] font-black uppercase text-primary tracking-widest">PARENT VOICE</div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* 5. STUDENT WELLBEING */}
                            <div id="wellbeing" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    className="space-y-6"
                                >
                                    <div className="p-3 bg-emerald-50 rounded-2xl w-fit">
                                        <Heartbeat className="w-8 h-8 text-emerald-500" weight="fill" />
                                    </div>
                                    <h4 className="text-4xl font-black tracking-tight text-slate-900">STUDENT WELLBEING</h4>
                                    <p className="text-slate-500 text-lg leading-relaxed">
                                        {data.wellbeingText}
                                    </p>
                                    <div className="space-y-4">
                                        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                                            <div className="font-bold text-xs uppercase tracking-widest text-emerald-500 mb-3">Student Experiences</div>
                                            <ul className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-300" /> Awareness programs</li>
                                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-300" /> Counselling sessions</li>
                                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-300" /> General check-ins</li>
                                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-300" /> Workshops</li>
                                            </ul>
                                        </div>
                                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                            <div className="font-bold text-xs uppercase tracking-widest text-primary mb-2">Parent Support</div>
                                            <p className="text-xs text-slate-600 font-medium">Parent awareness sessions & Friday Open Lines (2pm-4pm)</p>
                                        </div>
                                    </div>
                                </motion.div>
                                <div className="rounded-3xl overflow-hidden aspect-video shadow-2xl relative border-4 border-white">
                                    <img src={getAssetUrl(data.wellbeingImage)} className="w-full h-full object-cover" alt="Student Wellbeing" />
                                </div>
                            </div>

                            {/* 6. WORK EXPOSURE PROGRAM */}
                            <div id="wep" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className="rounded-3xl overflow-hidden aspect-square md:aspect-[16/10] shadow-2xl order-2 md:order-1 border-4 border-white">
                                    <img src={getAssetUrl(data.wepImage)} className="w-full h-full object-cover" alt="Internship" />
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="space-y-6 order-1 md:order-2"
                                >
                                    <div className="p-3 bg-amber-50 rounded-2xl w-fit">
                                        <Briefcase className="w-8 h-8 text-amber-500" weight="fill" />
                                    </div>
                                    <h4 className="text-4xl font-black tracking-tight text-slate-900">WORK EXPOSURE PROGRAM (WEP)</h4>
                                    <p className="text-slate-500 text-lg leading-relaxed font-medium">
                                        {data.wepText}
                                    </p>
                                    <div className="bg-white p-8 rounded-2xl border-l-4 border-amber-500 shadow-xl">
                                        <Quotes className="w-6 h-6 text-amber-500 mb-2" weight="fill" />
                                        <p className="text-md italic text-slate-700 leading-relaxed">
                                            "WEP helped me improve my skills in writing, speaking as well as presenting. I became even more confident."
                                        </p>
                                        <div className="mt-4 text-[10px] font-black uppercase text-amber-500 tracking-widest">STUDENT VOICE</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* 7. FIND YOUR UNIQUE VOICE */}
                    <section className="relative py-24 rounded-[3rem] overflow-hidden bg-[#F1F5F9] border border-slate-200">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />

                        <div className="text-center space-y-4 relative z-10">
                            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-blue-500">Discover</h2>
                            <h3 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">YOUR UNIQUE VOICE</h3>
                        </div>

                        {/* 8. ACTIVITY PROGRAM GRID */}
                        <div id="programs" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20 relative z-10">
                            {sanitizedActivityCards.map((card, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group bg-white border border-primary/20 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-blue-400/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-0 bg-blue-500 group-hover:h-full transition-all duration-500" />
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="p-3 bg-blue-50 rounded-2xl">
                                                {card.icon}
                                            </div>
                                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">EKYA SD</div>
                                        </div>
                                        <div>
                                            <h5 className="text-xl font-black tracking-tight text-slate-800 group-hover:text-blue-500 transition-colors uppercase">{card.title}</h5>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <div className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Purpose</div>
                                                <p className="text-xs text-slate-500 leading-relaxed font-medium">{card.purpose}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Experiences</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {card.experiences.map(exp => (
                                                        <span key={exp} className="px-2 py-1 bg-slate-50 rounded text-[10px] text-slate-500 font-bold border border-primary/20">{exp}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* 9. FRIENDS OF EKYA */}
                    <section id="friends" className="space-y-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-4">Community</h2>
                                    <h3 className="text-5xl font-black tracking-tighter text-slate-900">Friends of Ekya</h3>
                                </div>
                                <p className="text-lg text-slate-500 leading-relaxed font-medium">
                                    Create an authentic and aware community by listening to diverse voices about diverse topics.
                                </p>
                                <div className="space-y-4">
                                    {(data.friendsItemsText || "").split('\n').filter(item => item && item.trim() !== "" && item.trim() !== "---").map(item => (
                                        <div key={item} className="flex items-center gap-3 text-sm font-black text-slate-700">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                <div className="p-8 bg-white rounded-3xl border border-primary/20 shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem]" />
                                    <p className="text-lg italic text-slate-700 leading-relaxed font-medium relative z-10">
                                        {data.friendReview}
                                    </p>
                                    <div className="mt-8 flex items-center gap-4 relative z-10">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center text-primary font-bold">{data.friendReviewInitial}</div>
                                        <div className="text-xs font-black tracking-widest text-primary uppercase">{data.friendReviewAuthor}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4 pt-12">
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                        <img src={getAssetUrl(data.friendImage1)} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Friend" />
                                    </div>
                                    <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                        <img src={getAssetUrl(data.friendImage2)} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Friend" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                        <img src={getAssetUrl(data.friendImage3)} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Friend" />
                                    </div>
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                        <img src={getAssetUrl(data.friendImage4)} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Friend" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Custom Sections */}
                    {data.customSections && data.customSections.map((section: any, idx: number) => (
                        <section key={'custom-'+idx} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Sparkle className="w-6 h-6" weight="duotone" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">{section.title}</h3>
                                </div>
                            </div>
                            
                            {section.image && (
                                <div className="mb-8 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm">
                                    <img src={getAssetUrl(section.image)} alt={section.title || 'Custom Section Image'} className="w-full h-[400px] object-cover" />
                                </div>
                            )}
                            
                            {section.content && (
                                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-primary/10 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20" />
                                    <p className="text-xl text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                                        {section.content}
                                    </p>
                                </div>
                            )}
                        </section>
                    ))}

                    {/* 10. FOOTER */}
                    <footer className="pt-20 pb-12 border-t border-slate-200 text-center space-y-12">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4">
                            <div className="flex items-center gap-4">
                                <div className="text-left">
                                    <div className="text-2xl font-black tracking-tighter uppercase leading-none text-slate-900">EKYA <span className="text-primary italic">SCHOOLS</span></div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Part of the CMR Group</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                {['Facebook', 'Instagram', 'LinkedIn', 'Website'].map(social => (
                                    <button key={social} className="text-xs font-black text-slate-400 hover:text-primary transition-colors tracking-widest uppercase">{social}</button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
                                © {new Date().getFullYear()} EKYA SCHOOLS. ALL RIGHTS RESERVED.
                            </p>
                            <p className="text-[9px] text-slate-200 max-w-2xl mx-auto italic">
                                This page is for informational purposes only. The Student Development vertical at Ekya Schools focuses on holistic development through intentional planning and purposeful execution.
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default CoCurricularActivities;
