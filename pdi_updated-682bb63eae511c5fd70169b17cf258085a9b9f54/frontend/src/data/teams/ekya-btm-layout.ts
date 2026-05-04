import { SchoolTeamData } from "../../types/schoolTeam";

export const ekyaBtmLayoutTeam: SchoolTeamData = {
  schoolName: "EKYA BTM LAYOUT",
  heroImage: "/images/schools/btm-1.jpg",
  accentColor: "#E63946",
  theme: {
    primary: "#1F2839",
    background: "#F5F5EF",
    accent: "#B69D74", // Standard EKYA tan
    highlight: "#E63946" // Red for BTM
  },
  headMessage: {
    image: "/images/staff/asha-doris.jpg",
    content: `Dear Team,

Welcome back! I hope each of you had a restful and rejuvenating summer break. It’s always a pleasure to see the campus come alive again with your energy, warmth, and commitment.

As we step into Academic Year 2025–26, we do so with great enthusiasm and a shared vision for a successful year ahead. This is a year of consistency — in our practices, our relationships, and our efforts. More than ever, student retention must remain a top priority. Each student’s experience with us should reflect the strength of our values and the impact of our work in every classroom and interaction.

Let’s continue to place student well-being, learning, and growth at the heart of all we do. Whether through differentiated instruction, supportive conversations, or simply being present, every moment we invest in our learners counts.

Thank you for the dedication you bring to our school community. I look forward to working alongside each of you as we make this year one of purpose, connection, and excellence.`,
    author: "Asha Doris",
    designation: "Head of School"
  },
  leaders: [], // Grid to be populated
  coordinators: [
    {
      id: "moitreevee-bose",
      name: "Ms Moitreevee Bose",
      role: "Academic Coordinator - Primary",
      email: "coordinator.btm.primary@ekyaschools.com",
      phone: "+91 98XXX XXXXX",
      image: "/images/staff/moitreevee-bose.png",
      category: "coordinator"
    },
    {
      id: "sneha-nishtala",
      name: "Ms Sneha Nishtala",
      role: "Academic Coordinator - Middle School",
      email: "coordinator.btm.middle@ekyaschools.com",
      phone: "+91 98XXX XXXXX",
      image: "/images/staff/sneha-nishtala.jpg",
      category: "coordinator"
    },
    {
      id: "mumtaz-begum",
      name: "Ms Mumtaz Begum",
      role: "Academic Coordinator - Senior School",
      email: "coordinator.btm@ekyaschools.com",
      phone: "+91 98XXX XXXXX",
      image: "/images/staff/mumtaz-begum.jpg",
      category: "coordinator"
    },
    {
      id: "meghana-chandrakanth",
      name: "Ms Meghana Chandrakanth",
      role: "Lead, Pre-primary",
      email: "lead.btm.preprimary@ekyaschools.com",
      phone: "+91 98XXX XXXXX",
      image: "/images/staff/meghana-chandrakanth.jpg",
      category: "coordinator"
    },
    {
      id: "madhuri-v-iyer",
      name: "Ms Madhuri V Iyer",
      role: "CCA Coordinator",
      email: "ccacoordinator.btm@ekyaschools.com",
      phone: "+91 98XXX XXXXX",
      image: "/images/staff/madhuri-v-iyer.jpg",
      category: "coordinator"
    },
    {
      id: "jayashree-seetharaman",
      name: "Ms Jayashree Seetharaman",
      role: "Admin Manager",
      email: "btm@ekyaschools.com",
      phone: "+91 98XXX XXXXX",
      image: "/images/staff/jayashree-seetharaman.png",
      category: "coordinator"
    }
  ],
  instructions: [
    { id: "staff-list", title: "Staff list", url: "#", description: "Comprehensive directory of all academic and support staff members at this campus." },
    { id: "classroom-allocation", title: "Classroom Allocation", url: "#", description: "Assigned rooms and learning spaces for each grade and section for the current year." },
    { id: "assembly-duty", title: "Assembly Duty", url: "#", description: "Planning and supervision of morning gatherings, ensuring smooth student participation." },
    { id: "floor-in-charge", title: "Floor In charge", url: "#", description: "Supervision of designated floors to maintain discipline and safety during transitions." },
    { id: "substitution", title: "Substitution", url: "#", description: "Temporary class assignments to cover for absent colleagues and maintain learning continuity." },
    { id: "timetable", title: "Timetable", url: "#", description: "Weekly schedule of periods, subjects, and learning blocks for all grades." },
    { id: "class-teacher-list", title: "Class teacher list", url: "#", description: "Designated educators responsible for the primary care and administration of each class." },
    { id: "dispersal-duty", title: "Dispersal Duty", url: "#", description: "Monitoring student exit and transport boarding at the end of the school day." },
    { id: "teacher-talk", title: "Teacher Talk", url: "#", description: "Scheduled presentations by educators to share insights and best practices with the team." },
    { id: "lunch-duty", title: "Lunch Duty", url: "#", description: "Supervision of students in the cafeteria during breaks to ensure safety and hygiene." },
    { id: "gate-duty", title: "Gate Duty", url: "#", description: "Monitoring entry and exit points to ensure security during arrival and departure." }
  ]
};
