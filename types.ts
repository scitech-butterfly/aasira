export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Module {
  id: number;
  title: string;
  content: string;
  youtubeLinks: { title: string; url: string }[];
  quiz: Question[];
}

export interface ModuleStatus {
  moduleId: number;
  status: 'locked' | 'unlocked' | 'completed';
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface Event {
  id: string;
  title: string;
  day: string;
  date: string;
  time: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  events: Event[];
}

export type Role = 'student' | 'organizer';

export interface User {
  id: string;
  username: string;
  role: Role;
}
