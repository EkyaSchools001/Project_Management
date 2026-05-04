export interface ReflectionRating {
    indicator: string;
    rating: "Basic" | "Developing" | "Effective" | "Highly Effective";
}

export interface ReflectionSection {
    id: string;
    title: string;
    ratings: ReflectionRating[];
    evidence: string;
}

export interface DetailedReflection {
    teacherName: string;
    teacherEmail: string;
    submissionDate: string;
    sections: {
        planning: ReflectionSection; // Section A
        classroomEnvironment: ReflectionSection; // Section B1
        instruction: ReflectionSection; // Section B2
        assessment: ReflectionSection; // Section B3
        environment: ReflectionSection; // Section B4
        professionalism: ReflectionSection; // Section C
    };
    strengths: string;
    improvements: string;
    goal: string;
    comments?: string;
    timestampedNotes?: { time: string; note: string }[];
}

export type DanielsonRatingScale = "Basic" | "Developing" | "Effective" | "Highly Effective" | "Not Observed";

export interface DanielsonIndicator {
    name: string;
    rating: DanielsonRatingScale;
}

export interface DanielsonParameter {
    name: string;
    rating: DanielsonRatingScale;
    note?: string;
}

export interface DanielsonSubDomain {
    id: string;
    title: string;
    parameters: DanielsonParameter[];
}

export interface DanielsonDomain {
    domainId: string;
    title: string;
    indicators?: DanielsonIndicator[];
    subDomains?: DanielsonSubDomain[];
    evidence: string;
}

export interface Observation {
    id: string;
    teacher?: string; // Optional for leader dashboard view context
    type?: string;
    teacherId?: string;
    observerId?: string;
    teacherEmail?: string;
    date: string;
    updatedAt?: string;
    endDate?: string;
    time?: string;
    observerName?: string;
    observerEmail?: string;
    observerRole?: string;
    campus?: string;
    domain: string;
    score: number;
    overallRating?: string | number;
    notes?: string;
    hasReflection: boolean;
    isReflected?: boolean;
    reflection?: string; // Legacy simple string
    detailedReflection?: DetailedReflection; // New structured data
    // Unified Danielson Framework Data
    domains?: DanielsonDomain[];
    routines?: string[];
    cultureTools?: string[];
    instructionalTools?: string[];
    learningAreaTools?: string[];
    metaTags?: string[];
    tools?: string[];
    otherComment?: string;
    discussionMet?: boolean;
    teacherReflection?: string;
    actionStep?: string;
    additionalNotes?: string;
    // Extended fields for full reporting
    learningArea?: string;
    strengths?: string;
    areasOfGrowth?: string;
    improvements?: string;
    feedback?: string;
    actionSteps?: string;
    nextSteps?: string;
    timestampedNotes?: { time: string; note: string }[];
    status?: "DRAFT" | "SUBMITTED" | "REVIEWED" | "PUBLISHED" | "CERTIFIED";
    teachingStrategies?: string[];
    glows?: string;
    grows?: string;
    classroom?: {
        block: string;
        grade: string;
        section: string;
        learningArea: string;
    };
    cluster?: string;
    sessionType?: string;
    engagementScore?: number;
    deliveryScore?: number;
    outcomeNotes?: string;
    peerReview?: string;
}
