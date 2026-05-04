import { SchoolTeamData } from "../../types/schoolTeam";

export const cmrpuBtmTeam: SchoolTeamData = {
  schoolName: "CMRPU BTM",
  heroImage: "/images/schools/cmrpu-hero.jpg",
  accentColor: "#E63946",
  theme: {
    primary: "#1F2839",
    background: "#F5F5EF",
    accent: "#B69D74",
    highlight: "#E63946"
  },
  headMessage: {
    image: "/images/staff/savithri-a.jpg",
    content: `Dear Educators,

Who are you?
Aren't 'You' the Great People
Who takes a hand
Opens a mind
And touches a heart

Aren't 'You' the only folks
Who realize
That all students will succeed
Not in the same way,
And not on the same day.

Aren't 'You' the magicians
With your magic wands
Make the lives of students
Easier and more fruitful

With an open mind, and an open heart, I welcome you to the family of CMR, to work together as a team, to help our students who have laid their trust in us, to climb the ladder of success.

Good Luck to each one of you!`,
    author: "Savithri. A",
    designation: "Principal, CMR PU College, BTM"
  },
  leaders: [],
  coordinators: [],
  instructions: [
    { id: "timings", title: "Timings - Bell Schedule", url: "#", description: "Official daily schedule of periods, breaks, and transition bells for all stages." },
    { id: "school-calendar", title: "School Calendar", url: "#", description: "Annual academic calendar highlighting holidays, exam dates, and school events." },
    { id: "assembly-duty", title: "Assembly Duty", url: "#", description: "Planning and supervision of morning gatherings, ensuring smooth student participation." },
    { id: "class-teacher-list", title: "Class teacher list", url: "#", description: "Official list of educators assigned as class mentors for the current academic session." },
    { id: "teacher-talk", title: "Teacher Talk", url: "#", description: "Scheduled presentations by educators to share insights and best practices with the team." },
    { id: "gate-duty", title: "Gate Duty", url: "#", description: "Monitoring entry and exit points to ensure security during arrival and departure." },
    { id: "buddy-group", title: "Buddy Group", url: "#", description: "Mentorship system pairing experienced teachers with newer staff for professional support." }
  ]
};
