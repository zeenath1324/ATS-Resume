import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  ResumeData,
  JobDescription,
  ATSAnalysisResult,
  ResumeHealthReport,
  ResumeHealthItem
} from '../types/resume';
import { DEMO_FRESHER_RESUME, DEMO_JOB_DESCRIPTIONS, DEMO_ATS_ANALYSIS } from '../data/demoData';
import { apiService } from '../services/api';

interface ResumeContextType {
  activeResume: ResumeData;
  savedResumes: ResumeData[];
  savedJobs: JobDescription[];
  activeJob: JobDescription;
  currentAnalysis: ATSAnalysisResult | null;
  healthReport: ResumeHealthReport;
  isAnalyzing: boolean;
  isFresherMode: boolean;
  
  // Resume Actions
  updateResume: (updater: (prev: ResumeData) => ResumeData) => void;
  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  updateSummary: (summary: string) => void;
  setTemplate: (template: ResumeData['template']) => void;
  setFontFamily: (font: ResumeData['fontFamily']) => void;
  setFontSize: (size: ResumeData['fontSize']) => void;
  setSpacing: (spacing: ResumeData['spacing']) => void;
  setThemeColor: (color: string) => void;
  toggleFresherMode: (enabled?: boolean) => void;
  reorderSections: (newOrder: string[]) => void;
  
  // Collections
  createNewResume: (title?: string) => void;
  switchResume: (resumeId: string) => void;
  deleteResume: (resumeId: string) => void;
  duplicateResume: (resumeId: string) => void;
  loadDemoData: () => void;

  // Job Actions
  saveJobDescription: (job: Omit<JobDescription, 'id' | 'dateAdded'>) => Promise<JobDescription>;
  switchJob: (jobId: string) => void;
  deleteJob: (jobId: string) => void;

  // Analysis
  runATSAnalysis: (jobOverride?: JobDescription, resumeOverride?: ResumeData) => Promise<ATSAnalysisResult>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const RESUME_STORAGE_KEY = 'ats_pro_saved_resumes';
const ACTIVE_RESUME_ID_KEY = 'ats_pro_active_resume_id';
const JOBS_STORAGE_KEY = 'ats_pro_saved_jobs';
const ACTIVE_JOB_ID_KEY = 'ats_pro_active_job_id';
const ANALYSIS_STORAGE_KEY = 'ats_pro_current_analysis';

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Saved Resumes
  const [savedResumes, setSavedResumes] = useState<ResumeData[]>(() => {
    try {
      const stored = localStorage.getItem(RESUME_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [DEMO_FRESHER_RESUME];
  });

  // Active Resume ID
  const [activeResumeId, setActiveResumeId] = useState<string>(() => {
    return localStorage.getItem(ACTIVE_RESUME_ID_KEY) || savedResumes[0]?.id || DEMO_FRESHER_RESUME.id;
  });

  // Active Resume Object
  const activeResume = useMemo(() => {
    return savedResumes.find(r => r.id === activeResumeId) || savedResumes[0] || DEMO_FRESHER_RESUME;
  }, [savedResumes, activeResumeId]);

  // Saved Jobs
  const [savedJobs, setSavedJobs] = useState<JobDescription[]>(() => {
    try {
      const stored = localStorage.getItem(JOBS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEMO_JOB_DESCRIPTIONS;
  });

  // Active Job ID
  const [activeJobId, setActiveJobId] = useState<string>(() => {
    return localStorage.getItem(ACTIVE_JOB_ID_KEY) || savedJobs[0]?.id || DEMO_JOB_DESCRIPTIONS[0].id;
  });

  const activeJob = useMemo(() => {
    return savedJobs.find(j => j.id === activeJobId) || savedJobs[0] || DEMO_JOB_DESCRIPTIONS[0];
  }, [savedJobs, activeJobId]);

  // Current ATS Analysis
  const [currentAnalysis, setCurrentAnalysis] = useState<ATSAnalysisResult | null>(() => {
    try {
      const stored = localStorage.getItem(ANALYSIS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEMO_ATS_ANALYSIS;
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(savedResumes));
  }, [savedResumes]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_RESUME_ID_KEY, activeResumeId);
  }, [activeResumeId]);

  useEffect(() => {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(savedJobs));
  }, [savedJobs]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_JOB_ID_KEY, activeJobId);
  }, [activeJobId]);

