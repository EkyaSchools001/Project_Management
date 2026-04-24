import { SchoolTeamData } from "../../types/schoolTeam";

export const cmrpuItplTeam: SchoolTeamData = {
  schoolName: "CMRPU ITPL",
  heroImage: "/images/schools/cmrpu-hero.jpg",
  accentColor: "#E63946",
  theme: {
    primary: "#1F2839",
    background: "#F5F5EF",
    accent: "#B69D74",
    highlight: "#E63946"
  },
  headMessage: {
    image: "/images/staff/malathi-balasubramanian.jpg",
    content: `Dear Facilitators of Learning,

On behalf of CMR family, I extend a warm welcome to my learned faculty. I am assured that each one is well-planned and prepared to step into the new academic session to grow with  ample opportunities and to face subtle obstacles with a mind without fear. The very fact that you are here is proof of your passion for the profession and your sincere attitude towards equipping our youth with knowledge required for life.

As the purpose of our PU program rightly denotes, we are here to guide our students in building and developing practical life skills, even as they acquire knowledge, to support them in their present and future endeavours as global citizens.

Let us work together to make the learning journey of our students a meaningful one by combining, what the NEP terms as ASK - 'Attitude, Skill, Knowledge'. 'Ask' is the key word in our effort to make learning effective and permanent.. Encourage our students to ask and receive abundantly, to practise and perform reflectively and analytically, to participate and contribute mindfully and fearlessly. Let us stand with our students in their quest for knowledge and play a major role in their educational pursuit even as we uphold the culture of our organization.

'Change is the end result of all true learning' - In this context, may you rediscover and redefine yourself in your role as facilitators of learning and enjoy your journey with us for years to come.

Here are a few lines, from one of W.H. Davies' poems, subtly modified to suit our profession.

**What is this life if, full of care, We have no time to share and fare?**
**No time to stand before the board And share enough for students to hoard.**
**No time to see, when students we pass, Where simple errors are overlooked in class.**
**No time to see the smiles and scowls, That brighten our lives or make them howl.**
**No time to turn to events aplenty, And watch their skills, as proud faculty.**
**No time to wait and witness their growth And rejoice in their success moving forth**
**A poor life this is, if full of care, We have no time to share and fare.**

Good luck all the way!`,
    author: "Ms Malathi Balasubramanian",
    designation: "Principal, CMR National PU College, ITPL"
  },
  leaders: [],
  coordinators: [
    {
      id: "kruti-pandya",
      name: "Ms Kruti Pandya",
      role: "Academic Coordinator",
      email: "coordinator.puitpl@cmr.ac.in",
      phone: "",
      image: "/images/staff/kruti-pandya.jpg",
      category: "coordinator"
    },
    {
      id: "nivedita-pradhan",
      name: "Ms Nivedita Pradhan",
      role: "CCA Academic Coordinator",
      email: "ccacoordinator.itpl@cmr.ac.in",
      phone: "",
      image: "/images/staff/nivedita-pradhan.jpg",
      category: "coordinator"
    }
  ],
  instructions: [],
  instructionCategories: [
    {
      title: "GENERAL INSTRUCTIONS",
      items: [
        { id: "timings", title: "Timings - Bell Schedule", url: "#", description: "Official daily schedule of periods, breaks, and transition bells for all stages." },
        { id: "class-teacher-lists", title: "Class teachers and non-class teacher lists", url: "#", description: "Designated educators responsible for primary care and administrative support for each class." },
        { id: "school-calendar", title: "School Calendar", url: "#", description: "Annual academic calendar highlighting holidays, exam dates, and school events." },
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
