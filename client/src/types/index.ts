export type Level = 'Primary' | 'Junior' | 'JSC' | 'SSC' | 'HSC';

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  qualifications: string[];
  bio: string;
  photo: string; // path under /images/teachers/ or placeholder
}

export interface Course {
  id: string;
  batchId?: string;
  title: string;
  titleBn: string;
  subject: string;
  subjectBn: string;
  level: Level;
  levelBn: string;
  classes: string;      // e.g. "Classes 6–7"
  classesBn: string;
  teacherName: string;
  teacherNameBn: string;
  days: string;         // e.g. "Sat / Mon / Wed"
  daysBn: string;
  time: string;         // e.g. "3:30–5:00 pm"
  timeBn: string;
  batchSize: number;
  enrolledCount: number;
  monthlyFee: number;   // BDT
  isFull: boolean;
  description: string;
  descriptionBn: string;
}

export interface Testimonial {
  id: string;
  parentName: string;
  parentNameBn: string;
  parentRole: string;   // e.g. "Parent of a Class 7 learner"
  parentRoleBn: string;
  quote: string;
  quoteBn: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  questionBn?: string | null;
  answerBn?: string | null;
}
