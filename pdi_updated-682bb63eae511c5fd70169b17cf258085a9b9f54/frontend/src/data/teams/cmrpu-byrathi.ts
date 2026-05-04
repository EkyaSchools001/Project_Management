import { SchoolTeamData } from "../../types/schoolTeam";

export const cmrpuByrathiTeam: SchoolTeamData = {
  schoolName: "CMRPU BYRATHI",
  heroImage: "/images/schools/byrathi-pu-1.jpg",
  accentColor: "#E63946",
  theme: {
    primary: "#1F2839",
    background: "#F5F5EF",
    accent: "#B69D74",
    highlight: "#E63946"
  },
  headMessage: {
    image: "/images/staff/default-avatar.png",
    content: `Dear Educators,

Welcome to CMR PU College, Byrathi — a place where young minds are shaped with purpose, passion, and perseverance.

As we embark on this academic year, I invite each of you to bring your best self into every classroom interaction. Our students look up to us not just for knowledge, but for guidance, encouragement, and inspiration.

Together, let us foster a culture of curiosity, compassion, and continuous learning. I am proud to be part of this remarkable team and look forward to a year filled with growth and meaningful achievements.

Warm Regards,`,
    author: "Principal",
    designation: "Principal, CMR PU College, Byrathi"
  },
  leaders: [],
  coordinators: [],
  instructions: [
    { id: "timings", title: "Timings - Bell Schedule", url: "#", description: "Official daily schedule of periods, breaks, and transition bells." },
    { id: "school-calendar", title: "School Calendar", url: "#", description: "Annual academic calendar highlighting holidays, exam dates, and school events." },
    { id: "assembly-duty", title: "Assembly Duty", url: "#", description: "Planning and supervision of morning gatherings." },
    { id: "class-teacher-list", title: "Class Teacher List", url: "#", description: "Official list of educators assigned as class mentors for the current academic session." },
    { id: "gate-duty", title: "Gate Duty", url: "#", description: "Monitoring entry and exit points during arrival and departure." },
    { id: "buddy-group", title: "Buddy Group", url: "#", description: "Mentorship system pairing experienced teachers with newer staff." }
  ]
};
