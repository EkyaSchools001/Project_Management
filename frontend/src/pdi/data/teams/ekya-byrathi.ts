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
    { id: "staff-list", title: "Staff List", url: "#" },
    { id: "timings", title: "Timings – Bell Schedule", url: "#" },
    { id: "class-teachers", title: "Class teachers and non-class teacher lists", url: "#" },
    { id: "assembly-duty", title: "Assembly Duty", url: "#" },
    { id: "floor-in-charge", title: "Floor in charges", url: "#" },
    { id: "class-teacher-list", title: "Class teacher list", url: "#" },
    { id: "events-competition", title: "Events & Competitions in charge", url: "#" },
    { id: "dispersal-duty", title: "Dispersal Duty", url: "#" },
    { id: "teacher-talk", title: "Teacher Talk", url: "#" },
    { id: "lunch-duty", title: "Lunch Duty", url: "#" },
    { id: "gate-duty", title: "Gate Duty", url: "#" },
    { id: "room-allocation", title: "Room allocation", url: "#" },
    { id: "buddy-group", title: "Buddy group", url: "#" },
    { id: "olympiad-in-charge", title: "Olympiad in charge", url: "#" },
    { id: "house-mistress", title: "House Mistress", url: "#" },
    { id: "teacher-blog", title: "Teacher Blog", url: "#" },
    { id: "club-in-charge", title: "Club in charge", url: "#" }
  ]
};
