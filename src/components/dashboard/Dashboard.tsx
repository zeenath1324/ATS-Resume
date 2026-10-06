import React, { useRef } from 'react';
import {
  Sparkles,
  FileText,
  Target,
  Plus,
  Upload,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Award,
  Layers,
  CheckCircle2,
  Calendar,
  GraduationCap,
  Briefcase,
  Play,
  HeartPulse
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import { NavTab } from '../common/Navbar';

interface DashboardProps {
  onNavigate: (tab: NavTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const {
    activeResume,
    savedResumes,
    savedJobs,
    activeJob,
    currentAnalysis,
    healthReport,
    createNewResume,
    switchResume,
    switchJob,
    isFresherMode,
    toggleFresherMode,
  } = useResume();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resume completion calculation
  const completionPercentage = React.useMemo(() => {
    let completed = 0;
    const total = 6;
    if (activeResume.personalInfo.fullName && activeResume.personalInfo.email) completed++;
    if (activeResume.summary && activeResume.summary.length > 30) completed++;
    if (activeResume.education.length > 0) completed++;
    if (activeResume.skills.flatMap(s => s.skills).length >= 5) completed++;
    if (activeResume.projects.length > 0) completed++;
    if (activeResume.isFresher ? activeResume.internships.length > 0 || activeResume.certifications.length > 0 : activeResume.experience.length > 0) completed++;
    return Math.round((completed / total) * 100);
  }, [activeResume]);

  const atsScore = currentAnalysis?.overallScore || 84;
  const missingSkillsCount = currentAnalysis?.skillGap.missingSkills.length || 3;

  // Handle json/txt resume upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        // If JSON format
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (parsed.personalInfo) {
            createNewResume(`Imported (${file.name.replace('.json', '')})`);
            return;
          }
        }
        // If text, create new resume and populate summary/skills
        createNewResume(`Uploaded Resume (${file.name})`);
        onNavigate('builder');
      } catch (err) {
        alert('Could not parse file. Creating a structured draft for you.');
        createNewResume('Draft Resume');
        onNavigate('builder');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".txt,.json,.md"
        className="hidden"
      />

      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {isFresherMode ? '🎓 Fresher Candidate Mode' : '💼 Experienced Professional Mode'}
            </span>
            <button
              onClick={() => toggleFresherMode()}
              className="text-xs text-blue-200 hover:text-white underline"
            >
              (Switch to {isFresherMode ? 'Experienced' : 'Fresher'})
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back 👋 {user?.name || 'Job Seeker'}
          </h1>
          <p className="text-blue-100 text-sm max-w-xl leading-relaxed">
            Optimizing active resume <strong className="text-white">"{activeResume.title}"</strong> for{' '}
            <strong className="text-white">{activeJob.title}</strong> at {activeJob.company}.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={() => createNewResume()}
            className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create New Resume
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl font-semibold text-xs border border-white/20 transition-all flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            Upload Resume
          </button>
          <button
            onClick={() => onNavigate('analyzer')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Target className="w-4 h-4" />
            Analyze Resume
          </button>
          <button
            onClick={() => onNavigate('interview')}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Practice Interview
          </button>
        </div>
      </div>

      {/* 4 Core Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: ATS Score with Circular Indicator */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current ATS Score
              </span>
              <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
                <Target className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-600"
                    strokeDasharray={`${atsScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-sm font-extrabold text-slate-900">{atsScore}</span>
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900">{atsScore}/100</p>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> High ATS Match
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[10px] text-slate-400">AI-based compatibility estimate</span>
            <button
              onClick={() => onNavigate('analyzer')}
              className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 text-[11px]"
            >
              View &rarr;
            </button>
          </div>
        </div>

        {/* Card 2: Job Match Score */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Job Match Score
              </span>
              <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
                <Briefcase className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-extrabold text-emerald-600">
                {currentAnalysis?.categories.skillsMatch.score || 88}%
              </p>
              <p className="text-xs text-slate-600 mt-1 line-clamp-1 font-medium">
                Against: {activeJob.title}
              </p>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${currentAnalysis?.categories.skillsMatch.score || 88}%` }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[10px] text-slate-400">Matched 6 key skills</span>
            <button
              onClick={() => onNavigate('jobMatcher')}
              className="font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 text-[11px]"
            >
              Change Job &rarr;
            </button>
          </div>
        </div>

        {/* Card 3: Resume Completion */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Resume Completion
              </span>
              <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600">
                <FileText className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-extrabold text-indigo-600">
                {completionPercentage}%
              </p>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Health Score: {healthReport.overallHealthScore}/100
              </p>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[10px] text-slate-400">
              {healthReport.items.filter(i => i.severity === 'critical').length} critical issues
            </span>
            <button
              onClick={() => onNavigate('health')}
              className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-[11px]"
            >
              Check Health &rarr;
            </button>
          </div>
        </div>

        {/* Card 4: Missing Skills Gap */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Missing Skills
              </span>
              <span className="p-1.5 rounded-xl bg-amber-50 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-extrabold text-amber-600">
                {missingSkillsCount} Skills
              </p>
              <p className="text-xs text-slate-600 mt-1 line-clamp-1 font-medium">
                {currentAnalysis?.skillGap.missingSkills.join(', ') || 'FastAPI, Docker'}
              </p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-semibold">
                Learning Roadmap Ready
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[10px] text-slate-400">Never fake skills</span>
            <button
              onClick={() => onNavigate('skillGap')}
              className="font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 text-[11px]"
            >
              View Roadmap &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Grid: My Resumes & Recent Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: My Resumes & Recent Analyses */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: My Resumes */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">My Resumes</h3>
                <p className="text-xs text-slate-500">Manage multiple tailored versions for different job descriptions.</p>
              </div>
              <button
                onClick={() => createNewResume()}
                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Resume</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedResumes.map((resume) => {
                const isActive = resume.id === activeResume.id;
                return (
                  <div
                    key={resume.id}
                    className={`rounded-2xl p-4.5 border transition-all ${
                      isActive
                        ? 'border-blue-500 bg-blue-50/20 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="font-bold text-sm text-slate-900 truncate max-w-[170px]">
                          {resume.title}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        resume.isFresher ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {resume.isFresher ? 'Fresher' : 'Experienced'}
                      </span>
                    </div>

                    <div className="mt-3 text-xs text-slate-500 space-y-1">
                      <p className="truncate">Target: {resume.targetRole || 'Not specified'}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Modified: {new Date(resume.lastModified).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          Template: {resume.template}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isActive && (
                          <button
                            onClick={() => switchResume(resume.id)}
                            className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
                          >
                            Set Active
                          </button>
                        )}
                        <button
                          onClick={() => {
                            switchResume(resume.id);
                            onNavigate('builder');
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            switchResume(resume.id);
                            onNavigate('preview');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                        >
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Recent Analyses & Job Matching */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Job Target Analyses</h3>
                <p className="text-xs text-slate-500">Benchmark your resume against multiple targeted job descriptions.</p>
              </div>
              <button
                onClick={() => onNavigate('jobMatcher')}
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Job Target</span>
              </button>
            </div>

            <div className="space-y-3">
              {savedJobs.map((job) => {
                const isSelected = job.id === activeJob.id;
                return (
                  <div
                    key={job.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Briefcase className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <h4 className="font-bold text-sm text-slate-900">{job.title}</h4>
                        <span className="text-xs text-slate-500">at {job.company}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {job.extracted?.requiredSkills.slice(0, 5).map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Match</span>
                        <span className="text-base font-extrabold text-emerald-600">
                          {isSelected ? (currentAnalysis?.overallScore || 84) : 78}%
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          switchJob(job.id);
                          onNavigate('analyzer');
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                      >
                        <span>Analyze</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recommended Skills & Interview Prep */}
        <div className="space-y-8">
          {/* Recommended Skills Roadmap */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-base">Recommended Skills</h3>
              </div>
              <button
                onClick={() => onNavigate('skillGap')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                View all
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              High-value competencies currently missing from your profile for <strong className="text-slate-700">{activeJob.title}</strong>:
            </p>

            <div className="space-y-3">
              {currentAnalysis?.skillGap.learningPath.slice(0, 3).map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs">
                  <div className="flex items-center justify-between font-bold text-amber-900 mb-1">
                    <span>Step {item.step}: {item.skill}</span>
                    <span className="text-[10px] bg-amber-200/70 px-1.5 py-0.5 rounded">High Demand</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {item.action}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                onClick={() => onNavigate('skillGap')}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Full Learning Pathway</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* AI Interview Coach Preview */}
          <div className="bg-gradient-to-tr from-purple-700 to-indigo-800 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="font-bold text-base">AI Interview Coach</h3>
            </div>
            <p className="text-xs text-purple-100 leading-relaxed mb-4">
              Practice real technical and project deep-dive questions based on your RAG & Python projects and get 5-axis objective feedback.
            </p>
            <div className="p-3 bg-white/10 rounded-2xl border border-white/15 text-xs space-y-1 mb-4">
              <span className="text-[10px] text-purple-200 font-bold uppercase tracking-wider block">Sample Question</span>
              <p className="text-white font-medium italic">
                "In your DocuSense project, how did you tune chunk size and overlap to prevent citation hallucinations?"
              </p>
            </div>
            <button
              onClick={() => onNavigate('interview')}
              className="w-full py-2.5 bg-white text-purple-900 hover:bg-purple-50 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Mock Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
