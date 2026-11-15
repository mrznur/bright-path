export interface Batch {
  id: string;
  courseId: string;
  days: string;
  daysBn: string;
  time: string;
  timeBn: string;
  batchSize: number;
  enrolledCount: number;
  isFull: boolean;
}

export interface Course {
  /** Unique course identifier (e.g. "math-ssc") */
  id: string;

  title: string;
  titleBn: string;

  level: "Primary" | "Junior" | "JSC" | "SSC" | "HSC";
  levelBn: string;

  classes: string;
  classesBn: string;

  subject: string;
  subjectBn: string;

  description: string;
  descriptionBn: string;

  teacherId: string;
  teacherName: string;
  teacherNameBn: string;

  monthlyFee: number;

  batches: Batch[];
}

export interface Teacher {
  id: string;
  name: string;
  nameBn: string;
  subject: string;
  subjectBn: string;
  bio: string;
  bioBn: string;
  imageUrl?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  quoteBn: string;
  author: string;
  authorBn: string;
  role: string;
  roleBn: string;
}

export interface FAQ {
  id: string;
  question: string;
  questionBn: string;
  answer: string;
  answerBn: string;
  sortOrder?: number;
}

export interface StudentResult {
  id: string;
  studentName: string;
  studentNameBn: string;
  exam: string;
  examBn: string;
  subject: string;
  subjectBn: string;
  grade: string;
  gradeBn: string;
  year: number;
}

export interface SiteConfig {
  name: string;
  tagline: { en: string; bn: string };
  phone: { en: string; bn: string };
  tel: string;
  address: { en: string; bn: string };
  mapLink: string;
  hours: { en: string; bn: string };
  facebook: string;
}

export interface Booking {
  id: string;
  courseId: string;
  batchId: string;
  parentName: string;
  studentName: string;
  phone: string;
  classLevel: string;
  paymentMethod: string;
  note: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  classLevel: string;
  subject: string;
  course: string;
  question: string;
  status: "new" | "contacted" | "resolved";
  createdAt: string;
}

export interface DashboardStats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  totalEnquiries: number;
  newEnquiries: number;
}

export type CourseInput = Omit<Course, "batches" | "teacherName" | "teacherNameBn">;
export type BatchInput = Batch;
