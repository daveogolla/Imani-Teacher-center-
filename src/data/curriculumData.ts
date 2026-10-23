export interface TermCalendarConfig {
  term: 'Term 1' | 'Term 2' | 'Term 3';
  termStartDate: string;
  termEndDate: string;
  halfTermStartDate: string;
  halfTermEndDate: string;
  halfTermWeek: number;
  hasHalfTerm: boolean;
  totalWeeks: number;
  description: string;
}

export const KENYA_TERM_CONFIG: Record<'Term 1' | 'Term 2' | 'Term 3', TermCalendarConfig> = {
  'Term 1': {
    term: 'Term 1',
    termStartDate: '2026-01-06',
    termEndDate: '2026-04-03',
    halfTermStartDate: '2026-02-18',
    halfTermEndDate: '2026-02-22',
    halfTermWeek: 7,
    hasHalfTerm: true,
    totalWeeks: 13,
    description: 'Term 1: Opening 6th Jan, Mid-term 18-22 Feb, Closing 3rd Apr (13 Weeks)',
  },
  'Term 2': {
    term: 'Term 2',
    termStartDate: '2026-05-04',
    termEndDate: '2026-07-31',
    halfTermStartDate: '2026-06-24',
    halfTermEndDate: '2026-06-28',
    halfTermWeek: 8,
    hasHalfTerm: true,
    totalWeeks: 13,
    description: 'Term 2: Opening 4th May, Mid-term 24-28 Jun, Closing 31st Jul (13 Weeks)',
  },
  'Term 3': {
    term: 'Term 3',
    termStartDate: '2026-08-24',
    termEndDate: '2026-10-23',
    halfTermStartDate: '',
    halfTermEndDate: '',
    halfTermWeek: 0,
    hasHalfTerm: false,
    totalWeeks: 9,
    description: 'Term 3: Opening 24th Aug, No Half-Term Break, Closing 23rd Oct (National Exams Prep - 9 Weeks continuous)',
  },
};

export interface GradeInfo {
  id: string;
  name: string;
  level: 'Pre-Primary' | 'Lower Primary' | 'Upper Primary' | 'Junior Secondary' | 'Senior Secondary';
  curriculum: 'CBE' | 'KCSE' | 'BOTH';
  subjects: string[];
}

export const GRADES_LIST: GradeInfo[] = [
  {
    id: 'PP1',
    name: 'Pre-Primary 1 (PP1)',
    level: 'Pre-Primary',
    curriculum: 'CBE',
    subjects: ['Mathematical Activities', 'Language Activities', 'Environmental Activities', 'Psychomotor and Creative Activities', 'Religious Education (CRE/IRE)'],
  },
  {
    id: 'PP2',
    name: 'Pre-Primary 2 (PP2)',
    level: 'Pre-Primary',
    curriculum: 'CBE',
    subjects: ['Mathematical Activities', 'Language Activities', 'Environmental Activities', 'Psychomotor and Creative Activities', 'Religious Education (CRE/IRE)'],
  },
  {
    id: 'Grade 1',
    name: 'Grade 1',
    level: 'Lower Primary',
    curriculum: 'CBE',
    subjects: ['Mathematics', 'English', 'Kiswahili', 'Environmental Activities', 'Creative Activities', 'Religious Education (CRE/IRE)'],
  },
  {
    id: 'Grade 2',
    name: 'Grade 2',
    level: 'Lower Primary',
    curriculum: 'CBE',
    subjects: ['Mathematics', 'English', 'Kiswahili', 'Environmental Activities', 'Creative Activities', 'Religious Education (CRE/IRE)'],
  },
  {
    id: 'Grade 3',
    name: 'Grade 3',
    level: 'Lower Primary',
    curriculum: 'CBE',
    subjects: ['Mathematics', 'English', 'Kiswahili', 'Environmental Activities', 'Creative Activities', 'Religious Education (CRE/IRE)'],
  },
  {
    id: 'Grade 4',
    name: 'Grade 4',
    level: 'Upper Primary',
    curriculum: 'CBE',
    subjects: ['Mathematics', 'English', 'Kiswahili', 'Science and Technology', 'Agriculture', 'Social Studies', 'CRE', 'Creative Arts'],
  },
  {
    id: 'Grade 5',
    name: 'Grade 5',
    level: 'Upper Primary',
    curriculum: 'CBE',
    subjects: ['Mathematics', 'English', 'Kiswahili', 'Science and Technology', 'Agriculture', 'Social Studies', 'CRE', 'Creative Arts'],
  },
  {
    id: 'Grade 6',
    name: 'Grade 6',
    level: 'Upper Primary',
    curriculum: 'CBE',
    subjects: ['Mathematics', 'English', 'Kiswahili', 'Science and Technology', 'Agriculture', 'Social Studies', 'CRE', 'Creative Arts'],
  },
  {
    id: 'Grade 7',
    name: 'Grade 7 (JSS 1)',
    level: 'Junior Secondary',
    curriculum: 'CBE',
    subjects: ['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Health Education', 'Social Studies', 'Agriculture', 'Pre-Technical Studies', 'CRE/IRE', 'Creative Arts and Sports'],
  },
  {
    id: 'Grade 8',
    name: 'Grade 8 (JSS 2)',
    level: 'Junior Secondary',
    curriculum: 'CBE',
    subjects: ['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Health Education', 'Social Studies', 'Agriculture', 'Pre-Technical Studies', 'CRE/IRE', 'Creative Arts and Sports'],
  },
  {
    id: 'Grade 9',
    name: 'Grade 9 (JSS 3 - KJSEA)',
    level: 'Junior Secondary',
    curriculum: 'CBE',
    subjects: ['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Health Education', 'Social Studies', 'Agriculture', 'Pre-Technical Studies', 'CRE/IRE', 'Creative Arts and Sports'],
  },
  {
    id: 'Grade 10',
    name: 'Grade 10 / Form 1',
    level: 'Senior Secondary',
    curriculum: 'BOTH',
    subjects: ['Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics', 'History & Government', 'Geography', 'CRE', 'Agriculture', 'Business Studies', 'Computer Studies'],
  },
  {
    id: 'Grade 11',
    name: 'Grade 11 / Form 2',
    level: 'Senior Secondary',
    curriculum: 'BOTH',
    subjects: ['Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics', 'History & Government', 'Geography', 'CRE', 'Agriculture', 'Business Studies', 'Computer Studies'],
  },
  {
    id: 'Grade 12',
    name: 'Grade 12 / Form 3',
    level: 'Senior Secondary',
    curriculum: 'KCSE',
    subjects: ['Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics', 'History & Government', 'Geography', 'CRE', 'Agriculture', 'Business Studies', 'Computer Studies'],
  },
  {
    id: 'Form 4',
    name: 'Form 4 (KCSE National Examination Class)',
    level: 'Senior Secondary',
    curriculum: 'KCSE',
    subjects: [
      'Mathematics (Alt A)',
      'English (Paper 1, 2, 3)',
      'Kiswahili (Karatasi 1, 2, 3)',
      'Biology (Paper 1, 2, 3)',
      'Chemistry (Paper 1, 2, 3)',
      'Physics (Paper 1, 2, 3)',
      'History & Government',
      'Geography',
      'Christian Religious Education (CRE)',
      'Agriculture',
      'Business Studies',
      'Computer Studies',
    ],
  },
];