  useEffect(() => {
    if (currentAnalysis) {
      localStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(currentAnalysis));
    }
  }, [currentAnalysis]);

  // Update resume helper
  const updateResume = (updater: (prev: ResumeData) => ResumeData) => {
    setSavedResumes(prev => {
      return prev.map(r => {
        if (r.id === activeResume.id) {
          const updated = updater(r);
          return { ...updated, lastModified: new Date().toISOString() };
        }
        return r;
      });
    });
  };

  const updatePersonalInfo = (info: Partial<ResumeData['personalInfo']>) => {
    updateResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info }
    }));
  };

  const updateSummary = (summary: string) => {
    updateResume(prev => ({ ...prev, summary }));
  };

  const setTemplate = (template: ResumeData['template']) => {
    updateResume(prev => ({ ...prev, template }));
  };

  const setFontFamily = (fontFamily: ResumeData['fontFamily']) => {
    updateResume(prev => ({ ...prev, fontFamily }));
  };

  const setFontSize = (fontSize: ResumeData['fontSize']) => {
    updateResume(prev => ({ ...prev, fontSize }));
  };

  const setSpacing = (spacing: ResumeData['spacing']) => {
    updateResume(prev => ({ ...prev, spacing }));
  };

  const setThemeColor = (themeColor: string) => {
    updateResume(prev => ({ ...prev, themeColor }));
  };

  const toggleFresherMode = (enabled?: boolean) => {
    const nextVal = enabled !== undefined ? enabled : !activeResume.isFresher;
    updateResume(prev => {
      const fresherOrder = [
        'summary',
        'skills',
        'projects',
        'internships',
        'education',
        'certifications',
        'achievements',
        'languages'
      ];
      const experiencedOrder = [
        'summary',
        'experience',
        'skills',
        'projects',
        'certifications',
        'education',
        'achievements',
        'languages'
      ];
      return {
        ...prev,
        isFresher: nextVal,
        template: nextVal ? 'fresher' : (prev.template === 'fresher' ? 'modern' : prev.template),
        sectionOrder: nextVal ? fresherOrder : experiencedOrder
      };
    });
  };

  const reorderSections = (newOrder: string[]) => {
    updateResume(prev => ({ ...prev, sectionOrder: newOrder }));
  };

  const createNewResume = (title?: string) => {
    const newId = 'resume-' + Date.now();
    const newResume: ResumeData = {
      ...DEMO_FRESHER_RESUME,
      id: newId,
      title: title || 'New Resume ' + (savedResumes.length + 1),
      summary: '',
      projects: [],
      experience: [],
      internships: [],
      certifications: [],
      achievements: [],
      lastModified: new Date().toISOString()
    };
    setSavedResumes(prev => [newResume, ...prev]);
    setActiveResumeId(newId);
  };

  const switchResume = (resumeId: string) => {
    setActiveResumeId(resumeId);
  };

  const deleteResume = (resumeId: string) => {
    if (savedResumes.length <= 1) return;
    const remaining = savedResumes.filter(r => r.id !== resumeId);
    setSavedResumes(remaining);
    if (activeResumeId === resumeId) {
      setActiveResumeId(remaining[0].id);
    }
  };

  const duplicateResume = (resumeId: string) => {
    const target = savedResumes.find(r => r.id === resumeId);
    if (!target) return;
    const copy: ResumeData = {
      ...JSON.parse(JSON.stringify(target)),
      id: 'resume-' + Date.now(),
      title: `${target.title} (Copy)`,
      lastModified: new Date().toISOString()
    };
    setSavedResumes(prev => [copy, ...prev]);
    setActiveResumeId(copy.id);
  };

  const loadDemoData = () => {
    setSavedResumes([DEMO_FRESHER_RESUME]);
    setActiveResumeId(DEMO_FRESHER_RESUME.id);
    setSavedJobs(DEMO_JOB_DESCRIPTIONS);
    setActiveJobId(DEMO_JOB_DESCRIPTIONS[0].id);
    setCurrentAnalysis(DEMO_ATS_ANALYSIS);
  };

  // Job management
  const saveJobDescription = async (jobInput: Omit<JobDescription, 'id' | 'dateAdded'>): Promise<JobDescription> => {
    const newId = 'job-' + Date.now();
    let extracted = jobInput.extracted;
    if (!extracted && jobInput.rawText) {
      try {
        extracted = await apiService.extractJob(jobInput.rawText, jobInput.title);
      } catch (e) {
        console.warn('Extraction fallback:', e);
      }
    }
    const newJob: JobDescription = {
      ...jobInput,
      id: newId,
      dateAdded: new Date().toISOString().split('T')[0],
      extracted
    };
    setSavedJobs(prev => [newJob, ...prev]);
    setActiveJobId(newId);
    return newJob;
  };

  const switchJob = (jobId: string) => {
    setActiveJobId(jobId);
  };

  const deleteJob = (jobId: string) => {
    if (savedJobs.length <= 1) return;
    const remaining = savedJobs.filter(j => j.id !== jobId);
    setSavedJobs(remaining);
    if (activeJobId === jobId) {
      setActiveJobId(remaining[0].id);
    }
  };

  // ATS Analysis runner
  const runATSAnalysis = async (jobOverride?: JobDescription, resumeOverride?: ResumeData): Promise<ATSAnalysisResult> => {
    const targetJob = jobOverride || activeJob;
    const targetResume = resumeOverride || activeResume;
    setIsAnalyzing(true);
    try {
      const result = await apiService.analyzeATS(targetResume, targetJob);
      setCurrentAnalysis(result);
      return result;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Compute Resume Health dynamically
  const healthReport = useMemo<ResumeHealthReport>(() => {
    const items: ResumeHealthItem[] = [];
    let score = 100;

    // Contact checks
    const p = activeResume.personalInfo;
    if (!p.fullName.trim() || !p.email.trim() || !p.phone.trim()) {
      score -= 20;
      items.push({
        id: 'h-contact-missing',
        category: 'contact',
        severity: 'critical',
        issue: 'Essential contact information is missing (Name, Email, or Phone).',
        recommendation: 'Ensure your full name, email address, and phone number are populated.',
        sectionLink: 'personalInfo'
      });
    }

    if (!p.linkedin.trim()) {
      score -= 8;
      items.push({
        id: 'h-linkedin-missing',
        category: 'contact',
        severity: 'warning',
        issue: 'No LinkedIn profile URL provided.',
        recommendation: 'Over 85% of tech recruiters verify candidates on LinkedIn before an interview.',
        sectionLink: 'personalInfo'
      });
    }

    if (!p.github.trim() && (activeResume.targetRole.toLowerCase().includes('engineer') || activeResume.targetRole.toLowerCase().includes('dev'))) {
      score -= 8;
      items.push({
        id: 'h-github-missing',
        category: 'contact',
        severity: 'warning',
        issue: 'GitHub portfolio link recommended for technical roles.',
        recommendation: 'Add your active GitHub profile so hiring managers can inspect real code repositories.',
        sectionLink: 'personalInfo'
      });
    }

    // Summary checks
    if (!activeResume.summary || activeResume.summary.length < 50) {
      score -= 10;
      items.push({
        id: 'h-summary-weak',
        category: 'content',
        severity: 'warning',
        issue: 'Professional summary is too brief or empty.',
        recommendation: 'Use the AI summary generator to craft a 3-4 sentence value proposition based on your skills.',
        sectionLink: 'summary'
      });
    }

    // Projects checks
    if (activeResume.projects.length === 0) {
      score -= 20;
      items.push({
        id: 'h-projects-empty',
        category: 'impact',
        severity: 'critical',
        issue: 'No technical or academic projects listed.',
        recommendation: 'Add at least 2 relevant projects demonstrating hands-on technical competence.',
        sectionLink: 'projects'
      });
    } else {
      // Check for metric in projects
      const hasNumbers = activeResume.projects.some(p => /\d+%|\d+ms|\d+x|\$\d+|\d+ users/i.test(p.description + p.outcome));
      if (!hasNumbers) {
        score -= 6;
        items.push({
          id: 'h-projects-metrics',
          category: 'impact',
          severity: 'warning',
          issue: 'Project descriptions lack measurable metrics.',
          recommendation: 'Incorporate quantitative metrics (e.g. latency, user volume, speedup % or records handled).',
          sectionLink: 'projects'
        });
      }
    }

    // Skills checks
    const totalSkills = activeResume.skills.flatMap(s => s.skills).length;
    if (totalSkills < 5) {
      score -= 12;
      items.push({
        id: 'h-skills-low',
        category: 'content',
        severity: 'warning',
        issue: 'Fewer than 5 skills specified.',
        recommendation: 'Group your competencies into Programming Languages, Tools, and Frameworks for ATS parsers.',
        sectionLink: 'skills'
      });
    }

    // Repeated buzzwords check
    const allText = (activeResume.summary + ' ' + activeResume.projects.map(p => p.description).join(' ')).toLowerCase();
    if ((allText.match(/\bresponsible for\b/g) || []).length > 2) {
      score -= 5;
      items.push({
        id: 'h-buzzwords-passive',
        category: 'formatting',
        severity: 'info',
        issue: 'Repeated passive phrase "responsible for".',
        recommendation: 'Replace with high-impact action verbs like "Spearheaded", "Architected", or "Orchestrated".',
        sectionLink: 'projects'
      });
    }

    return {
      overallHealthScore: Math.max(30, Math.min(100, score)),
      items
    };
  }, [activeResume]);

  return (
    <ResumeContext.Provider
      value={{
        activeResume,
        savedResumes,
        savedJobs,
        activeJob,
        currentAnalysis,
        healthReport,
        isAnalyzing,
        isFresherMode: activeResume.isFresher,
        
        updateResume,
        updatePersonalInfo,
        updateSummary,
        setTemplate,
        setFontFamily,
        setFontSize,
        setSpacing,
        setThemeColor,
        toggleFresherMode,
        reorderSections,

        createNewResume,
        switchResume,
        deleteResume,
        duplicateResume,
        loadDemoData,

        saveJobDescription,
        switchJob,
        deleteJob,

        runATSAnalysis
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
