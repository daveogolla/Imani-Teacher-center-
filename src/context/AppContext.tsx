import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  SchemeOfWork,
  LessonPlan,
  RevisionMaterial,
  ContentIdea,
  ScheduleEvent,
  MpesaReceipt,
} from '../types';
import { generateSchemeWithAI, generateLessonPlanWithAI, generateRevisionPack } from '../services/aiService';

export interface GenerationTask {
  id: string;
  title: string;
  type: 'SCHEME' | 'LESSON_PLAN' | 'REVISION';
  grade: string;
  subject: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  progress: number;
  createdAt: string;
}

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isAndroidView: boolean;
  setIsAndroidView: React.Dispatch<React.SetStateAction<boolean>>;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Content storage
  schemes: SchemeOfWork[];
  setSchemes: React.Dispatch<React.SetStateAction<SchemeOfWork[]>>;
  lessonPlans: LessonPlan[];
  setLessonPlans: React.Dispatch<React.SetStateAction<LessonPlan[]>>;
  revisionMaterials: RevisionMaterial[];
  setRevisionMaterials: React.Dispatch<React.SetStateAction<RevisionMaterial[]>>;
  contentIdeas: ContentIdea[];
  setContentIdeas: React.Dispatch<React.SetStateAction<ContentIdea[]>>;
  scheduleEvents: ScheduleEvent[];
  setScheduleEvents: React.Dispatch<React.SetStateAction<ScheduleEvent[]>>;
  // Downloads & M-Pesa
  downloadReceipts: MpesaReceipt[];
  generationTasks: GenerationTask[];
  // Actions
  addContentIdea: (idea: Omit<ContentIdea, 'id' | 'createdAt'>) => void;
  toggleCompleteIdea: (id: string) => void;
  deleteIdea: (id: string) => void;
  addScheduleEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  deleteScheduleEvent: (id: string) => void;
  // M-Pesa Payment Flow
  initiateDownloadPayment: (
    documentType: 'SCHEME' | 'LESSON_PLAN' | 'REVISION',
    documentId: string,
    documentTitle: string,
    format: 'WORD' | 'PDF',
    onSuccessDownload: () => void
  ) => void;
  isDocumentUnlocked: (documentId: string, documentTitle?: string) => boolean;
  activePaymentModal: {
    isOpen: boolean;
    docType: 'SCHEME' | 'LESSON_PLAN' | 'REVISION';
    docId: string;
    docTitle: string;
    format: 'WORD' | 'PDF';
    callback: () => void;
  } | null;
  closePaymentModal: () => void;
  recordSuccessfulPayment: (receipt: MpesaReceipt) => void;
  // Auth Modal & Role
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginUser: (
    email: string,
    name?: string,
    school?: string,
    tsc?: string,
    role?: 'TEACHER' | 'HOD' | 'DEPUTY_PRINCIPAL' | 'PRINCIPAL',
    department?: string
  ) => void;
  updateUserSchool: (newSchoolName: string) => void;
  logoutUser: () => void;
  // Administrative Sign-Off Actions
  signApproveScheme: (
    schemeId: string,
    role: 'hod' | 'deputyPrincipal' | 'principal',
    officerName: string,
    remarks?: string
  ) => void;
  signApproveLessonPlan: (
    planId: string,
    role: 'hod' | 'principal',
    officerName: string,
    remarks?: string
  ) => void;
  // AI assistant drawer
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('imani_theme') === 'dark';
  });

  const [isAndroidView, setIsAndroidView] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);

  // User profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('imani_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.schoolName && parsed.schoolName.toLowerCase().includes('lenana')) {
          parsed.schoolName = '';
        }
        return parsed;
      } catch (e) {
        // pass
      }
    }
    return {
      id: 'usr-1',
      name: 'Dave Ogolla',
      email: 'Daveogolla@gmail.com',
      tscNumber: '',
      schoolName: '',
      role: 'TEACHER',
      department: 'Mathematics & Integrated Science',
      county: 'Nairobi',
      phoneNumber: '0707423879',
      primarySubject: 'Mathematics & Integrated Science',
      primaryGrade: 'Grade 7',
      isLoggedIn: true,
    };
  });

  // Schemes of Work
  const [schemes, setSchemes] = useState<SchemeOfWork[]>(() => {
    const saved = localStorage.getItem('imani_schemes');
    if (saved) {
      try {
        const parsed: SchemeOfWork[] = JSON.parse(saved);
        return parsed.map((s) => ({
          ...s,
          schoolName: s.schoolName && s.schoolName.toLowerCase().includes('lenana') ? '' : s.schoolName,
        }));
      } catch (e) {
        // pass
      }
    }
    return [];
  });

  // Lesson Plans
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(() => {
    const saved = localStorage.getItem('imani_lesson_plans');
    if (saved) {
      try {
        const parsed: LessonPlan[] = JSON.parse(saved);
        return parsed.map((p) => ({
          ...p,
          schoolName: p.schoolName && p.schoolName.toLowerCase().includes('lenana') ? '' : p.schoolName,
        }));
      } catch (e) {
        // pass
      }
    }
    return [];
  });

  // Revision Materials
  const [revisionMaterials, setRevisionMaterials] = useState<RevisionMaterial[]>(() => {
    const saved = localStorage.getItem('imani_revision');
    return saved ? JSON.parse(saved) : [];
  });

  // Content Ideas
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>(() => {
    const saved = localStorage.getItem('imani_ideas');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'idea-1',
        title: 'Construct local water filter using sand, charcoal and gravel',
        subject: 'Integrated Science',
        grade: 'Grade 7',
        notes: 'Ask learners to bring plastic 2-litre bottles from home. Connect to sub-strand on separation of mixtures in Oxford Discovering Science.',
        tags: ['Experiment', 'Realia', 'Low Cost', 'JSS'],
        scheduledDate: '2026-03-04',
        isCompleted: false,
        createdAt: '2026-02-10T10:00:00Z',
      },
      {
        id: 'idea-2',
        title: 'Indigenous Kenyan barter market simulation for linear equations',
        subject: 'Mathematics',
        grade: 'Grade 7',
        notes: 'Learners exchange simulated produce (avocados, maize) to balance weights on improvised coat-hanger scales.',
        tags: ['Math Game', 'CBC Activity', 'Collaboration'],
        scheduledDate: '2026-03-12',
        isCompleted: true,
        createdAt: '2026-02-12T14:30:00Z',
      },
      {
        id: 'idea-3',
        title: 'Kitchen garden drip irrigation using punctured plastic pipes',
        subject: 'Agriculture',
        grade: 'Grade 8',
        notes: 'Practical project behind the science laboratory. Check Longhorn Smart Score Agriculture Chapter 4.',
        tags: ['Agriculture', 'Hands-on', 'KICD Project'],
        scheduledDate: '2026-03-20',
        isCompleted: false,
        createdAt: '2026-02-15T09:15:00Z',
      },
    ];
  });

  // Calendar / Schedule Events
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(() => {
    const saved = localStorage.getItem('imani_schedule');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ev-1',
        title: 'Term 1 Official Opening',
        type: 'MEETING',
        date: '2026-01-06',
        notes: 'Staff meeting and syllabus distribution according to KICD guidelines.',
        completed: true,
      },
      {
        id: 'ev-2',
        title: 'Grade 7 Fractions & Decimals Assessment',
        type: 'LESSON',
        grade: 'Grade 7',
        subject: 'Mathematics',
        date: '2026-02-10',
        notes: 'KLB Visionary Chapter 3 End-of-strand check.',
        completed: true,
      },
      {
        id: 'ev-3',
        title: 'TERM 1 HALF TERM BREAK (Official Blank Period)',
        type: 'HALF_TERM',
        date: '2026-02-18',
        endDate: '2026-02-22',
        notes: 'National mid-term break for all basic education institutions in Kenya. Duration left blank in official schemes.',
        completed: false,
      },
      {
        id: 'ev-4',
        title: 'Grade 8 Pre-Technical Workshop Practical',
        type: 'LESSON',
        grade: 'Grade 8',
        subject: 'Pre-Technical Studies',
        date: '2026-03-05',
        notes: 'Hand tools inspection and safe maintenance demo.',
        completed: false,
      },
      {
        id: 'ev-5',
        title: 'End of Term 1 Examinations & Closing (Blank in Schemes)',
        type: 'END_TERM',
        date: '2026-04-03',
        notes: 'Summative assessment, report card issuance, school holiday commencement.',
        completed: false,
      },
    ];
  });

  // Downloads & M-Pesa receipts
  const [downloadReceipts, setDownloadReceipts] = useState<MpesaReceipt[]>(() => {
    const saved = localStorage.getItem('imani_mpesa_receipts');
    if (saved) return JSON.parse(saved);
    return [
      {
        receiptNo: 'SLT479K01Z',
        amount: 15,
        recipientPhone: '0707423879',
        payerPhone: '0712345678',
        documentTitle: 'Schemes of Work - Grade 7 Mathematics Term 1',
        documentType: 'SCHEME',
        documentId: 'seed-scheme-1',
        dateTime: '2026-02-15 11:24 AM',
        downloadFormat: 'WORD',
      },
      {
        receiptNo: 'QRM918X42B',
        amount: 15,
        recipientPhone: '0707423879',
        payerPhone: '0722998877',
        documentTitle: 'Lesson Plan - Grade 8 Integrated Science',
        documentType: 'LESSON_PLAN',
        documentId: 'seed-lp-1',
        dateTime: '2026-02-18 03:45 PM',
        downloadFormat: 'PDF',
      },
    ];
  });

  // Generation Tasks (status for the dashboard)
  const [generationTasks] = useState<GenerationTask[]>([
    {
      id: 'task-1',
      title: 'Schemes of Work: Grade 7 Mathematics (Term 1)',
      type: 'SCHEME',
      grade: 'Grade 7',
      subject: 'Mathematics',
      status: 'COMPLETED',
      progress: 100,
      createdAt: '10 mins ago',
    },
    {
      id: 'task-2',
      title: 'CBC Lesson Plan: Grade 8 Pre-Technical Studies',
      type: 'LESSON_PLAN',
      grade: 'Grade 8',
      subject: 'Pre-Technical Studies',
      status: 'COMPLETED',
      progress: 100,
      createdAt: '25 mins ago',
    },
    {
      id: 'task-3',
      title: 'KCSE Revision Pack: Grade 10 / Form 1 Chemistry',
      type: 'REVISION',
      grade: 'Grade 10',
      subject: 'Chemistry',
      status: 'COMPLETED',
      progress: 100,
      createdAt: '1 hour ago',
    },
    {
      id: 'task-4',
      title: 'Schemes of Work: PP1 Mathematical Activities',
      type: 'SCHEME',
      grade: 'PP1',
      subject: 'Mathematical Activities',
      status: 'COMPLETED',
      progress: 100,
      createdAt: '2 hours ago',
    },
  ]);

  // Payment Modal State
  const [activePaymentModal, setActivePaymentModal] = useState<{
    isOpen: boolean;
    docType: 'SCHEME' | 'LESSON_PLAN' | 'REVISION';
    docId: string;
    docTitle: string;
    format: 'WORD' | 'PDF';
    callback: () => void;
  } | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('imani_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('imani_schemes', JSON.stringify(schemes));
  }, [schemes]);

  useEffect(() => {
    localStorage.setItem('imani_lesson_plans', JSON.stringify(lessonPlans));
  }, [lessonPlans]);

  useEffect(() => {
    localStorage.setItem('imani_revision', JSON.stringify(revisionMaterials));
  }, [revisionMaterials]);

  useEffect(() => {
    localStorage.setItem('imani_ideas', JSON.stringify(contentIdeas));
  }, [contentIdeas]);

  useEffect(() => {
    localStorage.setItem('imani_schedule', JSON.stringify(scheduleEvents));
  }, [scheduleEvents]);

  useEffect(() => {
    localStorage.setItem('imani_mpesa_receipts', JSON.stringify(downloadReceipts));
  }, [downloadReceipts]);

  // Theme effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('imani_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('imani_theme', 'light');
    }
  }, [isDarkMode]);

  // Seed default scheme if empty
  useEffect(() => {
    if (schemes.length === 0) {
      generateSchemeWithAI({
        schoolName: user.schoolName || '',
        teacherName: user.name || 'Dave Ogolla',
        tscNumber: user.tscNumber || '',
        grade: 'Grade 7',
        subject: 'Mathematics',
        term: 'Term 1',
        year: 2026,
        lessonsPerWeek: 5,
        termStartDate: '2026-01-06',
        termEndDate: '2026-04-03',
        halfTermStartDate: '2026-02-18',
        halfTermEndDate: '2026-02-22',
        approvedBooks: ['KLB Visionary Junior Secondary Mathematics Grade 7', 'Moran Junior Secondary Mathematics'],
        includeBreaks: true,
        halfTermWeek: 7,
        totalWeeks: 13,
      }).then((s) => {
        setSchemes([s]);
      });
    }

    if (lessonPlans.length === 0) {
      generateLessonPlanWithAI({
        schoolName: user.schoolName || '',
        teacherName: user.name || 'Dave Ogolla',
        tscNumber: user.tscNumber || '',
        grade: 'Grade 7',
        subject: 'Mathematics',
        strand: 'Numbers',
        subStrand: 'Whole Numbers & Prime Factorisation',
        date: '2026-02-25',
        durationMinutes: 40,
        approvedBooks: ['KLB Visionary Junior Secondary Mathematics Grade 7'],
      }).then((lp) => {
        setLessonPlans([lp]);
      });
    }

    if (revisionMaterials.length === 0) {
      const rev = generateRevisionPack({
        grade: 'Grade 7',
        subject: 'Integrated Science',
        curriculum: 'CBE',
        topics: ['Mixtures & Separation Methods', 'Excretory System', 'Basic Lab Safety'],
        approvedBooks: ['Oxford Discovering Integrated Science Grade 7', 'KLB Visionary Integrated Science Grade 7'],
        durationMinutes: 90,
        totalMarks: 50,
      });
      setRevisionMaterials([rev]);
    }
  }, []);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const addContentIdea = (ideaData: Omit<ContentIdea, 'id' | 'createdAt'>) => {
    const newIdea: ContentIdea = {
      ...ideaData,
      id: 'idea-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setContentIdeas((prev) => [newIdea, ...prev]);
  };

  const toggleCompleteIdea = (id: string) => {
    setContentIdeas((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isCompleted: !i.isCompleted } : i))
    );
  };

  const deleteIdea = (id: string) => {
    setContentIdeas((prev) => prev.filter((i) => i.id !== id));
  };

  const addScheduleEvent = (eventData: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...eventData,
      id: 'ev-' + Date.now(),
    };
    setScheduleEvents((prev) => [...prev, newEvent]);
  };

  const deleteScheduleEvent = (id: string) => {
    setScheduleEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const isDocumentUnlocked = (documentId: string, documentTitle?: string): boolean => {
    return downloadReceipts.some(
      (r) =>
        r.documentId === documentId ||
        (documentTitle && r.documentTitle.toLowerCase() === documentTitle.toLowerCase())
    );
  };

  const initiateDownloadPayment = (
    docType: 'SCHEME' | 'LESSON_PLAN' | 'REVISION',
    docId: string,
    docTitle: string,
    format: 'WORD' | 'PDF',
    onSuccessDownload: () => void
  ) => {
    // COMPULSORY: Charge Ksh. 15 for every document downloaded
    setActivePaymentModal({
      isOpen: true,
      docType,
      docId,
      docTitle,
      format,
      callback: onSuccessDownload,
    });
  };

  const closePaymentModal = () => {
    setActivePaymentModal(null);
  };

  const recordSuccessfulPayment = (receipt: MpesaReceipt) => {
    setDownloadReceipts((prev) => [receipt, ...prev]);
    // Payment confirmation verified! Trigger document download callback now!
    if (activePaymentModal?.callback) {
      activePaymentModal.callback();
    }
  };

  const loginUser = (
    email: string,
    name?: string,
    school?: string,
    tsc?: string,
    role: 'TEACHER' | 'HOD' | 'DEPUTY_PRINCIPAL' | 'PRINCIPAL' = 'TEACHER',
    department?: string
  ) => {
    const registeredName = name || email.split('@')[0].replace('.', ' ');
    setUser({
      id: 'usr-' + Date.now(),
      name: registeredName.charAt(0).toUpperCase() + registeredName.slice(1),
      email,
      tscNumber: tsc || '',
      schoolName: school || '',
      role: role || 'TEACHER',
      department: department || 'Academics & Curriculum',
      phoneNumber: '0707423879',
      isLoggedIn: true,
    });
    setIsAuthModalOpen(false);
  };

  const signApproveScheme = (
    schemeId: string,
    role: 'hod' | 'deputyPrincipal' | 'principal',
    officerName: string,
    remarks?: string
  ) => {
    setSchemes((prev) =>
      prev.map((s) => {
        if (s.id !== schemeId) return s;
        return {
          ...s,
          approvals: {
            ...s.approvals,
            [role]: {
              name: officerName,
              signed: true,
              date: new Date().toLocaleDateString('en-KE'),
              remarks: remarks || `Officially approved by ${officerName} according to KICD curriculum design standard.`,
            },
          },
        };
      })
    );
  };

  const signApproveLessonPlan = (
    planId: string,
    role: 'hod' | 'principal',
    officerName: string,
    remarks?: string
  ) => {
    setLessonPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        return {
          ...p,
          approvals: {
            ...p.approvals,
            [role]: {
              name: officerName,
              signed: true,
              date: new Date().toLocaleDateString('en-KE'),
              remarks: remarks || `Lesson plan reviewed & authorized for classroom execution.`,
            },
          },
        };
      })
    );
  };

  const updateUserSchool = (newSchoolName: string) => {
    setUser((prev) => ({
      ...prev,
      schoolName: newSchoolName,
    }));
  };

  const logoutUser = () => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isDarkMode,
        toggleDarkMode,
        isAndroidView,
        setIsAndroidView,
        currentTab,
        setCurrentTab,
        searchQuery,
        setSearchQuery,
        schemes,
        setSchemes,
        lessonPlans,
        setLessonPlans,
        revisionMaterials,
        setRevisionMaterials,
        contentIdeas,
        setContentIdeas,
        scheduleEvents,
        setScheduleEvents,
        downloadReceipts,
        generationTasks,
        addContentIdea,
        toggleCompleteIdea,
        deleteIdea,
        addScheduleEvent,
        deleteScheduleEvent,
        initiateDownloadPayment,
        isDocumentUnlocked,
        activePaymentModal,
        closePaymentModal,
        recordSuccessfulPayment,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginUser,
        updateUserSchool,
        logoutUser,
        signApproveScheme,
        signApproveLessonPlan,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
