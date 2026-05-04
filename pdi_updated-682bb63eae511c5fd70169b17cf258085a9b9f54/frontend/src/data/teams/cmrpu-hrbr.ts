import { SchoolTeamData } from "../../types/schoolTeam";

export const cmrpuHrbrTeam: SchoolTeamData = {
  schoolName: "CMRPU HRBR",
  heroImage: "/images/schools/cmrpu-hero.jpg",
  accentColor: "#E63946",
  theme: {
    primary: "#1F2839",
    background: "#F5F5EF",
    accent: "#B69D74",
    highlight: "#E63946"
  },
  headMessage: {
    image: "/images/staff/angel-isaac-paul.jpg",
    content: `Dear Educators,

With immense happiness, I would like to welcome you to a new Academic Year 2023-2024. This institution is privileged to have wonderful teachers like you that are dedicated to bringing out the best and hidden talents in our students in a short span of 2 years.

I would like to share the words of Gustav, "As teachers, we have a great privilege and responsibility to impact our students' lives positively, giving them reasons to push forward and motivating them to want to succeed in life." Here we are today, with another opportunity to make an impact in the lives of our students. A new Academic year comes with new experiences, challenges and opportunities to grow and learn. Let us make use of every opportunity that presents itself to us this year with knowledge, strength and guidance to make this year yet another successful one. As teachers, we have the ability to make our students wonder, discover, question and think about things differently.

With confidence and conviction, I would like to wish all of you the very best for this year and would like to see you grow professionally and personally working together this year.`,
    author: "Ms Angel Isaac Paul",
    designation: "Principal, CMRPU HRBR"
  },
  leaders: [],
  coordinators: [
    {
      id: "sujatha-ashok",
      name: "Ms Sujatha Ashok",
      role: "Academic Coordinator",
      email: "sujatha.ashok@cmr.ac.in",
      phone: "",
      image: "/images/staff/sujatha-ashok.jpg",
      category: "coordinator"
    },
    {
      id: "savitha-n",
      name: "Ms Savitha N",
      role: "Academic Coordinator",
      email: "savitha.n@cmr.ac.in",
      phone: "",
      image: "/images/staff/savitha-n.jpg",
      category: "coordinator"
    },
    {
      id: "divya-marina-quadras",
      name: "Ms Divya Marina Quadras",
      role: "CCA Coordinator",
      email: "divya.quadras@cmr.ac.in",
      phone: "",
      image: "/images/staff/divya-marina-quadras.png",
      category: "coordinator"
    }
  ],
  instructions: [], 
  instructionCategories: [
    {
      title: "",
      items: [
        { id: "timings", title: "Timings - Bell Schedule", url: "#", description: "Official daily schedule of periods, breaks, and transition bells for all stages." },
        { id: "class-teacher-lists", title: "Class teachers and non-class teacher lists", url: "#", description: "Designated educators responsible for primary care and administrative support for each class." },
        { id: "school-calendar", title: "School Calendar", url: "#", description: "Annual academic calendar highlighting holidays, exam dates, and school events." },
        { id: "student-calendar", title: "Student calendar", url: "#", description: "Student-focused timeline of activities, project deadlines, and school celebrations." },
        { id: "assembly-duty", title: "Assembly Duty", url: "#", description: "Planning and supervision of morning gatherings, ensuring smooth student participation." },
        { id: "floor-in-charge", title: "Floor In charge", url: "#", description: "Supervision of designated floors to maintain discipline and safety during transitions." },
        { id: "class-teacher-list", title: "Class teacher list", url: "#", description: "Official list of educators assigned as class mentors for the current academic session." },
        { id: "dispersal-duty", title: "Dispersal Duty", url: "#", description: "Monitoring student exit and transport boarding at the end of the school day." },
        { id: "teacher-talk", title: "Teacher Talk", url: "#", description: "Scheduled presentations by educators to share insights and best practices with the team." },
        { id: "lunch-duty", title: "Lunch Duty", url: "#", description: "Supervision of students in the cafeteria during breaks to ensure safety and hygiene." },
        { id: "gate-duty", title: "Gate Duty", url: "#", description: "Monitoring entry and exit points to ensure security during arrival and departure." },
        { id: "room-allocation", title: "Room allocation", url: "#", description: "Assigned rooms and learning spaces for each grade and section for the current year." },
        { id: "buddy-group", title: "Buddy Group", url: "#", description: "Mentorship system pairing experienced teachers with newer staff for professional support." }
      ]
    },
    {
      title: "ACADEMIC PROGRAMS",
      items: [
        { id: "timetable", title: "Timetable", url: "#", description: "Weekly schedule of periods, subjects, and learning blocks for all grades." },
        { id: "review-schedule", title: "Review schedule", url: "#", description: "Timeline for academic reviews and feedback sessions with students and parents." },
        { id: "assessment-pattern", title: "Assessment Pattern", url: "#", description: "Detailed structure of evaluations, weightage, and marking criteria for the session." },
        { id: "online-assessment", title: "Online assessment sheets", url: "#", description: "Digital tools and platforms used for conducting and tracking student evaluations." },
        { id: "report-card", title: "Report card Timeline", url: "#", description: "Scheduled dates for result preparation, internal verification, and final publication." }
      ]
    },
    {
      title: "CO-CURRICULAR PROGRAMS",
      items: [
        { id: "events-incharge", title: "Events and Competition Incharge", url: "#", description: "Coordinators for school-wide events, inter-house competitions, and special celebrations." },
        { id: "olympiad-incharge", title: "Olympiad In charge", url: "#", description: "Coordinators for various competitive olympiad exams and student preparation." },
        { id: "teacher-blog", title: "Teacher Blog", url: "#", description: "Digital platform for educators to share pedagogical reflections and student success stories." },
        { id: "house-mistress", title: "House Mistress list", url: "#", description: "Leadership and management of house-specific activities and student motivation." },
        { id: "club-incharge", title: "Club In charge", url: "#", description: "Faculty leads responsible for managing co-curricular clubs and activity sessions." },
        { id: "field-trip", title: "Field trip and outbound trip information", url: "#", description: "Logistics and safety guidelines for off-campus learning excursions and excursions." }
      ]
    }
  ]
};
