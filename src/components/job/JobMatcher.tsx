import React, { useState, useRef } from 'react';
import {
  Briefcase,
  FileText,
  Upload,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Tag,
  Wrench,
  GraduationCap,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  Layers
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { apiService } from '../../services/api';
import { NavTab } from '../common/Navbar';
import { DEMO_JOB_DESCRIPTIONS } from '../../data/demoData';

interface JobMatcherProps {
  onNavigate: (tab: NavTab) => void;
}

export const JobMatcher: React.FC<JobMatcherProps> = ({ onNavigate }) => {
  const {
    savedJobs,
    activeJob,
    switchJob,
    saveJobDescription,
    deleteJob,
    runATSAnalysis,
    isAnalyzing,
  } = useResume();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [rawText, setRawText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawText(text);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    };
    reader.readAsText(file);
  };

  const handleExtractAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      alert('Please paste or upload a job description first.');
      return;
    }

    setIsExtracting(true);
    setStatusMessage('Analyzing job requirements with AI...');
    try {
      const saved = await saveJobDescription({
        title: title.trim() || 'Software Engineer Position',
        company: company.trim() || 'Hiring Company',
        rawText,
      });

      setStatusMessage('Job description parsed successfully! Running ATS compatibility scan...');
      await runATSAnalysis(saved);
      onNavigate('analyzer');
    } catch (err: any) {
      alert('Error parsing job description: ' + err.message);
    } finally {
      setIsExtracting(false);
      setStatusMessage(null);
    }
  };

  const handleLoadSample = (sample: typeof DEMO_JOB_DESCRIPTIONS[0]) => {
    setTitle(sample.title);
    setCompany(sample.company);
    setRawText(sample.rawText);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".txt,.md,.text"
        className="hidden"
      />

      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">Job Description Matcher</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Paste any job posting or upload a file. Our AI extracts required skills, technologies, and keywords, then runs ATS scoring against your active resume.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('analyzer')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Current ATS Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left input & right active extraction card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Input Job Description</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload File (.txt, .md)
                </button>
              </div>
            </div>

            {/* Quick preset buttons */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Or Load Industry Template:
              </span>
              <div className="flex flex-wrap gap-2">
                {DEMO_JOB_DESCRIPTIONS.map((jd) => (
                  <button
                    key={jd.id}
                    type="button"
                    onClick={() => handleLoadSample(jd)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all"
                  >
                    ⚡ {jd.title}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleExtractAndSave} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Job Title / Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Generative AI Engineer Intern"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. ScaleNexus AI"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Description Text *
                </label>
                <textarea
                  rows={10}
                  required
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste the full job posting here (responsibilities, qualifications, tech stack)..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isExtracting}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isExtracting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{statusMessage || 'Extracting with Gemini AI...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Extract Requirements & Run ATS Analysis</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Saved Job Targets List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">Saved Target Jobs ({savedJobs.length})</h3>
            <div className="space-y-2.5">
              {savedJobs.map((job) => {
                const isActive = job.id === activeJob.id;
                return (
                  <div
                    key={job.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isActive ? 'bg-blue-50/50 border-blue-500' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{job.title}</span>
                        <span className="text-[11px] text-slate-500">at {job.company}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Added: {job.dateAdded}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          switchJob(job.id);
                          await runATSAnalysis(job);
                          onNavigate('analyzer');
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                      >
                        {isActive ? 'Re-Analyze' : 'Select & Analyze'}
                      </button>
                      {savedJobs.length > 1 && (
                        <button
                          onClick={() => deleteJob(job.id)}
                          className="text-slate-400 hover:text-red-500 p-1.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Preview of Extracted Data: 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Active Comparison Target
                </span>
                <h3 className="font-bold text-base text-slate-900">{activeJob.title}</h3>
                <p className="text-xs text-slate-500">{activeJob.company}</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
                Active Job
              </span>
            </div>

            {activeJob.extracted ? (
              <div className="space-y-5 text-xs">
                {/* Required Skills */}
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Required Hard Skills ({activeJob.extracted.requiredSkills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeJob.extracted.requiredSkills.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preferred Skills */}
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-2">
                    <Tag className="w-4 h-4 text-blue-600" />
                    <span>Preferred Qualifications</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeJob.extracted.preferredSkills.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tools & Tech */}
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-2">
                    <Wrench className="w-4 h-4 text-purple-600" />
                    <span>Tools & Technologies</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeJob.extracted.tools.concat(activeJob.extracted.technologies).map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded-md text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Important Keywords */}
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>ATS High-Weight Keywords</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeJob.extracted.importantKeywords.map((kw, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[11px] font-mono">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Responsibilities */}
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-2">
                    <Layers className="w-4 h-4 text-slate-600" />
                    <span>Core Responsibilities</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    {activeJob.extracted.responsibilities.slice(0, 4).map((r, idx) => (
                      <li key={idx} className="leading-relaxed">{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={async () => {
                      await runATSAnalysis(activeJob);
                      onNavigate('analyzer');
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Run Full ATS Analysis</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Extraction data pending. Click "Extract Requirements" to parse.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
