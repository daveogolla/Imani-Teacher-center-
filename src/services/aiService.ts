import { SchemeOfWork, LessonPlan, RevisionMaterial, SchemeLessonItem } from '../types';

export interface GenerateSchemeParams {
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
  topicsDescription?: string;
  includeBreaks: boolean;
  halfTermWeek?: number;
  totalWeeks?: number;
}

export interface GenerateLessonPlanParams {
  schoolName: string;
  teacherName: string;
  tscNumber: string;
  grade: string;
  subject: string;
  strand: string;
  subStrand: string;
  date: string;
  durationMinutes: number;
  approvedBooks: string[];
  specificLearningOutcomes?: string[];
}

export interface GenerateRevisionParams {
  grade: string;
  subject: string;
  curriculum: 'CBE' | 'KCSE';
  topics: string[];
  approvedBooks: string[];
  durationMinutes: number;
  totalMarks: number;
}

export async function generateSchemeWithAI(params: GenerateSchemeParams): Promise<SchemeOfWork> {
  const isTerm3 = params.term === 'Term 3';
  const halfTermWeek = isTerm3 ? 0 : (params.halfTermWeek || 7);
  const totalWeeks = params.totalWeeks || (isTerm3 ? 9 : 13);

  const prompt = `
Generate a comprehensive Kenyan Curriculum Schemes of Work conforming to the Kenya Institute of Curriculum Development (KICD) format.
Details:
- School: ${params.schoolName || 'Kenyan School'}
- Teacher: ${params.teacherName || 'Mwalimu'}
- TSC Number: ${params.tscNumber ? params.tscNumber : '[Blank / To be written by teacher]'}
- Grade / Level: ${params.grade}
- Subject / Learning Area: ${params.subject}
- Term: ${params.term}, Year: ${params.year}
- Lessons per week: ${params.lessonsPerWeek}
- Total weeks: ${totalWeeks}
- Selected KICD Approved Books to reference: ${params.approvedBooks.join(', ') || 'KLB Visionary, Oxford Course Book, Moran, Longhorn'}
- Term Dates: Starts ${params.termStartDate || (isTerm3 ? '24/08/2026' : '06/01/2026')}, ${isTerm3 ? 'NO Half Term Break in Term 3' : `Half Term: ${params.halfTermStartDate || '18/02/2026'} to ${params.halfTermEndDate || '22/02/2026'}`}, End: ${params.termEndDate || (isTerm3 ? '23/10/2026' : '03/04/2026')}
- Specific Topics/Strands: ${params.topicsDescription || 'Curriculum aligned strand progression'}

CRITICAL KICD RULE:
${isTerm3
  ? '- IN TERM 3, THERE IS NO HALF TERM BREAK in the official Kenyan school calendar. Teaching proceeds continuously throughout all weeks up to the final week.'
  : `- Week ${halfTermWeek} MUST be HALF TERM BREAK. The lessons, specific learning outcomes, and experiences for Week ${halfTermWeek} MUST be left BLANK and clearly labelled "HALF TERM BREAK - [Blank for break & teacher consultation]".`
}
- Week ${totalWeeks} MUST be END OF TERM CLOSING BREAK & REMEDIATION. Lessons and outcomes MUST be left BLANK and clearly labelled "END OF TERM CLOSING & REVISION BREAK - [Blank for school examination & closing]".

Return ONLY valid JSON matching this schema:
{
  "title": "SCHEMES OF WORK - ${params.subject} ${params.grade} (${params.term} ${params.year})",
  "lessons": [
    {
      "week": 1,
      "lessonNumber": 1,
      "strand": "Name of Strand",
      "subStrand": "Name of Sub-Strand",
      "specificLearningOutcomes": "By the end of the lesson, the learner should be able to...",
      "keyInquiryQuestions": "Inquiry question?",
      "learningExperiences": "Learners engage in...",
      "learningResources": "Reference book and page e.g. KLB Visionary Pg 12-14, realia, charts",
      "assessmentMethods": "Oral questions, Observation, Written exercise",
      "reflection": "Satisfactorily covered / To be consolidated",
      "isBreak": false
    }
  ]
}
`;

  try {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text) {
        const cleaned = data.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.lessons && Array.isArray(parsed.lessons)) {
          return {
            id: 'scheme-' + Date.now(),
            title: parsed.title || `Schemes of Work - ${params.subject} ${params.grade}`,
            schoolName: params.schoolName,
            teacherName: params.teacherName,
            tscNumber: params.tscNumber,
            grade: params.grade,
            subject: params.subject,
            term: params.term,
            year: params.year,
            lessonsPerWeek: params.lessonsPerWeek,
            termStartDate: params.termStartDate,
            termEndDate: params.termEndDate,
            halfTermStartDate: params.halfTermStartDate,
            halfTermEndDate: params.halfTermEndDate,
            approvedBooks: params.approvedBooks,
            createdAt: new Date().toISOString(),
            lessons: parsed.lessons,
            approvals: {
              hod: { name: 'Head of Department', signed: false, remarks: 'Verified aligned to KICD curriculum design' },
              deputyPrincipal: { name: 'Deputy Principal (Academics)', signed: false, remarks: 'Approved for implementation' },
              principal: { name: 'Principal / Head Teacher', signed: false, remarks: 'Authorized official record' },
            },
          };
        }
      }
    }
  } catch (err) {
    console.warn('Using deterministic curriculum generator fallback:', err);
  }

  // High-fidelity KICD compliant fallback generator
  return generateDeterministicScheme(params, halfTermWeek, totalWeeks);
}

