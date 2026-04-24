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
      title: "GENERAL INSTRUCTIONS",
      items: [
        { id: "timings", title: "Timings - Bell Schedule", url: "#" },
        { id: "class-teacher-lists", title: "Class teachers and non-class teacher lists (In progress)", url: "#" },
        { id: "school-calendar", title: "School Calendar (In progress)", url: "#" },
        { id: "student-calendar", title: "Student calendar (In progress)", url: "#" },
        { id: "assembly-duty", title: "Assembly Duty (In progress)", url: "#" },
        { id: "floor-in-charge", title: "Floor In charge (In progress)", url: "#" },
        { id: "class-teacher-list", title: "Class teacher list (In progress)", url: "#" },
        { id: "dispersal-duty", title: "Dispersal Duty (In progress)", url: "#" },
        { id: "teacher-talk", title: "Teacher Talk (In progress)", url: "#" },
        { id: "lunch-duty", title: "Lunch Duty (In progress)", url: "#" },
        { id: "gate-duty", title: "Gate Duty (In progress)", url: "#" },
        { id: "room-allocation", title: "Room allocation (In progress)", url: "#" },
        { id: "buddy-group", title: "Buddy Group (In progress)", url: "#" }
      ]
    },
    {
      title: "ACADEMIC PROGRAMS",
      items: [
        { id: "timetable", title: "Timetable", url: "#" },
        { id: "review-schedule", title: "Review schedule (Will be available by June 1st week)", url: "#" },
        { id: "assessment-pattern", title: "Assessment Pattern (Will be available by June 1st week)", url: "#" },
        { id: "online-assessment", title: "Online assessment sheets (Will be available in June)", url: "#" },
        { id: "report-card", title: "Report card Timeline (Will be available in June)", url: "#" }
      ]
    },
    {
      title: "CO-CURRICULAR PROGRAMS",
      items: [
        { id: "events-incharge", title: "Events and Competition Incharge", url: "#" },
        { id: "olympiad-incharge", title: "Olympiad In charge", url: "#" },
        { id: "teacher-blog", title: "Teacher Blog", url: "#" },
        { id: "house-mistress", title: "House Mistress list", url: "#" },
        { id: "club-incharge", title: "Club In charge", url: "#" },
        { id: "field-trip", title: "Field trip and outbound trip information (In progress)", url: "#" }
      ]
    }
  ]
};