export const KENYAN_COUNTIES_SCHOOLS: string[] = [
  'Alliance High School, Kiambu',
  'Alliance Girls High School, Kiambu',
  'Kenya High School, Nairobi',
  'Pangani Girls High School, Nairobi',
  'Mang\'u High School, Kiambu',
  'Maseno School, Kisumu',
  'St. George\'s Girls Secondary, Nairobi',
  'Kakamega High School, Kakamega',
  'Kisumu Boys High School, Kisumu',
  'Kisumu Girls High School, Kisumu',
  'Nyeri High School, Nyeri',
  'Kapsabet High School, Nandi',
  'Moi High School Kabarak, Nakuru',
  'Loreto High School Limuru, Kiambu',
  'Maranda High School, Siaya',
  'Nairobi School, Nairobi',
  'Starehe Boys\' Centre, Nairobi',
  'Maryhill Girls High School, Thika',
  'Lugulu Girls High School, Bungoma',
  'Chogoria Girls High School, Tharaka Nithi',
  'Makueni Boys High School, Makueni',
  'Meru School, Meru',
  'Garissa High School, Garissa',
  'Moi Forces Academy, Nairobi',
  'Kenyatta High School Mwatate, Taita Taveta',
  'Nakuru High School, Nakuru',
];


export interface TopicCatalogItem {
  id: string;
  grade: string;
  curriculum: 'CBE' | 'KCSE' | 'BOTH';
  learningArea: string;
  strand: string;
  subStrand: string;
  keyInquiryQuestion: string;
  coreCompetencies: string[];
  kicdRecommendedBooks: string[];
}

