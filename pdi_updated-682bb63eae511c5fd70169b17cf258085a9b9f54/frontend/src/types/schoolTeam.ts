export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  image: string;
  category: 'leader' | 'coordinator';
}

export interface InstructionLink {
  id: string;
  title: string;
  url: string;
  description?: string;
}

export interface SchoolTheme {
  primary: string;
  background: string;
  accent: string;
  highlight: string;
}

export interface SchoolTeamData {
  schoolName: string;
  heroImage: string;
  accentColor?: string;
  whiteHero?: boolean;
  theme?: SchoolTheme;
  welcomeMessage?: string;
  headMessage?: {
    image: string;
    content: string;
    author: string;
    designation: string;
  };
  leaders: TeamMember[];
  coordinators: TeamMember[];
  staff?: any[];
  instructions: InstructionLink[];
  instructionCategories?: {
    title: string;
    items: InstructionLink[];
  }[];
}
