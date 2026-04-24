import { SchoolTeamData } from "../../types/schoolTeam";

export const ekyaByrathiTeam: SchoolTeamData = {
  schoolName: "EKYA BYRATHI",
  heroImage: "/images/schools/byrathi-hero.png",
  accentColor: "#B69D74",
  theme: {
    primary: "#1F2839",
    background: "#F5F5EF",
    accent: "#B69D74",
    highlight: "#E63946"
  },
  leaders: [
    {
      id: "jinu-harikesh",
      name: "Ms. Jinu Harikesh Pavithran",
      role: "Head of School",
      email: "hos.byrathi@ekyaschools.com",
      phone: "+91 9482336354",
      image: "/images/staff/jinu-harikesh.jpg",
      category: "leader"
    }
  ],
  coordinators: [
    {
      id: "suma-mohan",
      name: "Ms. Suma Mohan",
      role: "Academic Coordinator",
      email: "coordinator.byrathi@ekyaschools.com",
      phone: "+91 8762385697",
      image: "/images/staff/suma-mohan.jpg",
      category: "coordinator"
    },
    {
      id: "indrani-das",
      name: "Ms. Indrani Das",
      role: "CCA Coordinator",
      email: "ccacoordinator.byrathi@ekyaschools.com",
      phone: "+91 7002193320",
      image: "/images/staff/indrani-das.jpg",
      category: "coordinator"
    }
  ],
  instructions: [
    { id: "staff-list", title: "Staff List", url: "#", description: "Comprehensive directory of all academic and support staff members at this campus." },
    { id: "timings", title: "Timings – Bell Schedule", url: "#", description: "Official daily schedule of periods, breaks, and transition bells for all stages." },
    { id: "class-teachers", title: "Class teachers and non-class teacher lists", url: "#", description: "Designated educators responsible for primary care and administrative support for each class." },
    { id: "assembly-duty", title: "Assembly Duty", url: "#", description: "Planning and supervision of morning gatherings, ensuring smooth student participation." },
    { id: "floor-in-charge", title: "Floor in charges", url: "#", description: "Supervision of designated floors to maintain discipline and safety during transitions." },
    { id: "class-teacher-list", title: "Class teacher list", url: "#", description: "Official list of educators assigned as class mentors for the current academic session." },
    { id: "events-competition", title: "Events & Competitions in charge", url: "#", description: "Coordinators for school-wide events, inter-house competitions, and special celebrations." },
    { id: "dispersal-duty", title: "Dispersal Duty", url: "#", description: "Monitoring student exit and transport boarding at the end of the school day." },
    { id: "teacher-talk", title: "Teacher Talk", url: "#", description: "Scheduled presentations by educators to share insights and best practices with the team." },
    { id: "lunch-duty", title: "Lunch Duty", url: "#", description: "Supervision of students in the cafeteria during breaks to ensure safety and hygiene." },
    { id: "gate-duty", title: "Gate Duty", url: "#", description: "Monitoring entry and exit points to ensure security during arrival and departure." },
    { id: "room-allocation", title: "Room allocation", url: "#", description: "Assigned rooms and learning spaces for each grade and section for the current year." },
    { id: "buddy-group", title: "Buddy group", url: "#", description: "Mentorship system pairing experienced teachers with newer staff for professional support." },
    { id: "olympiad-in-charge", title: "Olympiad in charge", url: "#", description: "Coordinators for various competitive olympiad exams and student preparation." },
    { id: "house-mistress", title: "House Mistress", url: "#", description: "Leadership and management of house-specific activities and student motivation." },
    { id: "teacher-blog", title: "Teacher Blog", url: "#", description: "Digital platform for educators to share pedagogical reflections and student success stories." },
    { id: "club-in-charge", title: "Club in charge", url: "#", description: "Faculty leads responsible for managing co-curricular clubs and activity sessions." }
  ]
};