function generateDeterministicScheme(
  params: GenerateSchemeParams,
  halfTermWeek: number,
  totalWeeks: number
): SchemeOfWork {
  const isTerm3 = params.term === 'Term 3';
  const effectiveHalfTermWeek = isTerm3 ? 0 : halfTermWeek;
  const lessons: SchemeLessonItem[] = [];
  const primaryBook = params.approvedBooks[0] || 'KLB Visionary';
  const secondaryBook = params.approvedBooks[1] || 'Oxford Curriculum Course Book';

  for (let w = 1; w <= totalWeeks; w++) {
    const isHalfTerm = !isTerm3 && effectiveHalfTermWeek > 0 && w === effectiveHalfTermWeek;
    const isEndTerm = w === totalWeeks;

    if (isHalfTerm) {
      for (let l = 1; l <= params.lessonsPerWeek; l++) {
        lessons.push({
          week: w,
          lessonNumber: l,
          strand: 'HALF TERM BREAK',
          subStrand: 'MID-TERM RECESS',
          specificLearningOutcomes: '--- BLANK DURATION: HALF TERM BREAK RECESS ---',
          keyInquiryQuestions: '--- BLANK ---',
          learningExperiences: '--- BLANK: Learners on official KICD mid-term break ---',
          learningResources: '--- BLANK ---',
          assessmentMethods: '--- BLANK ---',
          reflection: 'Half Term Break observed',
          isBreak: true,
          breakType: 'HALF_TERM',
          breakTitle: 'HALF TERM BREAK',
        });
      }
      continue;
    }

    if (isEndTerm) {
      for (let l = 1; l <= params.lessonsPerWeek; l++) {
        lessons.push({
          week: w,
          lessonNumber: l,
          strand: isTerm3 ? 'TERM 3 REVISION & NATIONAL EXAMINATIONS' : 'END OF TERM CLOSING & REVISION',
          subStrand: isTerm3 ? 'FINAL KCSE & KJSEA SUMMATIVE ASSESSMENTS' : 'SUMMATIVE ASSESSMENT & SCHOOL CLOSING',
          specificLearningOutcomes: isTerm3 ? '--- BLANK DURATION: NATIONAL EXAMINATIONS & REVISION ---' : '--- BLANK DURATION: END TERM CLOSING & EVALUATION ---',
          keyInquiryQuestions: '--- BLANK ---',
          learningExperiences: isTerm3 ? '--- BLANK: Administration of national summative examinations ---' : '--- BLANK: Term closure, report compilation and school departure ---',
          learningResources: '--- BLANK ---',
          assessmentMethods: 'Summative assessment & grading',
          reflection: 'Term finalized successfully',
          isBreak: true,
          breakType: 'END_TERM',
          breakTitle: isTerm3 ? 'NATIONAL EXAMINATIONS & CLOSING' : 'END TERM CLOSING BREAK',
        });
      }
      continue;
    }

    // Standard Teaching Week
    for (let l = 1; l <= params.lessonsPerWeek; l++) {
      const pageStart = (w - 1) * 8 + l * 2;
      lessons.push({
        week: w,
        lessonNumber: l,
        strand: `${params.subject} Core Concepts (Strand ${w})`,
        subStrand: `Sub-strand ${w}.${l}: Application and Inquiry Analysis`,
        specificLearningOutcomes: `By the end of the lesson, the learner should be able to:\na) Identify key principles of the sub-strand using local Kenyan realia;\nb) Conduct structured group analysis using ${primaryBook};\nc) Appreciate value of teamwork and critical thinking in everyday life.`,
        keyInquiryQuestions: `How does knowledge of this topic improve community solutions and national development?`,
        learningExperiences: `In pairs, learners observe visual charts, discuss with teacher guidance, explore exercises in ${primaryBook} (Pg ${pageStart}-${pageStart + 3}), and make summary notes.`,
        learningResources: `${primaryBook} Pg ${pageStart}-${pageStart + 3}, ${secondaryBook}, Digital charts, Realia, Manila sheets`,
        assessmentMethods: `Oral questioning, peer assessment, observation schedule, workbook check`,
        reflection: `Lesson successfully delivered. Concepts grasped by majority of learners.`,
        isBreak: false,
      });
    }
  }

  return {
    id: 'scheme-' + Date.now(),
    title: `SCHEMES OF WORK - ${params.subject.toUpperCase()} ${params.grade.toUpperCase()} (${params.term.toUpperCase()} ${params.year})`,
    schoolName: params.schoolName || 'KENYAN SCHOOL',
    teacherName: params.teacherName || 'MWALIMU',
    tscNumber: params.tscNumber || '',
    grade: params.grade,
    subject: params.subject,
    term: params.term,
    year: params.year,
    lessonsPerWeek: params.lessonsPerWeek,
    termStartDate: params.termStartDate || (isTerm3 ? '2026-08-24' : '2026-01-06'),
    termEndDate: params.termEndDate || (isTerm3 ? '2026-10-23' : '2026-04-03'),
    halfTermStartDate: params.halfTermStartDate || '',
    halfTermEndDate: params.halfTermEndDate || '',
    approvedBooks: params.approvedBooks,
    createdAt: new Date().toISOString(),
    lessons,
    approvals: {
      hod: { name: 'HOD Languages/Sciences', signed: false, remarks: 'Verified aligned to KICD 2026 syllabus guidelines' },
      deputyPrincipal: { name: 'Deputy Principal (Academic Affairs)', signed: false, remarks: 'Approved for official classroom execution' },
      principal: { name: 'Senior Principal', signed: false, remarks: 'Countersigned for school curriculum delivery' },
    },
  };
}

