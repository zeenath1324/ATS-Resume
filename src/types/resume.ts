export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  headline?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  college: string;
  university?: string;
  location?: string;
  graduationYear: string;
  cgpaOrPercentage: string;
  fieldOfStudy?: string;
  relevantCoursework?: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  location?: string;
  responsibilities: string[];
  achievements: string[];
  isCurrent?: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  technologies: string[];
  description: string;
  contribution: string;
  outcome: string;
  liveLink?: string;
  githubLink?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credentialLink?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  year?: string;
}

export interface InternshipItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  responsibilities: string[];
  learnings?: string;
}

export interface LanguageItem {
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

export interface ResumeData {
  id: string;
  title: string;
  targetRole: string;
  isFresher: boolean;
  template: 'classic' | 'modern' | 'technical' | 'fresher' | 'minimal';
  themeColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  fontSize: 'sm' | 'base' | 'lg';
  spacing: 'compact' | 'normal' | 'spacious';
  sectionOrder: string[];
  personalInfo: PersonalInfo;
  summary: string;
  education: EducationItem[];
  skills: SkillCategory[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  internships: InternshipItem[];
  languages: LanguageItem[];
  interests: string[];
  lastModified: string;
}

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  rawText: string;
  dateAdded: string;
  extracted?: {
    requiredSkills: string[];
    preferredSkills: string[];
    educationRequirements: string[];
    experienceRequirements: string[];
    tools: string[];
    technologies: string[];
    importantKeywords: string[];
    responsibilities: string[];
  };
}

export interface KeywordDetail {
  keyword: string;
  category: 'hard-skill' | 'soft-skill' | 'tool' | 'domain';
  frequencyInJob: number;
  foundInResume: boolean;
  importance: 'critical' | 'high' | 'medium';
  whyItMatters: string;
  whereToAddNaturally: string;
}

export interface ScoreCategory {
  score: number;
  weight: number;
  feedback: string;
  suggestions: string[];
}

export interface FormulaDimensionItem {
  dimension: string;
  rawScore: number;
  weight: number;
  contribution: number;
  metricFormula: string;
  evaluatedFactors: string[];
}

export interface ATSBreakdown {
  keywordMatch: number; // max 20
  skillsMatch: number; // max 20
  experienceRelevance: number; // max 15
  projectRelevance: number; // max 15
  educationMatch: number; // max 10
  resumeStructure: number; // max 10
  readability: number; // max 10
}

export interface ProjectAnalysisItem {
  projectName: string;
  relevanceScore: number;
  relevantTechnologies: string[];
  relevantSkills: string[];
  missingOrWeakInfo: string;
  suggestion: string;
}

export interface SkillGapDetail {
  skill: string;
  whyItMatters: string;
  suggestedAction: string;
}

export interface ExperienceAnalysisDetail {
  internshipRelevance: string;
  workExperienceRelevance: string;
  academicRelevance: string;
  projectRelevance: string;
  overallFitAssessment: string;
}

export interface StructureCheckItem {
  section: string;
  exists: boolean;
  status: 'passed' | 'warning' | 'missing';
  detail: string;
}

export interface ContentIssueItem {
  type: 'grammar' | 'repeated-words' | 'long-sentences' | 'weak-verbs' | 'generic' | 'unclear';
  location: string;
  issue: string;
  suggestion: string;
}

export interface ATSAnalysisResult {
  overallScore: number;
  disclaimer: string;
  calculationExplanation: string;
  breakdown?: ATSBreakdown;
  formulaDetails?: {
    equation: string;
    breakdownTable: FormulaDimensionItem[];
    totalCalculated: number;
    auditNotes: string[];
  };
  categories: {
    keywordMatch: ScoreCategory;
    skillsMatch: ScoreCategory;
    experienceMatch: ScoreCategory;
    educationMatch: ScoreCategory;
    resumeStructure: ScoreCategory;
    jobRelevance: ScoreCategory;
    readability: ScoreCategory;
  };
  matchedKeywords: KeywordDetail[];
  missingKeywords: KeywordDetail[];
  recommendedKeywords?: string[];
  requiredSkills?: string[];
  candidateSkills?: string[];
  matchingSkills?: string[];
  skillGaps?: SkillGapDetail[];
  experienceAnalysis?: ExperienceAnalysisDetail;
  projectAnalysis?: ProjectAnalysisItem[];
  structureIssues?: StructureCheckItem[];
  contentIssues?: ContentIssueItem[];
  topReasons?: string[];
  improvementActions?: {
    priority: number;
    title: string;
    action: string;
    impact: string;
  }[];
  skillGap: {
    candidateSkills: string[];
    missingSkills: string[];
    learningPath: {
      step: number;
      skill: string;
      action: string;
      projectIdea: string;
    }[];
  };
  tailoredImprovements: {
    section: string;
    original: string;
    improved: string;
    rationale: string;
  }[];
  timestamp: string;
}

export interface ResumeHealthItem {
  id: string;
  category: 'contact' | 'content' | 'formatting' | 'impact';
  severity: 'critical' | 'warning' | 'info';
  issue: string;
  recommendation: string;
  sectionLink: string;
}

export interface ResumeHealthReport {
  overallHealthScore: number;
  items: ResumeHealthItem[];
}

export interface InterviewQuestion {
  id: string;
  type: 'technical' | 'hr' | 'project' | 'behavioral' | 'role-specific';
  question: string;
  context: string;
  sampleExpectedConcepts: string[];
  difficulty: 'Junior' | 'Mid' | 'Senior';
}

export interface AnswerEvaluation {
  score: number; // 1-10
  technicalCorrectness: number; // 1-10
  relevance: number; // 1-10
  clarity: number; // 1-10
  communication: number; // 1-10
  completeness: number; // 1-10
  positivePoints: string[];
  areasOfImprovement: string[];
  idealModelAnswer: string;
}

export interface ResumeImprovementItem {
  id: string;
  sectionType: 'summary' | 'project' | 'experience' | 'internship' | 'achievement';
  sectionTitle: string;
  originalText: string;
  improvedText: string;
  explanation: string;
  actionVerbsUsed: string[];
  suggestedMetricHint?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  targetRole: string;
  isFresher: boolean;
  avatarUrl?: string;
}

// -------------------------------------------------------------
// FEATURE 1: SKILL GAP ANALYZER TYPES
// -------------------------------------------------------------
export type SkillCategoryType = 'technical' | 'soft' | 'domain';
export type SkillGapPriority = 'high' | 'medium' | 'low';

export interface DetailedSkillItem {
  name: string;
  category: SkillCategoryType;
  subcategory?: string;
  isInResume: boolean;
  isRequiredByJob: boolean;
  frequencyInJob?: number;
  priority?: SkillGapPriority;
  evidenceNotes?: string;
}

export interface SkillGapRecommendation {
  skill: string;
  category: SkillCategoryType;
  whyItMatters: string;
  currentEvidence: string; // e.g. "No RAG experience was found in the provided resume."
  recommendedSteps: string[];
  rule: string; // "Learn it first, then add it to your resume."
}

export interface RoadmapSkillItem {
  id: string;
  name: string;
  category: SkillCategoryType;
  description: string;
  status: 'not-started' | 'learning' | 'completed';
  targetMilestone: string;
}

export interface LearningRoadmapStage {
  stage: 'immediate' | 'short-term' | 'advanced';
  title: string;
  description: string;
  skills: RoadmapSkillItem[];
}

export interface SkillGapAnalysisResult {
  overallSkillMatch: number; // e.g. 78%
  categoryMatch: {
    technical: number; // e.g. 82%
    aiGenAi: number; // e.g. 64%
    tools: number; // e.g. 71%
    softSkills: number; // e.g. 88%
    domainSkills?: number;
  };
  skillsYouHave: DetailedSkillItem[];
  skillsRequired: DetailedSkillItem[];
  skillGaps: DetailedSkillItem[];
  recommendations: SkillGapRecommendation[];
  roadmap: LearningRoadmapStage[];
  timestamp: string;
}

// -------------------------------------------------------------
// FEATURE 2: AI INTERVIEW COACH TYPES
// -------------------------------------------------------------
export interface InterviewSetupOptions {
  role: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  interviewType: 'Technical' | 'HR' | 'Behavioral' | 'Project-Based' | 'Mixed';
  questionCount: 5 | 10 | 15 | 20;
  mode: 'practice' | 'mock';
}

export interface ExtendedInterviewQuestion {
  id: string;
  type: 'technical' | 'hr' | 'project' | 'behavioral' | 'role-specific';
  question: string;
  context: string;
  sampleExpectedConcepts: string[];
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Easy' | 'Medium' | 'Hard';
  relatedProjectOrSkill?: string;
  isFollowUp?: boolean;
  parentQuestionId?: string;
}

export interface AnswerEvaluationExtended {
  score: number; // 0-10
  technicalAccuracy: number; // 0-10
  relevance: number; // 0-10
  completeness: number; // 0-10
  clarity: number; // 0-10
  communication: number; // 0-10
  confidenceIndicator: 'High' | 'Moderate' | 'Developing';
  whatYouDidWell: string[];
  whatCouldBeImproved: string[];
  betterAnswerStructure: string;
  suggestedFollowUp?: ExtendedInterviewQuestion;
}

export interface InterviewFinalReport {
  overallScore: number; // 0-100
  technicalKnowledge: number; // %
  communication: number; // %
  projectKnowledge: number; // %
  problemSolving: number; // %
  roleReadiness: number; // %
  strongAreas: string[];
  weakAreas: string[];
  topicsToRevise: string[];
  recommendedQuestions: string[];
  recommendedLearning: string[];
}

export interface InterviewSessionRecord {
  id: string;
  role: string;
  date: string;
  score: number; // 0-100
  difficulty: string;
  interviewType: string;
  mode: 'practice' | 'mock';
  questionCount: number;
  finalReport?: InterviewFinalReport;
  qaPairs: {
    question: ExtendedInterviewQuestion;
    answer: string;
    evaluation: AnswerEvaluationExtended;
  }[];
}

// -------------------------------------------------------------
// FEATURE 3: RESUME EXPLAINABILITY / SCORE COMPARISON TYPES
// -------------------------------------------------------------
export interface DimensionComparison {
  dimension: string;
  previousScore: number;
  updatedScore: number;
  diff: number;
  maxScore: number;
  explanation: string;
}

export interface ScoreComparisonResult {
  previousVersionTitle: string;
  updatedVersionTitle: string;
  previousOverallScore: number;
  updatedOverallScore: number;
  scoreDifference: number; // e.g. +12 or -8
  isImprovement: boolean;
  summaryHeadline: string;
  breakdown: DimensionComparison[];
  primaryDrivers: string[];
  decreaseWarnings?: string[];
  contentDiff: {
    addedContent: string[];
    removedContent: string[];
    modifiedContent: string[];
  };
  timestamp: string;
}

export interface ResumeVersionRecord {
  id: string;
  resumeId: string;
  versionNumber: number;
  label: string;
  timestamp: string;
  overallScore: number;
  notes: string;
  snapshot: ResumeData;
}