export const TOPIC_CATALOG: TopicCatalogItem[] = [
  // JSS Grade 7 Mathematics
  {
    id: 'top-g7-math-1',
    grade: 'Grade 7',
    curriculum: 'CBE',
    learningArea: 'Mathematics',
    strand: 'Numbers',
    subStrand: 'Whole Numbers & Operations',
    keyInquiryQuestion: 'How do prime numbers and prime factorisation help in real-life problem solving?',
    coreCompetencies: ['Critical thinking', 'Problem solving', 'Digital literacy'],
    kicdRecommendedBooks: ['KLB Visionary Junior Secondary Mathematics Grade 7', 'Moran Junior Secondary Mathematics'],
  },
  {
    id: 'top-g7-math-2',
    grade: 'Grade 7',
    curriculum: 'CBE',
    learningArea: 'Mathematics',
    strand: 'Algebra',
    subStrand: 'Linear Equations in One Variable',
    keyInquiryQuestion: 'How can balance scales model algebraic equations in commercial trade?',
    coreCompetencies: ['Analytical thinking', 'Self-efficacy'],
    kicdRecommendedBooks: ['KLB Visionary Junior Secondary Mathematics Grade 7', 'Oxford Fountain Mathematics'],
  },
  // JSS Grade 7 Integrated Science
  {
    id: 'top-g7-sci-1',
    grade: 'Grade 7',
    curriculum: 'CBE',
    learningArea: 'Integrated Science',
    strand: 'Mixtures, Elements and Compounds',
    subStrand: 'Separation of Mixtures (Filtration, Decantation, Evaporation)',
    keyInquiryQuestion: 'How can dirty flood water be purified using locally available materials?',
    coreCompetencies: ['Creativity and imagination', 'Environmental citizenship'],
    kicdRecommendedBooks: ['Oxford Discovering Integrated Science Grade 7', 'KLB Visionary Integrated Science Grade 7'],
  },
  {
    id: 'top-g7-sci-2',
    grade: 'Grade 7',
    curriculum: 'CBE',
    learningArea: 'Integrated Science',
    strand: 'Living Things',
    subStrand: 'Human Excretory System & Kidney Care',
    keyInquiryQuestion: 'What daily lifestyle practices promote optimal renal and urinary health?',
    coreCompetencies: ['Self-efficacy', 'Health literacy'],
    kicdRecommendedBooks: ['Oxford Discovering Integrated Science Grade 7', 'Moran Health Education Grade 7'],
  },
  // JSS Grade 8 Pre-Technical Studies
  {
    id: 'top-g8-pretech-1',
    grade: 'Grade 8',
    curriculum: 'CBE',
    learningArea: 'Pre-Technical Studies',
    strand: 'Workshop Safety & Hand Tools',
    subStrand: 'Woodworking Tools (Saws, Planes, Chisels) and Maintenance',
    keyInquiryQuestion: 'How do workshop safety protocols mitigate occupational hazards in Kenyan TVET centres?',
    coreCompetencies: ['Communication', 'Collaboration', 'Occupational safety'],
    kicdRecommendedBooks: ['Mentor Pre-Technical Studies Grade 8', 'KLB Pre-Technical Grade 8'],
  },
  // Grade 6 Social Studies
  {
    id: 'top-g6-soc-1',
    grade: 'Grade 6',
    curriculum: 'CBE',
    learningArea: 'Social Studies',
    strand: 'Citizenship & Governance',
    subStrand: 'Structure of the National Government of Kenya & Bill of Rights',
    keyInquiryQuestion: 'How does the Constitution of Kenya 2010 protect children and vulnerable citizens?',
    coreCompetencies: ['Citizenship', 'Peace and cohesion', 'Critical thinking'],
    kicdRecommendedBooks: ['Spotlight Social Studies Grade 6 CBC', 'Champion Social Studies EAEP'],
  },
  // Grade 4 Science & Tech
  {
    id: 'top-g4-sci-1',
    grade: 'Grade 4',
    curriculum: 'CBE',
    learningArea: 'Science and Technology',
    strand: 'Living Things',
    subStrand: 'Characteristics of Vertebrates and Invertebrates',
    keyInquiryQuestion: 'How do backboned animals adapt to Kenyan savanna and forest habitats?',
    coreCompetencies: ['Observation', 'Digital research'],
    kicdRecommendedBooks: ['KLB Visionary Science & Technology Grade 4', 'Oxford Discovering Science Grade 4'],
  },
  // PP1 Mathematical Activities
  {
    id: 'top-pp1-math-1',
    grade: 'PP1',
    curriculum: 'CBE',
    learningArea: 'Mathematical Activities',
    strand: 'Classification',
    subStrand: 'Sorting and Grouping Objects by Colour and Size',
    keyInquiryQuestion: 'How can we group our toys, bottle tops, and beads so they stay neat?',
    coreCompetencies: ['Fine motor skills', 'Visual discrimination'],
    kicdRecommendedBooks: ['Moran Pre-Primary 1 Mathematical Activities', 'Mountain Top PP1 Math'],
  },
  // Grade 10 / Form 1 Chemistry (Senior Secondary / KCSE)
  {
    id: 'top-g10-chem-1',
    grade: 'Grade 10',
    curriculum: 'BOTH',
    learningArea: 'Chemistry',
    strand: 'Structure of the Atom & Periodic Table',
    subStrand: 'Electron Configuration and Chemical Reactivity of Groups I and VII',
    keyInquiryQuestion: 'Why are alkali metals stored under paraffin oil while halogens are non-metals?',
    coreCompetencies: ['Scientific methodology', 'Chemical laboratory safety'],
    kicdRecommendedBooks: ['Oxford Certificate Chemistry for Secondary Schools', 'KLB Secondary Chemistry Form 1'],
  },
  // Grade 12 / Form 4 KCSE Biology
  {
    id: 'top-g12-bio-1',
    grade: 'Grade 12',
    curriculum: 'KCSE',
    learningArea: 'Biology',
    strand: 'Genetics',
    subStrand: 'Mendelian Genetics, DNA Structure, and Monohybrid Crosses',
    keyInquiryQuestion: 'How does genetic variation account for sickle cell trait resistance to malaria in Kenya?',
    coreCompetencies: ['Critical analysis', 'Scientific deduction'],
    kicdRecommendedBooks: ['KLB Secondary Biology Forms 1 - 4', 'Spotlight KCSE Biology'],
  },
  // Grade 12 / Form 4 KCSE Mathematics
  {
    id: 'top-g12-math-1',
    grade: 'Grade 12',
    curriculum: 'KCSE',
    learningArea: 'Mathematics',
    strand: 'Calculus',
    subStrand: 'Differentiation (Rates of Change, Stationary Points, Maxima & Minima)',
    keyInquiryQuestion: 'How do engineers optimize container volumes and fuel consumption using derivatives?',
    coreCompetencies: ['Mathematical modeling', 'Abstract problem solving'],
    kicdRecommendedBooks: ['KLB Top Mark KCSE Mathematics', 'Longhorn Secondary Mathematics Form 4'],
  },
  // Form 4 English Literature (Set Books)
  {
    id: 'top-f4-eng-lit-1',
    grade: 'Form 4',
    curriculum: 'KCSE',
    learningArea: 'English (Paper 1, 2, 3)',
    strand: 'Literary Appreciation (The Novel)',
    subStrand: 'Thematic Analysis of Fathers of Nations by Paul B. Vitta',
    keyInquiryQuestion: 'How do African writers satirize political summits and ideological blueprints in modern literature?',
    coreCompetencies: ['Critical thinking', 'Creativity and imagination', 'Communication'],
    kicdRecommendedBooks: ['Fathers of Nations (EAEP)', 'Oxford Head Start Secondary English Form 4'],
  },
  {
    id: 'top-f4-eng-play-1',
    grade: 'Form 4',
    curriculum: 'KCSE',
    learningArea: 'English (Paper 1, 2, 3)',
    strand: 'Dramatic Literature (The Play)',
    subStrand: 'Social Justice and Whistleblowing in The Samaritan by John Lara',
    keyInquiryQuestion: 'How can citizen-led technological innovations hold corrupt leaders accountable?',
    coreCompetencies: ['Digital citizenship', 'Ethical leadership', 'Critical analysis'],
    kicdRecommendedBooks: ['The Samaritan (EAEP)', 'Spotlight KCSE English Guide'],
  },
  // Form 4 Kiswahili Fasihi
  {
    id: 'top-f4-kisw-fasihi-1',
    grade: 'Form 4',
    curriculum: 'KCSE',
    learningArea: 'Kiswahili (Karatasi 1, 2, 3)',
    strand: 'Fasihi Andishi: Tamthilia',
    subStrand: 'Maudhui ya Ndoa na Uvumilivu katika Bembea ya Maringa',
    keyInquiryQuestion: 'Je, mwanamke anachangia vipi kuleta utulivu na maendeleo katika familia ya kisasa?',
    coreCompetencies: ['Upatanishi', 'Stadi za Mawasiliano', 'Uchanganuzi wa Fasihi'],
    kicdRecommendedBooks: ['Bembea ya Maringa (EAEP)', 'JKF Mwongozo wa Fasihi na Ushairi wa Kiswahili KCSE'],
  },
  // Form 4 History & Government
  {
    id: 'top-f4-hist-1',
    grade: 'Form 4',
    curriculum: 'KCSE',
    learningArea: 'History & Government',
    strand: 'Devolved Government & Public Finance',
    subStrand: 'County Revenue Allocation & Functions of County Assemblies',
    keyInquiryQuestion: 'How does the 2010 Constitution ensure equitable revenue sharing among the 47 Kenyan counties?',
    coreCompetencies: ['Civic responsibility', 'Analytical reasoning', 'Financial awareness'],
    kicdRecommendedBooks: ['KLB Secondary History & Government Form 4', 'Oxford Living History and Government Form 1 - 4'],
  },
  // Grade 8 JSS Agriculture
  {
    id: 'top-g8-agri-1',
    grade: 'Grade 8',
    curriculum: 'CBE',
    learningArea: 'Agriculture',
    strand: 'Crop Production & Soil Conservation',
    subStrand: 'Vertical Gardening, Hydroponics & Organic Compost',
    keyInquiryQuestion: 'How can urban schools produce organic vegetables in small compound spaces?',
    coreCompetencies: ['Environmental stewardship', 'Problem solving', 'Entrepreneurship'],
    kicdRecommendedBooks: ['Longhorn Smart Score Agriculture Grade 8', 'Mentor Agriculture and Nutrition Grade 8'],
  },
  // Grade 7 JSS Creative Arts & Sports
  {
    id: 'top-g7-cas-1',
    grade: 'Grade 7',
    curriculum: 'CBE',
    learningArea: 'Creative Arts and Sports',
    strand: 'Performing Arts (Music & Athletics)',
    subStrand: 'Kenyan Indigenous Musical Instruments and Sprint Running Techniques',
    keyInquiryQuestion: 'How does traditional musical heritage enrich national unity and physical well-being?',
    coreCompetencies: ['Cultural preservation', 'Physical fitness', 'Collaboration'],
    kicdRecommendedBooks: ['KLB Visionary Creative Arts and Sports Grade 7', 'Champion Creative Arts EAEP Grade 7'],
  },
];