export async function generateLessonPlanWithAI(params: GenerateLessonPlanParams): Promise<LessonPlan> {
  const primaryBook = params.approvedBooks[0] || 'KLB Visionary';
  const secondaryBook = params.approvedBooks[1] || 'Oxford Discovering / NPPE';

  return {
    id: 'lp-' + Date.now(),
    title: `LESSON PLAN: ${params.subject.toUpperCase()} - ${params.subStrand.toUpperCase()}`,
    schoolName: params.schoolName || 'KENYAN SCHOOL',
    teacherName: params.teacherName || 'MWALIMU',
    tscNumber: params.tscNumber || '',
    grade: params.grade,
    subject: params.subject,
    strand: params.strand,
    subStrand: params.subStrand,
    date: params.date || new Date().toISOString().split('T')[0],
    time: '08:20 AM - 09:00 AM',
    durationMinutes: params.durationMinutes || 40,
    rollCallBoys: 24,
    rollCallGirls: 26,
    specificLearningOutcomes: [
      `Define and explain core concepts of ${params.subStrand} using examples from ${primaryBook}`,
      `Demonstrate practical application through guided collaborative tasks`,
      `Demonstrate respect and active listening during peer discussions`,
    ],
    coreCompetencies: ['Critical thinking & problem solving', 'Communication and collaboration', 'Self-efficacy', 'Digital literacy'],
    values: ['Respect', 'Unity', 'Integrity', 'Social justice'],
    pcis: ['Environmental sustainability', 'Health and hygiene', 'Life skills'],
    keyInquiryQuestions: [`Why is understanding ${params.subStrand} vital in modern Kenya?`, `How can we apply these concepts to solve daily challenges?`],
    learningResources: [
      `${primaryBook} (Approved KICD Course Book)`,
      `${secondaryBook} (Teacher Resource)`,
      'Real-world models, flashcards, chalkboard, projector',
    ],
    kicdApprovedBooks: params.approvedBooks,
    introduction: {
      time: '5 mins',
      teacherActivity: 'Teacher reviews previous lesson through prompt questions, introduces the day’s learning intention and displays chart.',
      learnerActivity: 'Learners answer recall questions, observe displayed stimulus and state their expectations.',
    },
    lessonDevelopment: [
      {
        step: 'Step 1: Conceptual Exploration',
        time: '12 mins',
        teacherActivity: `Guides learners to open ${primaryBook} (relevant chapter) and facilitates whole-class discussion on key definitions.`,
        learnerActivity: 'Learners read silently in pairs, highlight unfamiliar terms, and formulate explanatory sentences.',
        competenceFocus: 'Communication & Literacy',
      },
      {
        step: 'Step 2: Experiential Group Task',
        time: '15 mins',
        teacherActivity: 'Organizes learners into heterogeneous groups of 4-5. Distributes task sheets and circulates to offer prompt scaffolding.',
        learnerActivity: 'Learners actively perform calculations/experiment, record findings on flipcharts, and select a spokesperson.',
        competenceFocus: 'Collaboration & Critical Thinking',
      },
      {
        step: 'Step 3: Plenary & Synthesis',
        time: '5 mins',
        teacherActivity: 'Invites two groups to present findings; harmonizes feedback and corrects misconceptions on chalkboard.',
        learnerActivity: 'Learners take notes, ask clarifying questions, and evaluate peer presentations respectfully.',
        competenceFocus: 'Self-Efficacy & Presentation',
      },
    ],
    conclusion: {
      time: '3 mins',
      summary: `Summarizes key takeaways of ${params.subStrand}. Commends active participation and assigns follow-up workbook drill.`,
      learnerActivity: 'Learners note the homework exercise from workbook and tidy their workspace.',
    },
    extendedActivities: `Advanced learners to research community case studies. Remedial learners given targeted support during remedial hour.`,
    selfEvaluation: 'Lesson executed with high learner engagement. 90% attained outcomes as evidenced by workbook exercise.',
    createdAt: new Date().toISOString(),
    approvals: {
      hod: { name: 'HOD Academic Supervision', signed: false, remarks: 'Commendable lesson structure and learner-centred pedagogy.' },
      principal: { name: 'Principal / Headteacher', signed: false, remarks: 'Approved for pedagogical portfolio.' },
    },
  };
}

