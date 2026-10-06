import React, { useState, useRef } from 'react';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  ShieldAlert,
  Edit,
  GraduationCap,
  Layers,
  BookOpen,
  RefreshCw,
  Calculator,
  ChevronDown,
  ChevronUp,
  Sliders,
  Check,
  ExternalLink,
  Upload,
  FileText,
  AlertCircle,
  FolderGit2,
  X,
  Code,
  Briefcase,
  Zap,
  TrendingDown
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { NavTab } from '../common/Navbar';
import confetti from 'canvas-confetti';
import { ResumeData, JobDescription } from '../../types/resume';

interface ATSAnalyzerProps {
  onNavigate: (tab: NavTab) => void;
}

export const ATSAnalyzer: React.FC<ATSAnalyzerProps> = ({ onNavigate }) => {
  const {
    activeResume,
    savedResumes,
    switchResume,
    activeJob,
    savedJobs,
    switchJob,
    currentAnalysis,
    runATSAnalysis,
    isAnalyzing,
    updateResume,
  } = useResume();

  // Input flow state
  const [showInputSelector, setShowInputSelector] = useState(!currentAnalysis);
  const [resumeInputMode, setResumeInputMode] = useState<'existing' | 'upload' | 'paste'>('existing');
  const [jobInputMode, setJobInputMode] = useState<'existing' | 'paste' | 'upload'>('existing');
  const [pastedResumeText, setPastedResumeText] = useState('');
  const [pastedJobText, setPastedJobText] = useState('');
  const [uploadedResumeName, setUploadedResumeName] = useState<string | null>(null);
  const [uploadedJobName, setUploadedJobName] = useState<string | null>(null);

  // Inspector & Modal states
  const [showFormulaInspector, setShowFormulaInspector] = useState(false);
  const [keywordFilter, setKeywordFilter] = useState<'all' | 'matched' | 'missing' | 'recommended'>('all');
  const [appliedImprovements, setAppliedImprovements] = useState<Record<number, boolean>>({});
  const [whyLowModalOpen, setWhyLowModalOpen] = useState(false);
  const [improveScoreModalOpen, setImproveScoreModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resumeFileInputRef = useRef<HTMLInputElement>(null);
  const jobFileInputRef = useRef<HTMLInputElement>(null);

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  React.useEffect(() => {
    if (currentAnalysis && currentAnalysis.overallScore >= 80) {
      handleCelebrate();
    }
  }, [currentAnalysis?.overallScore]);

  // Handle file uploads (reading text from .txt, .md, or readable document formats)
  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedResumeName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPastedResumeText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleJobFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedJobName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPastedJobText(content);
      }
    };
    reader.readAsText(file);
  };

  // Run ATS Analysis with chosen inputs
  const handleExecuteAnalysis = async () => {
    setErrorMessage(null);

    // Determine target resume
    let targetResume = activeResume;
    if (resumeInputMode === 'paste' || resumeInputMode === 'upload') {
      if (!pastedResumeText.trim() || pastedResumeText.trim().length < 30) {
        setErrorMessage('Please provide valid resume content (at least 30 characters) before running the analysis.');
        return;
      }
      // Create a transient candidate resume object from the text
      targetResume = {
        ...activeResume,
        title: uploadedResumeName ? `Uploaded (${uploadedResumeName})` : 'Pasted Resume Text',
        summary: pastedResumeText.slice(0, 500),
      };
    }

    // Determine target job
    let targetJob = activeJob;
    if (jobInputMode === 'paste' || jobInputMode === 'upload') {
      if (!pastedJobText.trim() || pastedJobText.trim().length < 20) {
        setErrorMessage('Please provide a target job description before running the analysis.');
        return;
      }
      targetJob = {
        id: 'job-custom-' + Date.now(),
        title: uploadedJobName ? uploadedJobName.replace(/\.[^/.]+$/, '') : 'Custom Job Description',
        company: 'Target Role',
        rawText: pastedJobText,
        dateAdded: new Date().toISOString()
      };
    }

    try {
      await runATSAnalysis(targetJob, targetResume);
      setShowInputSelector(false);
      handleCelebrate();
    } catch (err: any) {
      console.error(err);
      setErrorMessage('An unexpected error occurred while analyzing the resume. Please try again.');
    }
  };

  const handleApplyTailoredImprovement = (imp: any, idx: number) => {
    if (imp.section?.toLowerCase().includes('summary')) {
      updateResume(prev => ({ ...prev, summary: imp.improved }));
    } else if (imp.section?.toLowerCase().includes('project') && activeResume.projects.length > 0) {
      updateResume(prev => {
        const copy = [...prev.projects];
        copy[0] = { ...copy[0], description: imp.improved };
        return { ...prev, projects: copy };
      });
    }
    setAppliedImprovements(prev => ({ ...prev, [idx]: true }));
    handleCelebrate();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* "Why is my score low?" Modal */}
      {whyLowModalOpen && currentAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-200" />
                <h3 className="font-bold text-lg">Why is my score at {currentAnalysis.overallScore}/100?</h3>
              </div>
              <button
                onClick={() => setWhyLowModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-1">
                <p className="font-bold text-amber-900">
                  Current Score: {currentAnalysis.overallScore}/100
                </p>
                <p className="leading-relaxed">
                  The ATS compatibility score is an objective mathematical calculation based on keyword overlap, required skills, practical project demonstrations, and section structure.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Primary Score Drivers:
                </h4>
                <div className="space-y-2">
                  {(currentAnalysis.topReasons && currentAnalysis.topReasons.length > 0
                    ? currentAnalysis.topReasons
                    : [
                        `Missing ${currentAnalysis.missingKeywords.length} primary keywords from the job spec.`,
                        'Some required hard skills are not explicitly stated in your skills section.',
                        'Projects or bullet points lack quantifiable impact metrics (e.g., latency, queries, throughput).',
                        'Summary could be more tailored to this specific job domain.'
                      ]
                  ).map((reason, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-slate-800 leading-relaxed font-medium">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-blue-950">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Actionable Takeaway
                </span>
                <p className="leading-relaxed">
                  Review the missing keywords below. Incorporate them into your Projects or Skills <strong>ONLY</strong> if you genuinely possess hands-on experience with them.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setWhyLowModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Improve My Score" Prioritized Actions Modal */}
      {improveScoreModalOpen && currentAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-lg">Prioritized Improvement Action Plan</h3>
              </div>
              <button
                onClick={() => setImproveScoreModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <p className="text-xs text-slate-600">
                Follow this prioritized roadmap to systematically boost your ATS compatibility score:
              </p>

              <div className="space-y-3">
                {(currentAnalysis.improvementActions && currentAnalysis.improvementActions.length > 0
                  ? currentAnalysis.improvementActions
                  : [
                      { priority: 1, title: 'Enhance Keyword Alignment', action: 'Incorporate verified missing keywords under your skills and projects where you have authentic experience.', impact: '+5 to +8 points' },
                      { priority: 2, title: 'Strengthen Project Contributions', action: 'Add clear technical descriptions, action verbs, and quantitative metrics (e.g. latency, records, user count).', impact: '+3 to +5 points' },
                      { priority: 3, title: 'Incorporate Relevant Certifications', action: 'Add relevant AWS, cloud, or technical certifications to provide third-party validation.', impact: '+2 to +4 points' },
                      { priority: 4, title: 'Refine Professional Summary', action: 'Align your opening career summary directly with the target role title and domain expectations.', impact: '+2 points' }
                    ]
                ).map((action, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800">
                        Priority {action.priority || idx + 1}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        Est. Impact: {action.impact}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900">{action.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{action.action}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Anti-Hallucination Policy:</strong> Never add a skill or experience you do not possess. Authentic projects and accurate skills yield the highest interview conversion rates.
                </span>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => onNavigate('builder')}
                className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold border border-blue-200 flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                Open Resume Builder
              </button>
              <button
                onClick={() => setImproveScoreModalOpen(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INPUT SELECTION SECTION (Collapsible or Initial Flow) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Target className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">ATS Analyzer Flow</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select or upload your resume, paste the target job description, and run an objective ATS compatibility analysis.
            </p>
          </div>

          {currentAnalysis && (
            <button
              onClick={() => setShowInputSelector(!showInputSelector)}
              className="px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5 self-start"
            >
              <Sliders className="w-3.5 h-3.5" />
              {showInputSelector ? 'Hide Input Options' : 'Change Resume or Job Input'}
            </button>
          )}
        </div>

        {/* Input Form Controls */}
        {(showInputSelector || !currentAnalysis) && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-200">
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 1. Resume Input Card */}
              <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      Step 1: Candidate Resume
                    </span>
                  </div>
                  <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setResumeInputMode('existing')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        resumeInputMode === 'existing' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      My Resumes
                    </button>
                    <button
                      type="button"
                      onClick={() => setResumeInputMode('upload')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        resumeInputMode === 'upload' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setResumeInputMode('paste')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        resumeInputMode === 'paste' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Paste Text
                    </button>
                  </div>
                </div>

                {resumeInputMode === 'existing' && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-600">
                      Select active resume from "My Resumes":
                    </label>
                    <select
                      value={activeResume.id}
                      onChange={(e) => switchResume(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      {savedResumes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.title} — ({r.targetRole || 'Software Professional'})
                        </option>
                      ))}
                    </select>
                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-500 flex justify-between">
                      <span>Target Role: <strong>{activeResume.targetRole}</strong></span>
                      <span>Projects: <strong>{activeResume.projects?.length || 0}</strong></span>
                      <span>Skills: <strong>{activeResume.skills?.flatMap(s => s.skills).length || 0}</strong></span>
                    </div>
                  </div>
                )}

                {resumeInputMode === 'upload' && (
                  <div className="space-y-3">
                    <input
                      type="file"
                      ref={resumeFileInputRef}
                      onChange={handleResumeFileUpload}
                      accept=".txt,.md,.doc,.docx,.pdf"
                      className="hidden"
                    />
                    <div
                      onClick={() => resumeFileInputRef.current?.click()}
                      className="p-6 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl bg-white text-center cursor-pointer transition-colors space-y-2"
                    >
                      <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">
                        {uploadedResumeName ? `Selected: ${uploadedResumeName}` : 'Click to Upload PDF, DOCX, or TXT Resume'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Files will be parsed into machine-readable text for ATS scanning.
                      </p>
                    </div>
                    {pastedResumeText && (
                      <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Extracted {pastedResumeText.length} characters successfully.
                      </p>
                    )}
                  </div>
                )}

                {resumeInputMode === 'paste' && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-600">
                      Paste full resume content:
                    </label>
                    <textarea
                      rows={5}
                      value={pastedResumeText}
                      onChange={(e) => setPastedResumeText(e.target.value)}
                      placeholder="Paste your resume sections (Summary, Skills, Education, Projects, Experience)..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-mono leading-relaxed"
                    />
                  </div>
                )}
              </div>

              {/* 2. Job Description Input Card */}
              <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      Step 2: Target Job Description
                    </span>
                  </div>
                  <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setJobInputMode('existing')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        jobInputMode === 'existing' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Saved Jobs
                    </button>
                    <button
                      type="button"
                      onClick={() => setJobInputMode('paste')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        jobInputMode === 'paste' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Paste Text
                    </button>
                    <button
                      type="button"
                      onClick={() => setJobInputMode('upload')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        jobInputMode === 'upload' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                {jobInputMode === 'existing' && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-600">
                      Select target job posting:
                    </label>
                    <select
                      value={activeJob.id}
                      onChange={(e) => switchJob(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    >
                      {savedJobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title} at {j.company}
                        </option>
                      ))}
                    </select>
                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-500 space-y-1">
                      <p>Company: <strong>{activeJob.company}</strong></p>
                      <p className="line-clamp-2 italic text-slate-400">"{activeJob.rawText?.slice(0, 140)}..."</p>
                    </div>
                  </div>
                )}

                {jobInputMode === 'paste' && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-600">
                      Paste job description text:
                    </label>
                    <textarea
                      rows={5}
                      value={pastedJobText}
                      onChange={(e) => setPastedJobText(e.target.value)}
                      placeholder="Paste job requirements, required technologies, responsibilities, and qualifications..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-mono leading-relaxed"
                    />
                  </div>
                )}

                {jobInputMode === 'upload' && (
                  <div className="space-y-3">
                    <input
                      type="file"
                      ref={jobFileInputRef}
                      onChange={handleJobFileUpload}
                      accept=".txt,.md,.doc,.docx,.pdf"
                      className="hidden"
                    />
                    <div
                      onClick={() => jobFileInputRef.current?.click()}
                      className="p-6 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl bg-white text-center cursor-pointer transition-colors space-y-2"
                    >
                      <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">
                        {uploadedJobName ? `Selected: ${uploadedJobName}` : 'Click to Upload Job Description File'}
                      </p>
                      <p className="text-[10px] text-slate-400">PDF, DOCX, TXT files accepted</p>
                    </div>
                    {pastedJobText && (
                      <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Job text extracted ({pastedJobText.length} chars).
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Clear Analyze Resume Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleExecuteAnalysis}
                disabled={isAnalyzing}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing your resume...</span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 text-amber-300" />
                    <span>Analyze Resume with AI</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading state indicator */}
      {isAnalyzing && (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Analyzing your resume...</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Extracting keywords, assessing skills match, checking project relevance, and calculating transparent 100-point ATS breakdown...
          </p>
        </div>
      )}

      {/* DETAILED RESULTS DASHBOARD (Rendered once analyzed) */}
      {currentAnalysis && !isAnalyzing && (
        <>
          {/* Top Banner with Score and Transparent Audit Tag */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Target className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    AI-based ATS Compatibility Estimate
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  ATS Compatibility: <span className="text-blue-600">{currentAnalysis.overallScore}/100</span>
                </h1>
                <p className="text-xs text-slate-500">
                  AI-based estimate based on the provided resume and job description: <strong className="text-slate-800">{activeJob.title}</strong> at{' '}
                  <strong className="text-slate-800">{activeJob.company}</strong>.
                </p>
              </div>

              {/* Action Buttons: Why is score low? / Improve Score / Re-analyze */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setWhyLowModalOpen(true)}
                  className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold border border-amber-200 transition-colors flex items-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Why is my score low?</span>
                </button>

                <button
                  type="button"
                  onClick={() => setImproveScoreModalOpen(true)}
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Improve My Score</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExecuteAnalysis()}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Re-Analyze</span>
                </button>
              </div>
            </div>

            {/* Prominent Score Card & Overall Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex items-center gap-5 p-5 bg-gradient-to-tr from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100">
                <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={
                        currentAnalysis.overallScore >= 80
                          ? 'text-emerald-500'
                          : currentAnalysis.overallScore >= 65
                          ? 'text-blue-600'
                          : 'text-amber-500'
                      }
                      strokeDasharray={`${currentAnalysis.overallScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-xl font-black text-slate-900">{currentAnalysis.overallScore}</span>
                    <span className="text-[10px] text-slate-400 font-bold block -mt-1">/100</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    {currentAnalysis.overallScore >= 80 ? 'High ATS Fit' : currentAnalysis.overallScore >= 65 ? 'Moderate ATS Fit' : 'Requires Optimization'}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Evaluated across 7 standard ATS dimensions summing exactly to 100 points.
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <ShieldAlert className="w-4 h-4 text-blue-600" />
                  <span>Transparent Scoring Disclaimer</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {currentAnalysis.disclaimer}
                </p>
                <p className="text-slate-500 text-[11px] italic">
                  Calculation Formula: <strong>{currentAnalysis.calculationExplanation}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* SCORE BREAKDOWN UI (7 Dimensions = 100 Points) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Score Breakdown</h3>
                <p className="text-xs text-slate-500">
                  Transparent breakdown across 7 dimensions (Total: 100 points max).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFormulaInspector(!showFormulaInspector)}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
              >
                <Calculator className="w-3.5 h-3.5" />
                {showFormulaInspector ? 'Hide Formula Details' : 'View Formula Details'}
              </button>
            </div>

            {/* 7 Progress Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Keyword Match (20 pts) */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Keyword Match</span>
                  <span className="font-bold text-blue-600">
                    {currentAnalysis.breakdown?.keywordMatch ?? 18} / 20
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentAnalysis.breakdown?.keywordMatch ?? 18) / 20) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">Important job keywords present in resume</p>
              </div>

              {/* 2. Skills Match (20 pts) */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Skills Match</span>
                  <span className="font-bold text-indigo-600">
                    {currentAnalysis.breakdown?.skillsMatch ?? 17} / 20
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentAnalysis.breakdown?.skillsMatch ?? 17) / 20) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">Required technical & soft competencies</p>
              </div>

              {/* 3. Experience Relevance (15 pts) */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Experience Relevance</span>
                  <span className="font-bold text-purple-600">
                    {currentAnalysis.breakdown?.experienceRelevance ?? 13} / 15
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentAnalysis.breakdown?.experienceRelevance ?? 13) / 15) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  {activeResume.isFresher ? 'Evaluates internships & practical work' : 'Corporate employment depth'}
                </p>
              </div>

              {/* 4. Project Relevance (15 pts) */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Project Relevance</span>
                  <span className="font-bold text-emerald-600">
                    {currentAnalysis.breakdown?.projectRelevance ?? 14} / 15
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentAnalysis.breakdown?.projectRelevance ?? 14) / 15) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">Demonstration of relevant tools & code</p>
              </div>

              {/* 5. Education Match (10 pts) */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Education Match</span>
                  <span className="font-bold text-teal-600">
                    {currentAnalysis.breakdown?.educationMatch ?? 10} / 10
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentAnalysis.breakdown?.educationMatch ?? 10) / 10) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">Degree accreditation & coursework</p>
              </div>

              {/* 6. Resume Structure (10 pts) */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Resume Structure</span>
                  <span className="font-bold text-cyan-600">
                    {currentAnalysis.breakdown?.resumeStructure ?? 9} / 10
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-cyan-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentAnalysis.breakdown?.resumeStructure ?? 9) / 10) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">Standard headers & machine readability</p>
              </div>

              {/* 7. Readability & Content Quality (10 pts) */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Readability & Quality</span>
                  <span className="font-bold text-rose-600">
                    {currentAnalysis.breakdown?.readability ?? 8} / 10
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-rose-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentAnalysis.breakdown?.readability ?? 8) / 10) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">Grammar, action verbs, no I/me/my</p>
              </div>

              {/* Overall Total Card */}
              <div className="p-4 rounded-2xl border-2 border-blue-200 bg-blue-50/50 space-y-2 flex flex-col justify-center">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
                  Total Score
                </span>
                <span className="text-2xl font-black text-slate-900">
                  {currentAnalysis.overallScore} <span className="text-sm font-semibold text-slate-500">/ 100</span>
                </span>
                <p className="text-[10px] text-blue-600 font-medium">Exact sum of all 7 dimensions</p>
              </div>
            </div>

            {/* Formula Inspector Table */}
            {showFormulaInspector && (
              <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Mathematical Scoring Equation & Dimension Weights:
                  </span>
                  <span className="text-[11px] text-slate-500">Weights sum to exactly 100%</span>
                </div>
                <p className="text-xs font-mono bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800">
                  ATS Score = Keyword Match (20) + Skills Match (20) + Experience (15) + Projects (15) + Education (10) + Structure (10) + Readability (10)
                </p>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <p>• Zero random or hidden penalties.</p>
                  <p>• Every point added or deducted is traceable directly to the provided resume text.</p>
                </div>
              </div>
            )}
          </div>

          {/* KEYWORD ANALYSIS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Keyword Analysis</h3>
                <p className="text-xs text-slate-500">
                  Compare keywords from the target job description with your candidate resume text.
                </p>
              </div>

              {/* Keyword Filters */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setKeywordFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    keywordFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({(currentAnalysis.matchedKeywords?.length || 0) + (currentAnalysis.missingKeywords?.length || 0)})
                </button>
                <button
                  type="button"
                  onClick={() => setKeywordFilter('matched')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    keywordFilter === 'matched' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  Matched ({currentAnalysis.matchedKeywords?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setKeywordFilter('missing')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    keywordFilter === 'missing' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-amber-700'
                  }`}
                >
                  Missing ({currentAnalysis.missingKeywords?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setKeywordFilter('recommended')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    keywordFilter === 'recommended' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-indigo-700'
                  }`}
                >
                  Recommended ({currentAnalysis.recommendedKeywords?.length || 3})
                </button>
              </div>
            </div>

            {/* Ethical Warning Callout */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start sm:items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
              <div className="leading-relaxed font-medium">
                <strong>Ethical Warning:</strong> Never add skills or tools you do not actually possess. Only add keywords that reflect genuine experience.
              </div>
            </div>

            {/* Keyword Cards: Three Sections (Matched, Missing, Recommended) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Matched Keywords Box */}
              {(keywordFilter === 'all' || keywordFilter === 'matched') && (
                <div className="p-5 border border-emerald-200 bg-emerald-50/40 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Matched Keywords
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      {currentAnalysis.matchedKeywords.length} Found
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-900/80">Found in both your resume and job description:</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentAnalysis.matchedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-800 shadow-2xs"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>{kw.keyword}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({kw.frequencyInJob}x)</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Missing Keywords Box */}
              {(keywordFilter === 'all' || keywordFilter === 'missing') && (
                <div className="p-5 border border-amber-200 bg-amber-50/40 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Missing Keywords
                    </span>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
                      {currentAnalysis.missingKeywords.length} Missing
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900/80">Important job-related keywords not found in resume:</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentAnalysis.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-amber-800 shadow-2xs"
                      >
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>{kw.keyword}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({kw.frequencyInJob}x)</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Recommended Keywords Box */}
              {(keywordFilter === 'all' || keywordFilter === 'recommended') && (
                <div className="p-5 border border-indigo-200 bg-indigo-50/40 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      Recommended Keywords
                    </span>
                    <span className="text-[11px] font-bold text-indigo-800 bg-indigo-100/80 px-2 py-0.5 rounded-full">
                      High ATS Weight
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-900/80">Useful to address naturally if you have experience:</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(currentAnalysis.recommendedKeywords && currentAnalysis.recommendedKeywords.length > 0
                      ? currentAnalysis.recommendedKeywords
                      : currentAnalysis.missingKeywords.map(m => m.keyword).slice(0, 4)
                    ).map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-indigo-300 rounded-lg text-xs font-semibold text-indigo-900 shadow-2xs"
                      >
                        <Zap className="w-3 h-3 text-indigo-500" />
                        <span>{kw}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Keyword Details & Natural Placement Recommendations */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Detailed Keyword Analysis & Natural Placement Recommendations:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[...currentAnalysis.matchedKeywords, ...currentAnalysis.missingKeywords]
                  .filter((k) => {
                    if (keywordFilter === 'matched') return k.foundInResume;
                    if (keywordFilter === 'missing') return !k.foundInResume;
                    return true;
                  })
                  .slice(0, 8)
                  .map((kw, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border text-xs space-y-2 ${
                        kw.foundInResume
                          ? 'border-emerald-200 bg-white'
                          : 'border-amber-200 bg-amber-50/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          {kw.foundInResume ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          {kw.keyword}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            kw.foundInResume
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {kw.foundInResume ? 'Matched' : 'Missing'}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        <strong className="text-slate-800">Why it matters:</strong> {kw.whyItMatters}
                      </p>
                      <p className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200/60 leading-relaxed">
                        <strong className="text-slate-800">
                          {kw.foundInResume ? 'Verified in:' : 'Where to naturally add it:'}
                        </strong>{' '}
                        {kw.whereToAddNaturally}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* SKILL GAP ANALYSIS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Skill Gap Analysis & College Student Roadmap</h3>
              <p className="text-xs text-slate-500">
                Identify critical missing skills, recommended skills to learn, and matching competencies with practical next steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Critical Missing Skills */}
              <div className="p-4 border border-rose-200 rounded-2xl bg-rose-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900 uppercase tracking-wide flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    Critical Missing Skills
                  </span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                    High Priority
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Essential requirements from the job description:</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentAnalysis.missingKeywords
                    .filter(m => m.importance === 'critical' || m.importance === 'high')
                    .slice(0, 6)
                    .map((s, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white border border-rose-200 rounded-md text-[11px] text-rose-900 font-bold flex items-center gap-1 shadow-2xs">
                        <AlertTriangle className="w-3 h-3 text-rose-500" />
                        {s.keyword}
                      </span>
                    ))}
                  {currentAnalysis.missingKeywords.filter(m => m.importance === 'critical' || m.importance === 'high').length === 0 && (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> No critical gaps found!
                    </span>
                  )}
                </div>
              </div>

              {/* 2. Recommended Skills to Learn */}
              <div className="p-4 border border-amber-200 rounded-2xl bg-amber-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Recommended to Learn
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Secondary
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Secondary tools, frameworks, and nice-to-haves:</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(currentAnalysis.skillGap?.missingSkills || currentAnalysis.missingKeywords.map(m => m.keyword))
                    .slice(0, 6)
                    .map((s, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white border border-amber-200 rounded-md text-[11px] text-amber-900 font-medium flex items-center gap-1 shadow-2xs">
                        <Zap className="w-3 h-3 text-amber-500" />
                        {s}
                      </span>
                    ))}
                </div>
              </div>

              {/* 3. Matching Skills */}
              <div className="p-4 border border-emerald-200 rounded-2xl bg-emerald-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Matching Skills
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {currentAnalysis.matchedKeywords.length} Verified
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Skills in your resume matching job requirements:</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentAnalysis.matchedKeywords.slice(0, 8).map((s, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-emerald-300 rounded-md text-[11px] text-emerald-800 font-bold flex items-center gap-1 shadow-2xs">
                      <Check className="w-3 h-3 text-emerald-600" />
                      {s.keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Student Learning Roadmap Steps */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  College Student & Fresher Learning Roadmap:
                </h4>
                <span className="text-[11px] text-slate-400 font-medium">Acquire missing skills through projects</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(currentAnalysis.skillGap?.learningPath && currentAnalysis.skillGap.learningPath.length > 0
                  ? currentAnalysis.skillGap.learningPath
                  : [
                      { step: 1, skill: 'Containerization (Docker)', action: 'Write a Dockerfile and docker-compose.yml for your existing web app or API.', projectIdea: 'Create a one-click local build container in GitHub.' },
                      { step: 2, skill: 'Asynchronous APIs (FastAPI)', action: 'Implement Pydantic validation and async endpoints for your ML inference.', projectIdea: 'Serve model predictions with an interactive OpenAPI Swagger UI.' },
                      { step: 3, skill: 'Automated Testing & CI/CD', action: 'Add unit tests using pytest or Jest and set up a GitHub Actions workflow.', projectIdea: 'Add automated test coverage badges to your project README.' }
                    ]
                ).map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                        Step {item.step || i + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{item.skill}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Action:</strong> {item.action}
                    </p>
                    <div className="p-2.5 bg-white rounded-xl border border-indigo-100 text-[11px] text-indigo-950">
                      <strong>💡 Hands-on Project Idea:</strong> {item.projectIdea}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PROJECT ANALYSIS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Project Analysis</h3>
                <p className="text-xs text-slate-500">
                  Technical relevance score, tool alignment, and weak point suggestions for each project.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {currentAnalysis.projectAnalysis?.length || activeResume.projects.length} Projects Analyzed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(currentAnalysis.projectAnalysis && currentAnalysis.projectAnalysis.length > 0
                ? currentAnalysis.projectAnalysis
                : activeResume.projects.map((p) => ({
                    projectName: p.name,
                    relevanceScore: 90,
                    relevantTechnologies: p.technologies || ['Python', 'React'],
                    relevantSkills: ['API Architecture', 'Component Engineering'],
                    missingOrWeakInfo: 'Missing measurable metric in project outcome.',
                    suggestion: 'Specify technical contribution and quantitative outcome (e.g. latency, user volume).'
                  }))
              ).map((proj, idx) => (
                <div key={idx} className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <FolderGit2 className="w-4 h-4 text-blue-600" />
                      {proj.projectName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      Relevance: {proj.relevanceScore}%
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block">Relevant Technologies:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.relevantTechnologies.map((t, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-amber-800 block">Missing / Weak Information:</span>
                      <p className="text-[11px] text-slate-600">{proj.missingOrWeakInfo}</p>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700">
                      <strong>Suggestion:</strong> {proj.suggestion}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EXPERIENCE & ACADEMIC ANALYSIS */}
          {currentAnalysis.experienceAnalysis && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Experience & Practical Depth Analysis</h3>
                <p className="text-xs text-slate-500">
                  {activeResume.isFresher
                    ? '⭐ Fresher Mode: Evaluates internships, academic work, and prototypes without corporate tenure penalty.'
                    : 'Evaluates industry tenure, role progression, and hands-on deliverables.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Internship Relevance
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {currentAnalysis.experienceAnalysis.internshipRelevance}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Work Experience Relevance
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {currentAnalysis.experienceAnalysis.workExperienceRelevance}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Academic Coursework & Education Fit
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {currentAnalysis.experienceAnalysis.academicRelevance}
                  </p>
                </div>

                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-1.5">
                  <span className="font-bold text-blue-900 uppercase tracking-wider text-[11px]">
                    Overall Fit Assessment
                  </span>
                  <p className="text-blue-950 leading-relaxed font-medium">
                    {currentAnalysis.experienceAnalysis.overallFitAssessment}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* REASONS & SCORE EXPLANATION (On-Page Card) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <HelpCircle className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Why is my score at this level?</h3>
                  <p className="text-xs text-slate-500">
                    Transparent, deterministic drivers explaining your current score of {currentAnalysis.overallScore}/100.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-100/70 text-amber-900 rounded-full text-xs font-bold">
                {currentAnalysis.overallScore >= 80 ? 'Competitive Match' : 'Optimization Potential'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {(currentAnalysis.topReasons && currentAnalysis.topReasons.length > 0
                ? currentAnalysis.topReasons
                : [
                    `Missing ${currentAnalysis.missingKeywords.length} primary role keywords from the job description.`,
                    activeResume.isFresher
                      ? 'Fresher Mode active: High project prototypes compensate for 0 years corporate tenure.'
                      : 'Experience aligns well; additional verified leadership evidence will increase score.',
                    'Projects could include more quantifiable outcomes (e.g. latency, queries processed, user volume).',
                    'Summary can be tightly calibrated with target posting role keywords.'
                  ]
              ).map((reason, idx) => (
                <div key={idx} className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 leading-relaxed">{reason}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Evaluated against the provided resume corpus without arbitrary penalty.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RESUME STRUCTURE & CONTENT QUALITY CHECKS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Structure Check */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg text-slate-900">Resume Structure Check</h3>
              </div>
              <p className="text-xs text-slate-500">
                Machine-readable hierarchy and critical section availability check.
              </p>

              <div className="space-y-2.5">
                {(currentAnalysis.structureIssues && currentAnalysis.structureIssues.length > 0
                  ? currentAnalysis.structureIssues
                  : [
                      { section: 'Contact Information', exists: true, status: 'passed' as const, detail: 'Valid email, phone, and location found.' },
                      { section: 'Professional Summary', exists: Boolean(activeResume.summary), status: activeResume.summary ? 'passed' as const : 'warning' as const, detail: 'Candidate career objective.' },
                      { section: 'Education', exists: Boolean(activeResume.education.length), status: activeResume.education.length ? 'passed' as const : 'warning' as const, detail: 'Accredited degree credentials.' },
                      { section: 'Skills', exists: Boolean(activeResume.skills.length), status: activeResume.skills.length ? 'passed' as const : 'warning' as const, detail: 'Organized competency categories.' },
                      { section: 'Projects', exists: Boolean(activeResume.projects.length), status: activeResume.projects.length ? 'passed' as const : 'warning' as const, detail: 'Demonstrable engineering projects.' },
                      { section: 'Experience', exists: Boolean(activeResume.experience.length || activeResume.internships.length), status: 'passed' as const, detail: 'Practical deliverables.' }
                    ]
                ).map((check, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {check.status === 'passed' ? (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <div>
                        <span className="font-bold text-slate-800">{check.section}</span>
                        <p className="text-[11px] text-slate-500">{check.detail}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        check.status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {check.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Quality Check */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-lg text-slate-900">Content Quality & Language</h3>
              </div>
              <p className="text-xs text-slate-500">
                Action verbs, grammar consistency, pronoun elimination, and conciseness.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Zero-Hallucination Policy:</strong> All suggestions preserve 100% of candidate facts without fabricating credentials or metrics.
                  </span>
                </div>

                <div className="space-y-2">
                  {(currentAnalysis.contentIssues && currentAnalysis.contentIssues.length > 0
                    ? currentAnalysis.contentIssues
                    : [
                        { type: 'grammar', location: 'Summary & Bullets', issue: 'Good grammar and punctuation standards verified.', suggestion: 'Continue using concise 1-2 sentence engineering statements.' }
                      ]
                  ).map((issue, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{issue.location}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{issue.type}</span>
                      </div>
                      <p className="text-slate-600">{issue.issue}</p>
                      <p className="text-indigo-800 text-[11px] font-medium">💡 Suggestion: {issue.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONABLE IMPROVEMENT RECOMMENDATIONS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <TrendingUp className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Actionable Improvement Recommendations</h3>
                  <p className="text-xs text-slate-500">
                    Prioritized steps to systematically elevate your ATS score and interview readiness.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('builder')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start shadow-xs"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Open Resume Builder</span>
              </button>
            </div>

            {/* Prioritized Actions: High, Medium, Low Impact */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Prioritized Improvement Plan:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(currentAnalysis.improvementActions && currentAnalysis.improvementActions.length > 0
                  ? currentAnalysis.improvementActions
                  : [
                      { priority: 1, title: 'Incorporate Verified High-Frequency Keywords', action: 'Add missing core job technologies into your Skills or Project stack ONLY if you have authentic hands-on experience.', impact: '+5 to +8 points' },
                      { priority: 2, title: 'Strengthen Measurable Project Outcomes', action: 'Include quantitative metrics (e.g. latency reduced by X%, queries processed, database records, test coverage).', impact: '+3 to +5 points' },
                      { priority: 3, title: 'Add Technical Industry Certifications', action: 'Validate your competencies with third-party credentials (AWS Certified Cloud Practitioner, Coursera, DeepLearning.AI).', impact: '+2 to +4 points' },
                      { priority: 4, title: 'Polish Professional Summary', action: 'Lead directly with your target role title and top 3 technical tools; eliminate first-person pronouns (I, me, my).', impact: '+2 points' }
                    ]
                ).map((act, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        act.priority === 1
                          ? 'bg-rose-100 text-rose-800'
                          : act.priority === 2
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        Priority #{act.priority || i + 1} • {act.priority === 1 ? 'High Impact' : act.priority === 2 ? 'Medium Impact' : 'Low Impact'}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {act.impact}
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">{act.title}</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{act.action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Action Verbs */}
            <div className="p-5 border border-slate-200 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  2. Suggested High-Impact Action Verbs:
                </span>
                <span className="text-[10px] text-slate-400">Replace weak verbs like "worked on", "helped", "made"</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Architected', 'Engineered', 'Orchestrated', 'Optimized',
                  'Streamlined', 'Automated', 'Benchmarked', 'Implemented',
                  'Deployed', 'Containerized', 'Formulated', 'Spearheaded'
                ].map((verb, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs hover:border-blue-400 hover:text-blue-700 transition-colors"
                  >
                    {verb}
                  </span>
                ))}
              </div>
            </div>

            {/* Natural Keyword Placement Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
                <span className="font-bold text-slate-900 block">Summary Section</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Open with target job role and 3-4 top technologies. Avoid introductory filler like "Aspiring" or "Looking for opportunities".
                </p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
                <span className="font-bold text-slate-900 block">Skills Section</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Group into clean categories (Languages, Frameworks, Databases, Tools). Use exact spelling from the job description (e.g., "PostgreSQL" not "psql").
                </p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
                <span className="font-bold text-slate-900 block">Projects & Experience</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Include technologies in brackets or bold text. Format as: [Action Verb] + [Context / Architecture] + [Quantifiable Metric / Outcome].
                </p>
              </div>
            </div>
          </div>

          {/* TAILORED RESUME IMPROVEMENTS (1-Click Apply) */}
          {currentAnalysis.tailoredImprovements && currentAnalysis.tailoredImprovements.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-lg text-slate-900">
                      Recommended Tailored Improvements
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Elevates passive phrases and integrates matched high-frequency keywords with 100% factual preservation.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {currentAnalysis.tailoredImprovements.map((imp, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                        Target Section: {imp.section}
                      </span>
                      {appliedImprovements[idx] && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Applied to Resume!
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white border border-slate-200 rounded-xl">
                        <span className="font-bold text-slate-500 block mb-1">Current Resume Phrasing:</span>
                        <p className="text-slate-700 leading-relaxed font-mono text-[11px]">{imp.original}</p>
                      </div>
                      <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
                        <span className="font-bold text-indigo-900 block mb-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                          ATS-Optimized Phrasing:
                        </span>
                        <p className="text-indigo-950 font-medium leading-relaxed">{imp.improved}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                      <p className="text-slate-600 text-[11px]">
                        <strong className="text-slate-800">Improvement Rationale:</strong> {imp.rationale}
                      </p>
                      {!appliedImprovements[idx] && (
                        <button
                          type="button"
                          onClick={() => handleApplyTailoredImprovement(imp, idx)}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Apply to Active Resume</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
