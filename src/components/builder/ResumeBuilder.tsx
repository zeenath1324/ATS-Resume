import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Wrench,
  Briefcase,
  FolderGit2,
  Award,
  Sparkles,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  CheckCircle2,
  Layers,
  ArrowRight,
  ArrowLeft,
  Globe,
  Tag,
  Save,
  Link,
  Code,
  BookOpen,
  Check,
  RefreshCw,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { NavTab } from '../common/Navbar';
import { apiService } from '../../services/api';
import { DiffReviewModal } from '../modals/DiffReviewModal';

interface ResumeBuilderProps {
  onNavigate: (tab: NavTab) => void;
}

type BuilderStep =
  | 'personal'
  | 'summary'
  | 'skills'
  | 'projects'
  | 'education'
  | 'internships'
  | 'experience'
  | 'certifications'
  | 'achievements'
  | 'languages'
  | 'reorder';

const STEP_ORDER: BuilderStep[] = [
  'personal',
  'summary',
  'skills',
  'projects',
  'education',
  'internships',
  'experience',
  'certifications',
  'achievements',
  'languages',
  'reorder',
];

const STANDARD_SKILL_CATEGORIES = [
  { category: 'Programming Languages', defaultSkills: ['Python', 'SQL', 'TypeScript', 'JavaScript', 'C++', 'Java'] },
  { category: 'Technical Skills', defaultSkills: ['REST APIs', 'System Architecture', 'Data Structures & Algorithms', 'Unit Testing'] },
  { category: 'AI/ML', defaultSkills: ['Machine Learning', 'Deep Learning', 'PyTorch', 'Scikit-Learn', 'Model Evaluation'] },
  { category: 'GenAI', defaultSkills: ['Generative AI', 'LangChain', 'Prompt Engineering', 'RAG Pipelines', 'Vector Databases (ChromaDB)'] },
  { category: 'Databases', defaultSkills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'] },
  { category: 'Cloud', defaultSkills: ['AWS', 'Docker', 'Google Cloud', 'CI/CD Pipelines'] },
  { category: 'Tools', defaultSkills: ['Git', 'GitHub', 'Postman', 'VS Code', 'Linux'] },
  { category: 'Soft Skills', defaultSkills: ['Agile Collaboration', 'Technical Problem Solving', 'Cross-Functional Communication', 'Time Management'] },
];

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ onNavigate }) => {
  const {
    activeResume,
    updatePersonalInfo,
    updateSummary,
    updateResume,
    isFresherMode,
    toggleFresherMode,
    healthReport,
    reorderSections,
  } = useResume();

  const [currentStep, setCurrentStep] = useState<BuilderStep>('personal');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isImprovingText, setIsImprovingText] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [quickSkillInput, setQuickSkillInput] = useState('');

  // Diff Review Modal State
  const [diffModalOpen, setDiffModalOpen] = useState(false);
  const [diffOriginal, setDiffOriginal] = useState('');
  const [diffImproved, setDiffImproved] = useState('');
  const [diffExplanation, setDiffExplanation] = useState('');
  const [diffActionVerbs, setDiffActionVerbs] = useState<string[]>([]);
  const [diffMetricHint, setDiffMetricHint] = useState<string | undefined>(undefined);
  const [diffQuestionPrompt, setDiffQuestionPrompt] = useState<string | undefined>(undefined);
  const [diffApplyHandler, setDiffApplyHandler] = useState<(text: string) => void>(() => () => {});
  const [diffTitle, setDiffTitle] = useState('Review AI Improvement');

  // Full Resume AI Audit State
  const [fullAuditModalOpen, setFullAuditModalOpen] = useState(false);
  const [isAuditingResume, setIsAuditingResume] = useState(false);
  const [auditImprovements, setAuditImprovements] = useState<import('../../types/resume').ResumeImprovementItem[]>([]);
  const [appliedAuditIds, setAppliedAuditIds] = useState<Set<string>>(new Set());

  // Steps configuration
  const steps: { id: BuilderStep; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'summary', label: 'Summary', icon: Sparkles },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'projects', label: 'Projects', icon: FolderGit2, badge: isFresherMode ? 'Priority' : undefined },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'internships', label: 'Internships', icon: Award, badge: isFresherMode ? 'Priority' : undefined },
    { id: 'experience', label: 'Experience', icon: Briefcase, badge: isFresherMode ? 'Optional' : undefined },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'languages', label: 'Languages & More', icon: Globe },
    { id: 'reorder', label: 'Section Order', icon: Layers },
  ];

  const currentStepIdx = STEP_ORDER.indexOf(currentStep);

  const goToNextStep = () => {
    if (currentStepIdx < STEP_ORDER.length - 1) {
      setCurrentStep(STEP_ORDER[currentStepIdx + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStep(STEP_ORDER[currentStepIdx - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isStepComplete = (step: BuilderStep): boolean => {
    switch (step) {
      case 'personal':
        return Boolean(activeResume.personalInfo.fullName && activeResume.personalInfo.email && activeResume.personalInfo.phone);
      case 'summary':
        return Boolean(activeResume.summary && activeResume.summary.trim().length > 30);
      case 'skills':
        return activeResume.skills.flatMap(s => s.skills).length >= 5;
      case 'projects':
        return activeResume.projects.length >= 1;
      case 'education':
        return activeResume.education.length >= 1;
      case 'internships':
        return activeResume.internships.length >= 1;
      case 'experience':
        return activeResume.experience.length >= 1;
      case 'certifications':
        return activeResume.certifications.length >= 1;
      case 'achievements':
        return activeResume.achievements.length >= 1;
      case 'languages':
        return activeResume.languages.length >= 1 || activeResume.interests.length >= 1;
      case 'reorder':
        return true;
      default:
        return false;
    }
  };

  // Helper to open diff review
  const openDiffReview = (
    original: string,
    improved: string,
    explanation: string,
    verbs: string[] | undefined,
    title: string,
    onApply: (text: string) => void,
    metricHint?: string,
    questionPrompt?: string
  ) => {
    setDiffOriginal(original);
    setDiffImproved(improved);
    setDiffExplanation(explanation);
    setDiffActionVerbs(verbs || []);
    setDiffMetricHint(metricHint);
    setDiffQuestionPrompt(questionPrompt);
    setDiffTitle(title);
    setDiffApplyHandler(() => onApply);
    setDiffModalOpen(true);
  };

  // AI Summary Generator
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const res = await apiService.generateSummary(activeResume);
      openDiffReview(
        activeResume.summary || '',
        res.summary,
        'Crafted a high-keyword ATS professional summary based strictly on your provided skills, education, and projects.',
        res.highlightedKeywords,
        'Review AI Professional Summary',
        (text) => updateSummary(text),
        'Consider specifying your degree GPA or honors if distinguished.'
      );
    } catch (e) {
      alert('Unable to generate summary at this moment.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // AI Text Improvement
  const handleImproveText = async (
    text: string,
    sectionType: string,
    onApply: (improved: string) => void
  ) => {
    if (!text || text.trim().length < 4) {
      alert('Please enter at least a few words in this field before requesting AI Improvement.');
      return;
    }
    setIsImprovingText(true);
    try {
      const res = await apiService.improveText(text, sectionType, activeResume.targetRole);
      openDiffReview(
        text,
        res.improvedText,
        res.explanation,
        res.actionVerbsUsed,
        `Improve ${sectionType}`,
        onApply,
        res.suggestedMetricHint,
        res.questionPrompt
      );
    } catch (e) {
      alert('Could not improve text at this moment.');
    } finally {
      setIsImprovingText(false);
    }
  };

  // Full Resume Comprehensive Audit
  const handleRunFullAudit = async () => {
    setIsAuditingResume(true);
    setFullAuditModalOpen(true);
    try {
      const res = await apiService.improveFullResume(activeResume);
      setAuditImprovements(res.improvements || []);
    } catch (e) {
      console.error(e);
      alert('Could not run full audit at this moment.');
    } finally {
      setIsAuditingResume(false);
    }
  };

  const handleApplyAuditItem = (item: import('../../types/resume').ResumeImprovementItem) => {
    if (item.sectionType === 'summary') {
      updateSummary(item.improvedText);
    } else if (item.sectionType === 'project') {
      updateResume(prev => {
        if (prev.projects.length === 0) return prev;
        const copy = [...prev.projects];
        copy[0] = { ...copy[0], description: item.improvedText };
        return { ...prev, projects: copy };
      });
    } else if (item.sectionType === 'internship') {
      updateResume(prev => {
        if (prev.internships.length === 0) return prev;
        const copy = [...prev.internships];
        copy[0] = { ...copy[0], responsibilities: item.improvedText.split('\n').filter(Boolean) };
        return { ...prev, internships: copy };
      });
    } else if (item.sectionType === 'experience') {
      updateResume(prev => {
        if (prev.experience.length === 0) return prev;
        const copy = [...prev.experience];
        copy[0] = { ...copy[0], responsibilities: item.improvedText.split('\n').filter(Boolean) };
        return { ...prev, experience: copy };
      });
    } else if (item.sectionType === 'achievement') {
      updateResume(prev => {
        if (prev.achievements.length === 0) return prev;
        const copy = [...prev.achievements];
        copy[0] = { ...copy[0], description: item.improvedText };
        return { ...prev, achievements: copy };
      });
    }
    setAppliedAuditIds(prev => new Set([...prev, item.id]));
  };

  const handleApplyAllAuditItems = () => {
    auditImprovements.forEach(item => {
      handleApplyAuditItem(item);
    });
  };

  const handleManualSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Preload all 8 standard categories into skills
  const handleInitStandardSkillCategories = () => {
    updateResume(prev => {
      const existingNames = new Set(prev.skills.map(s => s.category.toLowerCase()));
      const newCategories = [...prev.skills];
      STANDARD_SKILL_CATEGORIES.forEach(std => {
        if (!existingNames.has(std.category.toLowerCase())) {
          newCategories.push({
            category: std.category,
            skills: [...std.defaultSkills]
          });
        }
      });
      return { ...prev, skills: newCategories };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Diff Review Modal */}
      <DiffReviewModal
        isOpen={diffModalOpen}
        onClose={() => setDiffModalOpen(false)}
        originalText={diffOriginal}
        improvedText={diffImproved}
        explanation={diffExplanation}
        actionVerbsUsed={diffActionVerbs}
        suggestedMetricHint={diffMetricHint}
        questionPrompt={diffQuestionPrompt}
        title={diffTitle}
        onApply={(text) => {
          diffApplyHandler(text);
          setDiffModalOpen(false);
        }}
      />

      {/* Full Resume AI Audit & Optimizer Modal */}
      {fullAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">AI Resume Optimizer & Audit Center</h3>
                  <p className="text-xs text-blue-100">
                    Comprehensive multi-section review • Active engineering verbs • Zero invented facts
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFullAuditModalOpen(false)}
                className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Factual Integrity Banner */}
            <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Truth Standard:</strong> The optimizer polishes phrasing and highlights action verbs while preserving 100% of candidate facts. No false companies, jobs, or metrics are ever fabricated.
              </span>
            </div>

            {/* Audit Content List */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {isAuditingResume ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-bold text-slate-800">
                    Auditing all resume sections with Gemini AI...
                  </p>
                  <p className="text-xs text-slate-500">
                    Checking action verb density, structural conciseness, and ATS parsability.
                  </p>
                </div>
              ) : auditImprovements.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">All Sections Look Crisp & Professional!</p>
                  <p className="text-xs text-slate-500">
                    No weak passive openers or immediate grammar concerns detected.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {auditImprovements.map((item) => {
                    const isApplied = appliedAuditIds.has(item.id);
                    return (
                      <div
                        key={item.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                            {item.sectionTitle || item.sectionType}
                          </span>
                          {isApplied && (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              Applied to Resume
                            </span>
                          )}
                        </div>

                        {/* Side by side diff */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-white border border-slate-200 rounded-xl">
                            <span className="text-[11px] font-bold text-slate-500 block mb-1">
                              Current Candidate Text:
                            </span>
                            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-mono text-[11px]">
                              {item.originalText || <span className="italic text-slate-400">Empty</span>}
                            </p>
                          </div>
                          <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl">
                            <span className="text-[11px] font-bold text-indigo-900 block mb-1 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-indigo-600" />
                              ATS-Optimized Suggestion:
                            </span>
                            <p className="text-indigo-950 font-medium whitespace-pre-wrap leading-relaxed">
                              {item.improvedText}
                            </p>
                          </div>
                        </div>

                        {/* Action verbs and rationale */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                          <div className="space-y-1">
                            <p className="text-[11px] text-slate-600">
                              <strong className="text-slate-800">Improvement Rationale:</strong> {item.explanation}
                            </p>
                            {item.actionVerbsUsed && item.actionVerbsUsed.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] text-slate-500 font-semibold">Action Verbs:</span>
                                {item.actionVerbsUsed.map((v, i) => (
                                  <span key={i} className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                    +{v}
                                  </span>
                                ))}
                              </div>
                            )}
                            {item.suggestedMetricHint && (
                              <p className="text-[11px] text-purple-700">
                                💡 <em>{item.suggestedMetricHint}</em>
                              </p>
                            )}
                          </div>

                          {!isApplied && (
                            <button
                              type="button"
                              onClick={() => handleApplyAuditItem(item)}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs shrink-0 flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Apply This Improvement
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setFullAuditModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl"
              >
                Close Optimizer
              </button>
              {auditImprovements.length > 0 && (
                <button
                  type="button"
                  onClick={handleApplyAllAuditItems}
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Apply All Verified Improvements
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header bar with controls */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Resume Builder
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
              ATS Pro
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Title:</span>
            <input
              type="text"
              value={activeResume.title}
              onChange={(e) => updateResume(prev => ({ ...prev, title: e.target.value }))}
              className="font-bold text-slate-800 bg-transparent border-b border-dashed border-slate-300 hover:border-blue-500 focus:outline-hidden px-1 py-0.5"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* AI Resume Optimizer Full Audit */}
          <button
            onClick={handleRunFullAudit}
            disabled={isAuditingResume}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
          >
            {isAuditingResume ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span>AI Resume Optimizer</span>
          </button>

          {/* Fresher Mode Switch */}
          <button
            onClick={() => toggleFresherMode()}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              isFresherMode
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Fresher Mode: {isFresherMode ? 'Enabled' : 'Disabled'}</span>
          </button>

          {/* Health indicator */}
          <button
            onClick={() => onNavigate('health')}
            className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Health: {healthReport.overallHealthScore}/100</span>
          </button>

          {/* Live Preview & Export */}
          <button
            onClick={() => onNavigate('preview')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live A4 Preview</span>
          </button>
        </div>
      </div>

      {/* Main Builder Layout: Left Stepper Navigation + Right Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Step Navigator */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-3 border border-slate-200/90 shadow-xs space-y-1 sticky top-20">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Resume Sections</span>
              <span className="text-[10px] text-blue-600 font-bold">
                {steps.filter(s => isStepComplete(s.id)).length}/{steps.length}
              </span>
            </div>
            {steps.map((st) => {
              const Icon = st.icon;
              const isActive = currentStep === st.id;
              const completed = isStepComplete(st.id);
              return (
                <button
                  key={st.id}
                  onClick={() => setCurrentStep(st.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{st.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {st.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                          isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {st.badge}
                      </span>
                    )}
                    {completed && (
                      <Check className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Form Editor Panel */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            {/* STEP 1: Personal Information */}
            {currentStep === 'personal' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                  <p className="text-xs text-slate-500">
                    ATS scanners require plain, machine-readable contact info. Avoid placing emails or phones inside headers or graphics.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={activeResume.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Target Role / Headline
                    </label>
                    <input
                      type="text"
                      value={activeResume.personalInfo.headline || ''}
                      onChange={(e) => updatePersonalInfo({ headline: e.target.value })}
                      placeholder="e.g. Aspiring AI & Full Stack Engineer"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={activeResume.personalInfo.email}
                      onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                      placeholder="e.g. aarav.dev@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={activeResume.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                      placeholder="+1 (555) 234-5678"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Location (City, State / Country)
                    </label>
                    <input
                      type="text"
                      value={activeResume.personalInfo.location}
                      onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                      placeholder="San Jose, CA"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      LinkedIn Profile
                    </label>
                    <input
                      type="text"
                      value={activeResume.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                      placeholder="linkedin.com/in/aarav-sharma"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      GitHub Profile
                    </label>
                    <input
                      type="text"
                      value={activeResume.personalInfo.github}
                      onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                      placeholder="github.com/aaravsharma-dev"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Portfolio / Website
                    </label>
                    <input
                      type="text"
                      value={activeResume.personalInfo.portfolio}
                      onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
                      placeholder="aaravsharma.dev"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Career Objective / Summary */}
            {currentStep === 'summary' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Career Objective & Summary</h3>
                    <p className="text-xs text-slate-500">
                      3-4 concise sentences highlighting your skills, education, and target contribution.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateSummary}
                    disabled={isGeneratingSummary}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 self-start"
                  >
                    {isGeneratingSummary ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    )}
                    <span>Generate Summary with AI</span>
                  </button>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero-Hallucination AI Guarantee:</strong> Summary generation evaluates only your provided skills, education, projects, and target role. No ungrounded claims are added.
                  </span>
                </div>

                <div>
                  <textarea
                    rows={6}
                    value={activeResume.summary}
                    onChange={(e) => updateSummary(e.target.value)}
                    placeholder="e.g. Motivated Computer Science graduate with hands-on expertise in Python, Generative AI workflows, SQL, and modern React web development. Proven track record of developing functional AI prototypes..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                  />
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                    <span>Target length: 50–90 words</span>
                    <span>{activeResume.summary.trim().split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Skills */}
            {currentStep === 'skills' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Technical & Professional Skills</h3>
                    <p className="text-xs text-slate-500">
                      Organized across 8 standard ATS categories: Programming Languages, Technical Skills, AI/ML, GenAI, Databases, Cloud, Tools, Soft Skills.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleInitStandardSkillCategories}
                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 transition-colors flex items-center gap-1 self-start"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Load 8 Standard Categories
                  </button>
                </div>

                <div className="space-y-4">
                  {activeResume.skills.map((category, catIdx) => (
                    <div key={catIdx} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={category.category}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateResume((prev) => {
                              const copy = [...prev.skills];
                              copy[catIdx] = { ...copy[catIdx], category: val };
                              return { ...prev, skills: copy };
                            });
                          }}
                          className="font-bold text-xs uppercase tracking-wider text-slate-800 bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:outline-hidden"
                        />
                        <button
                          onClick={() => {
                            updateResume((prev) => ({
                              ...prev,
                              skills: prev.skills.filter((_, idx) => idx !== catIdx),
                            }));
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Skill tags */}
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => {
                                updateResume((prev) => {
                                  const copy = [...prev.skills];
                                  copy[catIdx].skills = copy[catIdx].skills.filter((_, i) => i !== sIdx);
                                  return { ...prev, skills: copy };
                                });
                              }}
                              className="text-slate-400 hover:text-red-500 text-sm font-bold"
                            >
                              &times;
                            </button>
                          </span>
                        ))}

                        {/* Add skill input inline */}
                        <input
                          type="text"
                          placeholder="+ Add skill (Press Enter)"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = e.currentTarget.value.trim();
                              if (val) {
                                updateResume((prev) => {
                                  const copy = [...prev.skills];
                                  if (!copy[catIdx].skills.includes(val)) {
                                    copy[catIdx].skills.push(val);
                                  }
                                  return { ...prev, skills: copy };
                                });
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                          className="px-3 py-1 bg-white border border-dashed border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      updateResume((prev) => ({
                        ...prev,
                        skills: [...prev.skills, { category: 'Tools & Technologies', skills: [] }],
                      }));
                    }}
                    className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-600 transition-colors"
                  >
                    + Add Custom Skill Category
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Projects */}
            {currentStep === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Projects</h3>
                    <p className="text-xs text-slate-500">
                      {isFresherMode ? '⭐ Core focus for Freshers: showcase technical architecture, tools, contributions, and outcomes.' : 'Key technical projects.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      updateResume((prev) => ({
                        ...prev,
                        projects: [
                          ...prev.projects,
                          {
                            id: 'proj-' + Date.now(),
                            name: 'New Technical Project',
                            technologies: ['Python', 'React'],
                            description: 'Developed a full-stack web application implementing modular components and RESTful endpoints.',
                            contribution: 'Architected the frontend and backend integration.',
                            outcome: 'Successfully deployed and verified with test queries.',
                          },
                        ],
                      }));
                    }}
                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Project
                  </button>
                </div>

                <div className="space-y-6">
                  {activeResume.projects.map((proj, pIdx) => (
                    <div key={proj.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 uppercase">Project #{pIdx + 1}</span>
                        <button
                          onClick={() => {
                            updateResume((prev) => ({
                              ...prev,
                              projects: prev.projects.filter((p) => p.id !== proj.id),
                            }));
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Name *</label>
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResume((prev) => ({
                                ...prev,
                                projects: prev.projects.map((p) => (p.id === proj.id ? { ...p, name: val } : p)),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Technologies (Comma-separated) *
                          </label>
                          <input
                            type="text"
                            value={proj.technologies.join(', ')}
                            onChange={(e) => {
                              const val = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                              updateResume((prev) => ({
                                ...prev,
                                projects: prev.projects.map((p) => (p.id === proj.id ? { ...p, technologies: val } : p)),
                              }));
                            }}
                            placeholder="Python, LangChain, React, FastAPI"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      {/* Description with dedicated AI button */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Project Description & Bullets *
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              handleImproveText(proj.description, 'Project Description', (improved) => {
                                updateResume((prev) => ({
                                  ...prev,
                                  projects: prev.projects.map((p) => (p.id === proj.id ? { ...p, description: improved } : p)),
                                }));
                              })
                            }
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            Improve Project Description with AI
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={proj.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateResume((prev) => ({
                              ...prev,
                              projects: prev.projects.map((p) => (p.id === proj.id ? { ...p, description: val } : p)),
                            }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Your Contribution</label>
                          <input
                            type="text"
                            value={proj.contribution}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResume((prev) => ({
                                ...prev,
                                projects: prev.projects.map((p) => (p.id === proj.id ? { ...p, contribution: val } : p)),
                              }));
                            }}
                            placeholder="Designed the vector indexing pipeline..."
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Outcome / Metric</label>
                          <input
                            type="text"
                            value={proj.outcome}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResume((prev) => ({
                                ...prev,
                                projects: prev.projects.map((p) => (p.id === proj.id ? { ...p, outcome: val } : p)),
                              }));
                            }}
                            placeholder="Achieved sub-second query retrieval..."
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Live URL (Optional)</label>
                          <input
                            type="text"
                            value={proj.liveLink || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResume((prev) => ({
                                ...prev,
                                projects: prev.projects.map((p) => (p.id === proj.id ? { ...p, liveLink: val } : p)),
                              }));
                            }}
                            placeholder="https://myproject.vercel.app"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">GitHub URL (Optional)</label>
                          <input
                            type="text"
                            value={proj.githubLink || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResume((prev) => ({
                                ...prev,
                                projects: prev.projects.map((p) => (p.id === proj.id ? { ...p, githubLink: val } : p)),
                              }));
                            }}
                            placeholder="https://github.com/user/project"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: Education */}
            {currentStep === 'education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Education</h3>
                    <p className="text-xs text-slate-500">Degree, college, university, graduation year, and CGPA / percentage.</p>
                  </div>
                  <button
                    onClick={() => {
                      updateResume((prev) => ({
                        ...prev,
                        education: [
                          ...prev.education,
                          {
                            id: 'edu-' + Date.now(),
                            degree: 'Bachelor of Science in Computer Science',
                            college: 'College Name',
                            university: 'University System',
                            graduationYear: '2025',
                            cgpaOrPercentage: '3.85 / 4.00',
                            relevantCoursework: ['Data Structures & Algorithms', 'Database Systems (SQL)']
                          },
                        ],
                      }));
                    }}
                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Education
                  </button>
                </div>

                <div className="space-y-4">
                  {activeResume.education.map((edu, idx) => (
                    <div key={edu.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600 uppercase">Degree Entry #{idx + 1}</span>
                        {activeResume.education.length > 1 && (
                          <button
                            onClick={() => {
                              updateResume((prev) => ({
                                ...prev,
                                education: prev.education.filter((e) => e.id !== edu.id),
                              }));
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Degree / Course *</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResume((prev) => ({
                                ...prev,
                                education: prev.education.map((it) => (it.id === edu.id ? { ...it, degree: val } : it)),
                              }));
                            }}
                            placeholder="B.S. in Computer Science"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">College *</label>
                          <input
                            type="text"
                            value={edu.college}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResume((prev) => ({
                                ...prev,
                                education: prev.education.map((it) => (it.id === edu.id ? { ...it, college: val } : it)),
                              }));
                            }}
                            placeholder="College of Engineering"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">University</label>
                          <input
                            type="text"
                            value={edu.university || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResume((prev) => ({
                                ...prev,
                                education: prev.education.map((it) => (it.id === edu.id ? { ...it, university: val } : it)),
                              }));
                            }}
                            placeholder="California State University"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Graduation Year *</label>
                          <input
                            type="text"
                            value={edu.graduationYear}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResume((prev) => ({
                                ...prev,
                                education: prev.education.map((it) => (it.id === edu.id ? { ...it, graduationYear: val } : it)),
                              }));
                            }}
                            placeholder="2025"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">CGPA / Percentage</label>
                          <input
                            type="text"
                            value={edu.cgpaOrPercentage}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResume((prev) => ({
                                ...prev,
                                education: prev.education.map((it) => (it.id === edu.id ? { ...it, cgpaOrPercentage: val } : it)),
                              }));
                            }}
                            placeholder="3.85 / 4.00 or 88%"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Relevant Coursework</label>
                          <input
                            type="text"
                            value={(edu.relevantCoursework || []).join(', ')}
                            onChange={(e) => {
                              const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                              updateResume((prev) => ({
                                ...prev,
                                education: prev.education.map((it) => (it.id === edu.id ? { ...it, relevantCoursework: val } : it)),
                              }));
                            }}
                            placeholder="Data Structures, SQL, Machine Learning"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 6: Internships */}
            {currentStep === 'internships' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Internships</h3>
                    <p className="text-xs text-slate-500">
                      Industry or research internships bridge practical experience for freshers and students.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      updateResume((prev) => ({
                        ...prev,
                        internships: [
                          ...prev.internships,
                          {
                            id: 'intern-' + Date.now(),
                            company: 'Tech Solutions Inc',
                            role: 'Software Engineering Intern',
                            duration: 'Summer 2024',
                            responsibilities: ['Developed REST endpoints and conducted code reviews in Agile sprints.'],
                          },
                        ],
                      }));
                    }}
                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Internship
                  </button>
                </div>

                <div className="space-y-4">
                  {activeResume.internships.map((intern, iIdx) => (
                    <div key={intern.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 uppercase">Internship #{iIdx + 1}</span>
                        <button
                          onClick={() => {
                            updateResume((prev) => ({
                              ...prev,
                              internships: prev.internships.filter((it) => it.id !== intern.id),
                            }));
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Company / Organization *</label>
                          <input
                            type="text"
                            value={intern.company}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResume((prev) => ({
                                ...prev,
                                internships: prev.internships.map((it) => (it.id === intern.id ? { ...it, company: val } : it)),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Role / Title *</label>
                          <input
                            type="text"
                            value={intern.role}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResume((prev) => ({
                                ...prev,
                                internships: prev.internships.map((it) => (it.id === intern.id ? { ...it, role: val } : it)),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Duration *</label>
                          <input
                            type="text"
                            value={intern.duration}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResume((prev) => ({
                                ...prev,
                                internships: prev.internships.map((it) => (it.id === intern.id ? { ...it, duration: val } : it)),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Responsibilities & Bullets (One per line)
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              handleImproveText(intern.responsibilities.join('\n'), 'Internship Bullets', (improved) => {
                                const bullets = improved.split('\n').filter(Boolean);
                                updateResume((prev) => ({
                                  ...prev,
                                  internships: prev.internships.map((it) => (it.id === intern.id ? { ...it, responsibilities: bullets } : it)),
                                }));
                              })
                            }
                            className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            Improve with Action Verbs
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={intern.responsibilities.join('\n')}
                          onChange={(e) => {
                            const val = e.target.value.split('\n');
                            updateResume((prev) => ({
                              ...prev,
                              internships: prev.internships.map((it) => (it.id === intern.id ? { ...it, responsibilities: val } : it)),
                            }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 7: Work Experience */}
            {currentStep === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Work Experience</h3>
                    <p className="text-xs text-slate-500">
                      {isFresherMode ? '(Optional in Fresher Mode; use Internships and Projects instead)' : 'Full-time employment history with responsibilities and achievements.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      updateResume((prev) => ({
                        ...prev,
                        experience: [
                          ...prev.experience,
                          {
                            id: 'exp-' + Date.now(),
                            company: 'Apex Solutions',
                            role: 'Software Engineer',
                            duration: '2023 - Present',
                            responsibilities: ['Architected microservices using Node.js and TypeScript.'],
                            achievements: ['Decreased query latency by 35%.'],
                          },
                        ],
                      }));
                    }}
                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Work Experience
                  </button>
                </div>

                {activeResume.experience.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl space-y-2">
                    <p className="text-xs text-slate-500 font-medium">
                      No corporate experience entries yet.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      In Fresher Mode, academic projects, hackathons, and internships carry heavy ATS weight!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeResume.experience.map((exp, eIdx) => (
                      <div key={exp.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 uppercase">Role #{eIdx + 1}</span>
                          <button
                            onClick={() => {
                              updateResume((prev) => ({
                                ...prev,
                                experience: prev.experience.filter((e) => e.id !== exp.id),
                              }));
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Company *</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateResume((prev) => ({
                                  ...prev,
                                  experience: prev.experience.map((it) => (it.id === exp.id ? { ...it, company: val } : it)),
                                }));
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Role / Title *</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateResume((prev) => ({
                                  ...prev,
                                  experience: prev.experience.map((it) => (it.id === exp.id ? { ...it, role: val } : it)),
                                }));
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Duration *</label>
                            <input
                              type="text"
                              value={exp.duration}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateResume((prev) => ({
                                  ...prev,
                                  experience: prev.experience.map((it) => (it.id === exp.id ? { ...it, duration: val } : it)),
                                }));
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-semibold text-slate-600">Responsibilities</label>
                            <button
                              type="button"
                              onClick={() =>
                                handleImproveText(exp.responsibilities.join('\n'), 'Experience Responsibilities', (improved) => {
                                  const bullets = improved.split('\n').filter(Boolean);
                                  updateResume((prev) => ({
                                    ...prev,
                                    experience: prev.experience.map((it) => (it.id === exp.id ? { ...it, responsibilities: bullets } : it)),
                                  }));
                                })
                              }
                              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              Improve Responsibilities
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            value={exp.responsibilities.join('\n')}
                            onChange={(e) => {
                              const val = e.target.value.split('\n');
                              updateResume((prev) => ({
                                ...prev,
                                experience: prev.experience.map((it) => (it.id === exp.id ? { ...it, responsibilities: val } : it)),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-semibold text-slate-600">Achievements</label>
                            <button
                              type="button"
                              onClick={() =>
                                handleImproveText(exp.achievements.join('\n'), 'Experience Achievements', (improved) => {
                                  const bullets = improved.split('\n').filter(Boolean);
                                  updateResume((prev) => ({
                                    ...prev,
                                    experience: prev.experience.map((it) => (it.id === exp.id ? { ...it, achievements: bullets } : it)),
                                  }));
                                })
                              }
                              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              Improve Achievements
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={exp.achievements.join('\n')}
                            onChange={(e) => {
                              const val = e.target.value.split('\n');
                              updateResume((prev) => ({
                                ...prev,
                                experience: prev.experience.map((it) => (it.id === exp.id ? { ...it, achievements: val } : it)),
                              }));
                            }}
                            placeholder="e.g. Decreased query latency by 35% through Redis caching..."
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 8: Certifications */}
            {currentStep === 'certifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Certifications</h3>
                    <p className="text-xs text-slate-500">Industry credentials (AWS, DeepLearning.AI, Coursera, etc.).</p>
                  </div>
                  <button
                    onClick={() => {
                      updateResume((prev) => ({
                        ...prev,
                        certifications: [
                          ...prev.certifications,
                          {
                            id: 'cert-' + Date.now(),
                            name: 'Certification Title',
                            issuer: 'Issuing Organization',
                            year: '2024',
                            credentialLink: ''
                          },
                        ],
                      }));
                    }}
                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Certification
                  </button>
                </div>

                <div className="space-y-4">
                  {activeResume.certifications.map((cert) => (
                    <div key={cert.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Certification Entry</span>
                        <button
                          onClick={() => {
                            updateResume((prev) => ({
                              ...prev,
                              certifications: prev.certifications.filter((c) => c.id !== cert.id),
                            }));
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Certification Name *</label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResume((prev) => ({
                                ...prev,
                                certifications: prev.certifications.map((c) => (c.id === cert.id ? { ...c, name: val } : c)),
                              }));
                            }}
                            placeholder="e.g. AWS Certified Cloud Practitioner"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Issuer *</label>
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResume((prev) => ({
                                ...prev,
                                certifications: prev.certifications.map((c) => (c.id === cert.id ? { ...c, issuer: val } : c)),
                              }));
                            }}
                            placeholder="e.g. Amazon Web Services"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Year</label>
                          <input
                            type="text"
                            value={cert.year}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateResume((prev) => ({
                                ...prev,
                                certifications: prev.certifications.map((c) => (c.id === cert.id ? { ...c, year: val } : c)),
                              }));
                            }}
                            placeholder="2024"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Credential URL (Optional)</label>
                        <input
                          type="text"
                          value={cert.credentialLink || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateResume((prev) => ({
                              ...prev,
                              certifications: prev.certifications.map((c) => (c.id === cert.id ? { ...c, credentialLink: val } : c)),
                            }));
                          }}
                          placeholder="https://coursera.org/verify/..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 9: Achievements */}
            {currentStep === 'achievements' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Achievements & Honors</h3>
                    <p className="text-xs text-slate-500">Hackathon awards, Dean's List, scholarships, or competition rankings.</p>
                  </div>
                  <button
                    onClick={() => {
                      updateResume((prev) => ({
                        ...prev,
                        achievements: [
                          ...prev.achievements,
                          {
                            id: 'ach-' + Date.now(),
                            title: 'Award / Honor Title',
                            description: 'Brief detail of competition or honor.',
                            year: '2024',
                          },
                        ],
                      }));
                    }}
                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Achievement
                  </button>
                </div>

                <div className="space-y-3">
                  {activeResume.achievements.map((ach) => (
                    <div key={ach.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={ach.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateResume((prev) => ({
                              ...prev,
                              achievements: prev.achievements.map((a) => (a.id === ach.id ? { ...a, title: val } : a)),
                            }));
                          }}
                          placeholder="e.g. 1st Place - University Hackathon"
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                        />
                        <input
                          type="text"
                          value={ach.year || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateResume((prev) => ({
                              ...prev,
                              achievements: prev.achievements.map((a) => (a.id === ach.id ? { ...a, year: val } : a)),
                            }));
                          }}
                          placeholder="Year"
                          className="w-24 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <button
                          onClick={() => {
                            updateResume((prev) => ({
                              ...prev,
                              achievements: prev.achievements.filter((a) => a.id !== ach.id),
                            }));
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={ach.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateResume((prev) => ({
                            ...prev,
                            achievements: prev.achievements.map((a) => (a.id === ach.id ? { ...a, description: val } : a)),
                          }));
                        }}
                        placeholder="Description of competition or contribution..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 10: Languages & Interests */}
            {currentStep === 'languages' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Languages & Extracurriculars</h3>
                  <p className="text-xs text-slate-500">Spoken languages with proficiency level and professional interests.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Languages Spoken</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {activeResume.languages.map((lang, lIdx) => (
                        <span key={lIdx} className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-medium text-slate-700 flex items-center gap-2">
                          <span className="font-bold">{lang.language}</span>
                          <span className="text-[10px] text-slate-500">({lang.proficiency})</span>
                          <button
                            type="button"
                            onClick={() => {
                              updateResume((prev) => ({
                                ...prev,
                                languages: prev.languages.filter((_, i) => i !== lIdx),
                              }));
                            }}
                            className="text-slate-400 hover:text-red-500 font-bold ml-1"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        id="newLanguageInput"
                        placeholder="Language (e.g. Spanish, German)"
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs flex-1"
                      />
                      <select
                        id="newLanguageProficiency"
                        defaultValue="Professional"
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="Native">Native</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Professional">Professional</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Basic">Basic</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const nameEl = document.getElementById('newLanguageInput') as HTMLInputElement;
                          const profEl = document.getElementById('newLanguageProficiency') as HTMLSelectElement;
                          if (nameEl && nameEl.value.trim()) {
                            updateResume((prev) => ({
                              ...prev,
                              languages: [...prev.languages, { language: nameEl.value.trim(), proficiency: profEl.value as any }],
                            }));
                            nameEl.value = '';
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                      >
                        + Add Language
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Professional Interests (Comma-separated)</label>
                    <input
                      type="text"
                      value={activeResume.interests.join(', ')}
                      onChange={(e) => {
                        const val = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        updateResume((prev) => ({ ...prev, interests: val }));
                      }}
                      placeholder="Open Source AI Models, Competitive Programming, Tech Podcasts, Robotics Club"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 11: Section Reordering */}
            {currentStep === 'reorder' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Customize Section Layout</h3>
                    <p className="text-xs text-slate-500">
                      ATS readers scan top-to-bottom. In Fresher Mode, skills and projects should precede employment history.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => reorderSections(['summary', 'skills', 'projects', 'internships', 'education', 'certifications', 'achievements', 'languages'])}
                      className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold"
                    >
                      Reset to Fresher Order
                    </button>
                    <button
                      type="button"
                      onClick={() => reorderSections(['summary', 'experience', 'skills', 'projects', 'certifications', 'education', 'achievements', 'languages'])}
                      className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold"
                    >
                      Reset to Experienced Order
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {activeResume.sectionOrder.map((secName, idx) => (
                    <div
                      key={secName}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                          {secName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => {
                            const copy = [...activeResume.sectionOrder];
                            const temp = copy[idx - 1];
                            copy[idx - 1] = copy[idx];
                            copy[idx] = temp;
                            reorderSections(copy);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={idx === activeResume.sectionOrder.length - 1}
                          onClick={() => {
                            const copy = [...activeResume.sectionOrder];
                            const temp = copy[idx + 1];
                            copy[idx + 1] = copy[idx];
                            copy[idx] = temp;
                            reorderSections(copy);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Form Action Buttons & Stepper Previous / Next Controls */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleManualSave}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5"
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Changes Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-slate-400" />
                      <span>Save Draft</span>
                    </>
                  )}
                </button>
              </div>

              {/* Previous / Next Stepper Buttons */}
              <div className="flex items-center gap-2.5">
                {currentStepIdx > 0 && (
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                )}

                {currentStepIdx < STEP_ORDER.length - 1 ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <span>Next Section</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate('preview')}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Completed Resume</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