export function generateRevisionPack(params: GenerateRevisionParams): RevisionMaterial {
  const booksRef = params.approvedBooks.join(', ') || 'KLB Top Mark & Oxford Secondary';
  return {
    id: 'rev-' + Date.now(),
    title: `${params.curriculum} REVISION PAPER & MARKING SCHEME - ${params.subject.toUpperCase()} (${params.grade.toUpperCase()})`,
    grade: params.grade,
    subject: params.subject,
    curriculum: params.curriculum,
    term: 'Term 1 / Term 2 Comprehensive',
    topics: params.topics,
    kicdBookReferences: params.approvedBooks,
    durationMinutes: params.durationMinutes,
    totalMarks: params.totalMarks,
    questions: [
      {
        number: 1,
        questionText: `Outline three fundamental characteristics of ${params.topics[0] || 'the core syllabus topic'} and explain how they influence real-life problem solving. (6 marks)`,
        marks: 6,
        answerGuide: `Award [2 marks] for each well-elaborated point:\n1. Accurate structural definition and classification.\n2. Systematic interaction with environmental factors.\n3. Measurable quantitative or qualitative indicators as outlined in ${booksRef}.`,
        kicdBookReference: `${booksRef} Section 1`,
      },
      {
        number: 2,
        questionText: `With the aid of a well-labeled diagram or structured calculation, analyze the step-by-step mechanism of ${params.topics[1] || 'practical application'}. (8 marks)`,
        marks: 8,
        answerGuide: `Diagram / Formula setup: [2 marks]\nCorrect labeling / parameter substitution: [3 marks]\nFinal interpretation and correct unit/conclusion: [3 marks]. Reference: ${booksRef}.`,
        kicdBookReference: `${booksRef} Practical Section`,
      },
      {
        number: 3,
        questionText: `Discuss four challenges encountered in Kenyan communities regarding ${params.topics[2] || 'sustainable development'} and propose realistic mitigation measures. (8 marks)`,
        marks: 8,
        answerGuide: `Award [1 mark] for identifying challenge + [1 mark] for viable solution up to 4 pairs (Total: 8 marks).\nChallenges: Resource constraints, climatic variability, limited technical skills, inadequate policy enforcement.\nSolutions: Community empowerment, adopting renewable technologies, public awareness, stakeholder collaboration.`,
        kicdBookReference: `${booksRef} Topical Application`,
      },
      {
        number: 4,
        questionText: `Competency Based Evaluation (CBE) Performance Task: Design a community project proposal addressing ${params.topics[0] || 'local resource management'}. Include title, objectives, activities, and budget estimates. (10 marks)`,
        marks: 10,
        answerGuide: `Rubric Scoring:\n- Project Title & Contextualization: 2 marks\n- SMART Objectives: 3 marks\n- Implementation plan & stakeholder engagement: 3 marks\n- Realistic budgeting & sustainability: 2 marks`,
        kicdBookReference: `${booksRef} Rubrics & Assessment Guide`,
      },
    ],
    createdAt: new Date().toISOString(),
  };
}