// ==========================================
// OFFICIAL KICD STRANDS & TOPICS PER TERM
// ==========================================
export interface TermStrand {
  id: string;
  strand: string;
  subStrands: string[];
}

export const KICD_TERM_STRANDS_DATABASE: Record<string, Record<'Term 1' | 'Term 2' | 'Term 3', TermStrand[]>> = {
  // JSS Mathematics (Grade 7, 8, 9)
  'Grade 7-Mathematics': {
    'Term 1': [
      { id: 'g7-m-t1-1', strand: 'Numbers', subStrands: ['Whole Numbers & Place Value', 'Operations on Whole Numbers', 'Prime Factorisation, GCD & LCM', 'Fractions & Recurring Decimals'] },
      { id: 'g7-m-t1-2', strand: 'Square Roots & Powers', subStrands: ['Squares and Square Roots of Numbers & Decimals', 'Indices and Powers'] },
      { id: 'g7-m-t1-3', strand: 'Fractions and Decimals', subStrands: ['Operations on Fractions', 'Decimals and Rounding Off', 'Percentages and Practical Calculations'] },
    ],
    'Term 2': [
      { id: 'g7-m-t2-1', strand: 'Algebra', subStrands: ['Algebraic Expressions & Simplification', 'Linear Equations in One Variable', 'Linear Inequalities in One Variable'] },
      { id: 'g7-m-t2-2', strand: 'Measurements (Plane Figures)', subStrands: ['Perimeter of Polygons and Circles', 'Area of Rectangles, Triangles and Parallelograms', 'Area of Trapeziums and Circles'] },
      { id: 'g7-m-t2-3', strand: 'Geometry', subStrands: ['Angles on Parallel Lines & Transversals', 'Angles in Triangles and Polygons', 'Geometric Constructions of Angles (60°, 90°, 45°)'] },
    ],
    'Term 3': [
      { id: 'g7-m-t3-1', strand: 'Measurements (Solid Figures)', subStrands: ['Surface Area of Prisms and Cylinders', 'Volume and Capacity of Cylinders and Cuboids', 'Time, Distance and Speed Rates'] },
      { id: 'g7-m-t3-2', strand: 'Money & Financial Literacy', subStrands: ['Profit, Loss, Discount and Commission', 'Simple Interest and Hire Purchase Basics', 'Budgeting and Mobile Money Fees'] },
      { id: 'g7-m-t3-3', strand: 'Data Handling & Probability', subStrands: ['Data Collection, Tally & Frequency Tables', 'Bar Graphs, Line Graphs & Pie Charts', 'Mean, Median and Mode of Ungrouped Data', 'Basic Experimental Probability & Term Revision'] },
    ],
  },
  'Grade 8-Mathematics': {
    'Term 1': [
      { id: 'g8-m-t1-1', strand: 'Numbers & Real Number System', subStrands: ['Real Numbers, Rational & Irrational Numbers', 'Surds and Simplification', 'Standard Form & Scientific Notation'] },
      { id: 'g8-m-t1-2', strand: 'Financial Literacy', subStrands: ['Compound Interest and Depreciation', 'Foreign Exchange Rates & Currency Conversion', 'PAYE and Income Taxation in Kenya'] },
    ],
    'Term 2': [
      { id: 'g8-m-t2-1', strand: 'Algebra & Matrices', subStrands: ['Simultaneous Linear Equations (Substitution & Elimination)', 'Quadratic Expressions and Factorisation', 'Linear Programming Inequalities'] },
      { id: 'g8-m-t2-2', strand: 'Measurements & Trigonometry', subStrands: ['Pythagoras Theorem in 2D and 3D', 'Trigonometric Ratios (Sine, Cosine, Tangent of Acute Angles)', 'Angles of Elevation and Depression'] },
    ],
    'Term 3': [
      { id: 'g8-m-t3-1', strand: 'Geometry & Transformations', subStrands: ['Reflection, Rotation and Congruence', 'Scale Drawing, Bearings and Distances'] },
      { id: 'g8-m-t3-2', strand: 'Statistics & Probability', subStrands: ['Grouped Data, Histograms and Frequency Polygons', 'Measures of Central Tendency', 'Compound Probability Events & Term 3 Exam Prep'] },
    ],
  },
  // JSS Integrated Science
  'Grade 7-Integrated Science': {
    'Term 1': [
      { id: 'g7-s-t1-1', strand: 'Scientific Investigation', subStrands: ['Introduction to Integrated Science & Laboratory Safety Rules', 'Handling Laboratory Apparatus & Bunsen Burner', 'SI Units, Density and Measurement'] },
      { id: 'g7-s-t1-2', strand: 'Mixtures, Elements and Compounds', subStrands: ['Simple and Fractional Distillation', 'Chromatography and Solvent Extraction', 'Crystallization and Evaporation to Dryness'] },
      { id: 'g7-s-t1-3', strand: 'Cell Biology & Living Systems', subStrands: ['Parts and Use of Light Microscope', 'Plant and Animal Cell Structure', 'Specialized Cells and Tissue Organization'] },
    ],
    'Term 2': [
      { id: 'g7-s-t2-1', strand: 'Human Body Systems', subStrands: ['Human Excretory System (Kidneys, Skin, Lungs)', 'Kidney Function, Nephron Structure & Dialysis', 'Urinary Tract Health and Water Intake'] },
      { id: 'g7-s-t2-2', strand: 'Reproduction in Plants and Animals', subStrands: ['Parts of a Flower and Pollination Mechanisms', 'Fertilization and Seed Dispersal in Kenya', 'Human Adolescent Physical Changes & Hygiene'] },
      { id: 'g7-s-t2-3', strand: 'Thermal Energy', subStrands: ['Conduction, Convection and Radiation', 'Vacuum Flask & Solar Water Heaters', 'Expansion in Solids, Liquids and Gases'] },
    ],
    'Term 3': [
      { id: 'g7-s-t3-1', strand: 'Electricity & Magnetism', subStrands: ['Electrostatics, Charging by Friction and Induction', 'Simple Series and Parallel Electrical Circuits', 'Magnets, Magnetic Poles and Magnetic Shielding'] },
      { id: 'g7-s-t3-2', strand: 'Earth & Environmental Science', subStrands: ['Soil Profile, Water Retention & Conservation', 'Air Pollution, Greenhouse Effect & Climate Mitigation', 'Water Purification Technologies for Kenyan Schools', 'KJSEA Summative Science Project & Term 3 Exam Prep'] },
    ],
  },
  'Grade 8-Integrated Science': {
    'Term 1': [
      { id: 'g8-s-t1-1', strand: 'Atoms, Bonding & Elements', subStrands: ['Atomic Structure, Protons, Neutrons & Electrons', 'Periodic Table: Group I and Group VII Elements', 'Acids, Bases and Indicators (Litmus, Methyl Orange, Phenolphthalein)'] },
      { id: 'g8-s-t1-2', strand: 'Human Digestive System', subStrands: ['Teeth Structure and Dental Hygiene', 'Alimentary Canal, Enzymatic Digestion and Absorption', 'Balanced Diet, Malnutrition and Nutritional Deficiency Diseases'] },
    ],
    'Term 2': [
      { id: 'g8-s-t2-1', strand: 'Circulatory & Respiratory Systems', subStrands: ['Structure of the Human Heart and Blood Vessels', 'Blood Groups (ABO System), Rhesus Factor and Transfusion', 'Gaseous Exchange in Humans and Alveolar Function'] },
      { id: 'g8-s-t2-2', strand: 'Forces & Energy', subStrands: ['Frictional Force, Viscosity and Surface Tension', 'Work, Energy, Power and Simple Machines (Pulleys, Inclined Planes)', 'Pressure in Solids and Liquids (Hydraulic Lift)'] },
    ],
    'Term 3': [
      { id: 'g8-s-t3-1', strand: 'Light & Optical Instruments', subStrands: ['Reflection at Plane and Curved Mirrors', 'Refraction of Light and Snell\'s Law', 'Lenses, Defects of Vision and Corrections'] },
      { id: 'g8-s-t3-2', strand: 'Ecological Interactions', subStrands: ['Ecosystems, Food Chains, Food Webs and Trophic Levels', 'Waste Management and 4Rs (Reduce, Reuse, Recycle, Recover)', 'Summative Integrated Science Examination Prep'] },
    ],
  },
  // Form 4 KCSE Classes
  'Form 4-Mathematics (Alt A)': {
    'Term 1': [
      { id: 'f4-m-t1-1', strand: 'Matrices and Transformations', subStrands: ['Matrix Operations and Determinants', 'Inverse of 2x2 Matrices and Area Scale Factors', 'Shear, Stretch and Isometric Transformations'] },
      { id: 'f4-m-t1-2', strand: 'Statistics II', subStrands: ['Mean, Median and Quartiles for Grouped Data', 'Variance and Standard Deviation', 'Cumulative Frequency Curves (Ogive) & Percentiles'] },
      { id: 'f4-m-t1-3', strand: 'Loci & Geometric Constructions', subStrands: ['Locus of Points Equidistant from Two Points/Lines', 'Circumscribing and Inscribing Triangles', 'Intersecting Chords & Tangent Properties'] },
    ],
    'Term 2': [
      { id: 'f4-m-t2-1', strand: 'Three Dimensional Geometry', subStrands: ['Projection of Lines on Planes', 'Angle Between Two Lines and Line & Plane', 'Angle Between Two Planes (Skew Lines)'] },
      { id: 'f4-m-t2-2', strand: 'Calculus (Differentiation & Integration)', subStrands: ['Derivatives by Rule, Tangents & Normals', 'Turning Points, Maxima, Minima & Point of Inflexion', 'Definite and Indefinite Integrals, Area Under Curves', 'Linear Programming (Feasible Regions & Objective Function)'] },
    ],
    'Term 3': [
      { id: 'f4-m-t3-1', strand: 'KCSE National Examination Revision', subStrands: ['KCSE Paper 1 Comprehensive Revision (Section I & II)', 'KCSE Paper 2 Comprehensive Revision (Section I & II)', 'KNEC Marking Scheme Traps, Timing & Speed Drills', 'National Mock Examinations & Candidate Final Prep'] },
    ],
  },
  'Form 4-Biology (Paper 1, 2, 3)': {
    'Term 1': [
      { id: 'f4-b-t1-1', strand: 'Genetics', subStrands: ['DNA Structure, Replication and RNA Transcription', 'Mendel\'s First and Second Laws of Inheritance', 'Monohybrid and Dihybrid Crosses, Incomplete Dominance', 'Sex Determination, Sex-Linkage (Hemophilia, Color Blindness)', 'Chromosomal Mutations, Gene Mutations and Genetic Disorders'] },
      { id: 'f4-b-t1-2', strand: 'Evolution', subStrands: ['Theories of Origin of Life (Special Creation, Chemical Evolution)', 'Lamarckian and Darwinian Natural Selection Theories', 'Evidence for Evolution: Fossil Records, Comparative Anatomy, Embryology'] },
    ],
    'Term 2': [
      { id: 'f4-b-t2-1', strand: 'Reception, Response & Coordination', subStrands: ['Structure of Neurons, Reflex Arc and Synaptic Transmission', 'Human Brain, Spinal Cord and Central Nervous System', 'Eye Anatomy, Accommodation, Defects and Vision Correction', 'Ear Structure, Mechanism of Hearing and Balance Maintenance'] },
      { id: 'f4-b-t2-2', strand: 'Support and Movement', subStrands: ['Support in Herbaceous & Woody Plants (Turgidity, Sclerenchyma)', 'Human Endoskeleton: Axial and Appendicular Skeleton', 'Synovial Joints, Muscle Action (Biceps and Triceps), Bone Fractures'] },
    ],
    'Term 3': [
      { id: 'f4-b-t3-1', strand: 'KCSE Biology Paper 1, 2 & 3 Revision', subStrands: ['Paper 1 (Theory Short Answers) Systematic Syllabus Review', 'Paper 2 (Structured Essays & Genetics Calculations)', 'Paper 3 (Laboratory Practicals: Food Tests, Respiration, Microscopy, Ecology)', 'KCSE Trial Papers & Candidate Examination Readiness'] },
    ],
  },
  'Form 4-Chemistry (Paper 1, 2, 3)': {
    'Term 1': [
      { id: 'f4-c-t1-1', strand: 'Acids, Bases & Salts (Volumetric Analysis)', subStrands: ['Standard Solutions and Acid-Base Titration Calculations', 'Molarity, Concentration and Percentage Purity', 'Back Titration, Water of Crystallization & Redox Titrations'] },
      { id: 'f4-c-t1-2', strand: 'Energy Changes in Chemical Processes', subStrands: ['Endothermic and Exothermic Reactions, Enthalpy Profiles', 'Enthalpy of Solution, Neutralization and Combustion', 'Hess\'s Law and Born-Haber Cycles'] },
      { id: 'f4-c-t1-3', strand: 'Reaction Rates & Reversible Reactions', subStrands: ['Collision Theory, Factors Affecting Reaction Rates', 'Dynamic Equilibrium, Le Chatelier\'s Principle (Haber & Contact Processes)'] },
    ],
    'Term 2': [
      { id: 'f4-c-t2-1', strand: 'Electrochemistry', subStrands: ['Oxidation Numbers and Redox Balancing', 'Electrochemical Cells and Standard Electrode Potentials (E°)', 'Electrolysis of Molten & Aqueous Salts, Faraday\'s Laws, Industrial Extraction of Aluminium & Chlorine'] },
      { id: 'f4-c-t2-2', strand: 'Metals & Metallurgy', subStrands: ['Extraction of Sodium (Downs Cell), Iron (Blast Furnace), Copper and Zinc', 'Corrosion of Iron and Prevention Methods'] },
      { id: 'f4-c-t2-3', strand: 'Organic Chemistry II', subStrands: ['Alkanols (Preparation, Properties, Esterification)', 'Alkanoic Acids, Saponification, Soaps and Detergents', 'Polymers, Natural and Synthetic Fibres, Environmental Impacts'] },
    ],
    'Term 3': [
      { id: 'f4-c-t3-1', strand: 'KCSE Chemistry Paper 1, 2 & 3 Revision', subStrands: ['Paper 1 (100% Comprehensive Syllabus Objective Review)', 'Paper 2 (Comprehensive Inorganic & Organic Synthesis Essays)', 'Paper 3 (Qualitative Analysis of Cations/Anions, Flame Tests & Titration Bench Work)', 'KNEC Scoring Criteria & Prediction Mock Papers'] },
    ],
  },
  'Form 4-English (Paper 1, 2, 3)': {
    'Term 1': [
      { id: 'f4-e-t1-1', strand: 'Set Book 1 (Novel): Fathers of Nations', subStrands: ['Plot Overview, Chapter-by-Chapter Breakdown', 'Thematic Analysis: Bad Governance, Neo-Colonialism, Empowerment', 'Characterization: Prof. Kimani, Dr. Afolabi, Pastor Chiamaka, Comrade Melusi', 'Essay Writing Technique and Textual Evidence Quotations'] },
      { id: 'f4-e-t1-2', strand: 'Paper 1: Functional Writing & Oral Skills', subStrands: ['Minutes, Formal Letters, Curriculum Vitae, Confidential Reports', 'Phonology: Stress, Intonation, Rhyme Schemes, Silent Letters', 'Negotiation Skills, Interview Techniques, Public Speaking Etiquette'] },
    ],
    'Term 2': [
      { id: 'f4-e-t2-1', strand: 'Set Book 2 (Play): The Samaritan by John Lara', subStrands: ['Themes of Corruption, Technology & Whistleblowing, Youth Agency', 'Dramatic Irony, Satire, Monologue, Symbolism', 'Character Analysis: Nicole, Mayor Mossi, Bembe, Ramdaye, Harvester'] },
      { id: 'f4-e-t2-2', strand: 'Short Stories Anthology & Poetry', subStrands: ['A Silent Song and Other Stories (Selected 6 Stories Analysis)', 'Poetry Appreciation: Unseen Poems, Paraphrasing, Tone, Mood, Persona', 'Paper 2 Grammar: Conditional Clauses, Inversion, Phrasal Verbs, Question Tags'] },
    ],
    'Term 3': [
      { id: 'f4-e-t3-1', strand: 'KCSE English Examination Mastery', subStrands: ['Paper 1: Functional Writing, Cloze Test & Oral Skills Final Drills', 'Paper 2: Comprehension, Excerpt, Literary Analysis & Grammar Mock Papers', 'Paper 3: Creative Writing (Composition) & Set Book Essays Drills', 'KNEC Candidate Evaluation Rubrics & Examination Strategies'] },
    ],
  },
};

