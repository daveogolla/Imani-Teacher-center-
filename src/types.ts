export type CurriculumType = 'CBC' | 'KCSE' | 'BOTH';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tscNumber: string;
  schoolName: string;
  role: 'TEACHER' | 'HOD' | 'DEPUTY_PRINCIPAL' | 'PRINCIPAL';
  department?: string;
  county?: string;
  phoneNumber?: string;
  primarySubject?: string;
  primaryGrade?: string;
  isLoggedIn: boolean;
}

export interface KicdBook {
  id: string;
  title: string;
  publisher: 'KLB' | 'Oxford' | 'Moran' | 'Longhorn' | 'Spotlight' | 'Mountain Top' | 'StoryMoja' | 'Queenex' | 'JKF' | 'Mentor' | 'EAEP' | 'Targeter' | 'One Planet' | 'Other Approved' | string;
  editionYear: string;
  gradeLevels: string[];
  subject: string;
  approvedCategory: 'Course Book' | 'Teacher Guide' | 'Supplementary Reader' | 'Workbook / Assessment';
  kicdApprovalCode: string;
  synopsis?: string;
  author?: string;
  topicsCovered?: string[];
  isKcseSetBook?: boolean;
}

export interface SchemeLessonItem {
  week: number;
  lessonNumber: number;
  strand: string;
  subStrand: string;
  specificLearningOutcomes: string;
  keyInquiryQuestions: string;
  learningExperiences: string;
  learningResources: string;
  assessmentMethods: string;
  reflection?: string;
  isBreak?: boolean;
  breakType?: 'HALF_TERM' | 'END_TERM' | 'PUBLIC_HOLIDAY' | 'OTHER';
  breakTitle?: string;
}

export interface SchemeOfWork {
  id: string;
  title: string;
  schoolName: string;
  teacherName: string;
  tscNumber: string;
  grade: string;
  subject: string;
  term: 'Term 1' | 'Term 2' | 'Term 3';
  year: number;
  lessonsPerWeek: number;
  termStartDate: string;
  termEndDate: string;
  halfTermStartDate: string;
  halfTermEndDate: string;
  approvedBooks: string[];
  createdAt: string;
  lessons: SchemeLessonItem[];
  approvals: {
    hod: { name: string; signed: boolean; date?: string; remarks?: string };
    deputyPrincipal: { name: string; signed: boolean; date?: string; remarks?: string };
    principal: { name: string; signed: boolean; date?: string; remarks?: string };
  };
}

export interface LessonPlan {
  id: string;
  title: string;
  schoolName: string;
  teacherName: string;
  tscNumber: string;
  grade: string;
  subject: string;
  strand: string;
  subStrand: string;
  date: string;
  time: string;
  durationMinutes: number;
  rollCallBoys?: number;
  rollCallGirls?: number;
  specificLearningOutcomes: string[];
  coreCompetencies: string[];
  values: string[];
  pcis: string[]; // Pertinent and Contemporary Issues
  keyInquiryQuestions: string[];
  learningResources: string[];
  kicdApprovedBooks: string[];
  introduction: {
    time: string;
    teacherActivity: string;
    learnerActivity: string;
  };
  lessonDevelopment: Array<{
    step: string;
    time: string;
    teacherActivity: string;
    learnerActivity: string;
    competenceFocus: string;
  }>;
  conclusion: {
    time: string;
    summary: string;
    learnerActivity: string;
  };
  extendedActivities: string;
  selfEvaluation: string;
  createdAt: string;
  approvals: {
    hod: { name: string; signed: boolean; date?: string; remarks?: string };
    principal: { name: string; signed: boolean; date?: string; remarks?: string };
  };
}

export interface RevisionMaterial {
  id: string;
  title: string;
  grade: string;
  subject: string;
  curriculum: 'CBC' | 'CBE' | 'KCSE';
  term?: string;
  assessmentType?: 'OPENER' | 'MID_TERM' | 'END_YEAR' | 'KCSE_EXAM' | 'TOPICAL';
  isForm4Kcse?: boolean;
  paperNumber?: string; // e.g. "Paper 1", "Paper 2"
  schoolName?: string;
  topics: string[];
  kicdBookReferences: string[];
  durationMinutes: number;
  totalMarks: number;
  questions: Array<{
    number: number;
    questionText: string;
    marks: number;
    subQuestions?: Array<{ part: string; text: string; marks: number; answerGuide: string }>;
    answerGuide: string;
    kicdBookReference: string;
  }>;
  createdAt: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  subject: string;
  grade: string;
  notes: string;
  tags: string[];
  scheduledDate?: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  type: 'LESSON' | 'HALF_TERM' | 'END_TERM' | 'EXAM' | 'MEETING' | 'HOLIDAY';
  grade?: string;
  subject?: string;
  date: string;
  endDate?: string;
  notes?: string;
  completed?: boolean;
}

export interface MpesaReceipt {
  receiptNo: string;
  amount: number;
  recipientPhone: string; // 0707423879
  payerPhone: string;
  documentTitle: string;
  documentType: 'SCHEME' | 'LESSON_PLAN' | 'REVISION';
  documentId: string;
  dateTime: string;
  downloadFormat: 'WORD' | 'PDF';
}