/**
 * Returns official KICD curriculum strands and sub-strands for any given grade, subject and term.
 * If not explicitly registered, generates standardized KICD-compliant curriculum strands.
 */
export function getOfficialTermStrands(
  grade: string,
  subject: string,
  term: 'Term 1' | 'Term 2' | 'Term 3'
): TermStrand[] {
  const directKey = `${grade}-${subject}`;
  if (KICD_TERM_STRANDS_DATABASE[directKey] && KICD_TERM_STRANDS_DATABASE[directKey][term]) {
    return KICD_TERM_STRANDS_DATABASE[directKey][term];
  }

  // Look for partial match
  for (const [key, termRecord] of Object.entries(KICD_TERM_STRANDS_DATABASE)) {
    const [g, s] = key.split('-');
    if (grade.includes(g) || g.includes(grade)) {
      if (subject.toLowerCase().includes(s.toLowerCase().slice(0, 4)) || s.toLowerCase().includes(subject.toLowerCase().slice(0, 4))) {
        if (termRecord[term]) {
          return termRecord[term];
        }
      }
    }
  }

  // High-fidelity dynamic fallback based on term
  if (term === 'Term 1') {
    return [
      {
        id: `${grade}-${subject}-t1-s1`,
        strand: `${subject}: Foundational Concepts & Scientific Principles`,
        subStrands: ['Introduction & Key Terminology', 'Classification & Systematic Grouping', 'Foundational Practical Exercises & Safety'],
      },
      {
        id: `${grade}-${subject}-t1-s2`,
        strand: `${subject}: Core Thematic Structures`,
        subStrands: ['Analysis of Primary Characteristics', 'Model Investigations & Empirical Observations', 'Kenyan Community Context & Realia Application'],
      },
      {
        id: `${grade}-${subject}-t1-s3`,
        strand: `${subject}: Quantitative & Analytical Techniques`,
        subStrands: ['Data Collection & Tabulation', 'Problem-Solving Drills & Exercises', 'Mid-Term Progress Evaluation & Formative Checks'],
      },
    ];
  } else if (term === 'Term 2') {
    return [
      {
        id: `${grade}-${subject}-t2-s1`,
        strand: `${subject}: Intermediate Systems & Dynamics`,
        subStrands: ['Structural Relationships & Functioning', 'Process Flow & Environmental Interactions', 'Case Studies in Kenyan Counties'],
      },
      {
        id: `${grade}-${subject}-t2-s2`,
        strand: `${subject}: Applied Competencies & Innovation`,
        subStrands: ['Practical Workshop / Fieldwork Tasks', 'Formulation of Hypotheses & Model Building', 'Collaborative Group Projects & Presentations'],
      },
      {
        id: `${grade}-${subject}-t2-s3`,
        strand: `${subject}: Contemporary Issues & Values`,
        subStrands: ['Pertinent and Contemporary Issues (PCIs) Integration', 'Ethical Standards, Conservation & Resource Management', 'End of Term 2 Summative Evaluation'],
      },
    ];
  } else {
    // Term 3 (Exam & Revision Term)
    return [
      {
        id: `${grade}-${subject}-t3-s1`,
        strand: `${subject}: Advanced Applications & Synthesis`,
        subStrands: ['Integration of Core Principles Across Topics', 'Critical Inquiry & Analytical Reasoning', 'Systematic Problem Solving in Complex Scenarios'],
      },
      {
        id: `${grade}-${subject}-t3-s2`,
        strand: `${subject}: Comprehensive Syllabus Revision`,
        subStrands: ['Topical Summary & Mind Mapping', 'Review of Formative & Summative Diagnostic Gaps', 'Standard KNEC Question Answering Techniques'],
      },
      {
        id: `${grade}-${subject}-t3-s3`,
        strand: `${subject}: National Examination & Assessment Readiness`,
        subStrands: ['Timed Trial Examinations & Model Papers', 'Marking Scheme Self & Peer Scrutiny', 'Final Candidate Preparedness & Performance Mastery'],
      },
    ];
  }
}

