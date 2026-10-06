import React from 'react';
import {
  FileText,
  Target,
  Briefcase,
  Search,
  Award,
  Sparkles,
  Bot,
  ArrowRight,
  CheckCircle,
  GraduationCap,
  ShieldCheck,
  Check,
  Download,
  Zap,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { NavTab } from '../common/Navbar';
import { useResume } from '../../context/ResumeContext';

interface LandingPageProps {
  onNavigate: (tab: NavTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { toggleFresherMode, loadDemoData, isFresherMode } = useResume();

  const handleStartFresherDemo = () => {
    toggleFresherMode(true);
    loadDemoData();
    onNavigate('dashboard');
  };

  const featureCards = [
    {
      icon: FileText,
      title: 'AI Resume Builder',
      description: 'Structured multi-step builder with ATS-compliant sections, dynamic reordering, and tailored fresher modes.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Target,
      title: 'ATS Score Estimator',
      description: 'Transparent 0-100 compatibility estimate broken down by keywords, skills, experience, and structural parsability.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Briefcase,
      title: 'Job Match Engine',
      description: 'Deep extraction of required vs preferred competencies, tools, responsibilities, and key recruiter search criteria.',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: Search,
      title: 'Keyword Analysis',
      description: 'Visual green and warning flags for matched and missing keywords, explaining why they matter and natural integration spots.',
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: Award,
      title: 'Skill Gap & Learning Path',
      description: 'Side-by-side competency comparison paired with actionable, step-by-step practical roadmaps and hands-on projects.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: Sparkles,
      title: 'AI Resume Improvement',
      description: 'Transform weak bullet points into impactful action-driven statements with zero invented facts or hallucinated metrics.',
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: Bot,
      title: 'AI Interview Preparation',
      description: 'Personalized technical and behavioral mock interview questions generated directly from your resume and target job role.',
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  const steps = [
    {
      num: '1',
      title: 'Upload or create your resume',
      desc: 'Use our clean ATS-first builder or start from our sample fresher or experienced template.',
    },
    {
      num: '2',
      title: 'Paste the job description',
      desc: 'Our engine extracts hard skills, tools, required credentials, and core responsibilities.',
    },
    {
      num: '3',
      title: 'Let AI analyze the match',
      desc: 'Receive an honest, transparent ATS compatibility estimate with category scores.',
    },
    {
      num: '4',
      title: 'Improve your resume',
      desc: 'Enhance action verbs and address keyword gaps using side-by-side diff review modals.',
    },
    {
      num: '5',
      title: 'Download your ATS-friendly resume',
      desc: 'Export machine-readable PDF, Microsoft Word DOCX, or pure plain text ready for applications.',
    },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-100 bg-gradient-to-b from-blue-50/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>Tailored for College Students, Freshers & Career Pivoters</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Build an ATS-Friendly Resume That{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                Gets Noticed.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              Create, analyze and optimize your resume with AI — tailored to the job you actually want.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('builder')}
                className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 group text-base"
              >
                <span>Build My Resume</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('analyzer')}
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-semibold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 text-base"
              >
                <Target className="w-4 h-4 text-blue-600" />
                <span>Analyze My Resume</span>
              </button>

              <button
                onClick={handleStartFresherDemo}
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 text-base"
              >
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Try Demo Profile</span>
              </button>
            </div>

            {/* Micro Guarantees */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Zero Hallucinations Guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                100% Machine-Readable ATS Formats
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Dedicated Fresher Mode
              </span>
            </div>
          </div>

          {/* Interactive Hero Visual: ATS Scanner Snapshot */}
          <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Live ATS Compatibility Scanner
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Target Role: Generative AI & Software Engineer Intern
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Estimated ATS Score</p>
                  <p className="text-3xl font-extrabold text-blue-600">84<span className="text-base text-slate-400 font-normal">/100</span></p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Target className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* Quick Metrics in Scanner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-medium text-slate-500">Keyword Match</p>
                <p className="text-lg font-bold text-emerald-600 mt-0.5">86%</p>
                <span className="text-[10px] text-slate-400">6 of 7 critical terms</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-medium text-slate-500">Skills Alignment</p>
                <p className="text-lg font-bold text-emerald-600 mt-0.5">88%</p>
                <span className="text-[10px] text-slate-400">Strong core fit</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-medium text-slate-500">Academic / Projects</p>
                <p className="text-lg font-bold text-blue-600 mt-0.5">82%</p>
                <span className="text-[10px] text-slate-400">3 hands-on prototypes</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-medium text-slate-500">ATS Parsability</p>
                <p className="text-lg font-bold text-indigo-600 mt-0.5">95%</p>
                <span className="text-[10px] text-slate-400">Linear single-column</span>
              </div>
            </div>

            {/* Matched vs Missing Chips Preview */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4 items-start justify-between text-xs">
              <div className="space-y-1.5 flex-1">
                <span className="font-semibold text-slate-700">Matched High-Frequency Keywords:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-medium">✓ Python (x6)</span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-medium">✓ RAG Pipelines (x4)</span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-medium">✓ Vector Databases (x3)</span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-medium">✓ React (x3)</span>
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                <span className="font-semibold text-slate-700">Recommended Additions:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-medium">! FastAPI (In Projects)</span>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-medium">! Docker Container</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 bg-slate-50/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Engineered For Modern Recruitment
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything Job Seekers Need to Pass the Automated Filter
            </p>
            <p className="text-slate-600 mt-3 text-sm">
              From fresh graduates targeting their very first technical internship to experienced engineers, ATS Pro provides rigorous tools at every phase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                    <span>Explore feature &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works (5 Steps) */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Simple & Transparent
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How ATS Pro Works in 5 Steps
            </p>
            <p className="text-slate-600 mt-3 text-sm">
              We bridge the gap between candidate resumes and modern applicant tracking systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((st, i) => (
              <div
                key={i}
                className="relative bg-slate-50/60 rounded-3xl p-6 border border-slate-200/70 flex flex-col justify-between text-left"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-base mb-4 shadow-md shadow-blue-500/20">
                    {st.num}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {st.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fresher Mode Highlight Banner */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
                <GraduationCap className="w-4 h-4 text-emerald-200" />
                <span>Specialized Early-Career Architecture</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                No Corporate Work Experience? No Problem.
              </h3>
              <p className="text-emerald-100 text-sm leading-relaxed">
                When you switch on <strong>Fresher Mode</strong>, ATS Pro restructures your resume hierarchy to prioritize high-impact academic projects, hackathons, internships, coursework, and technical skills without penalizing you for lacking 5+ years of tenure.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStartFresherDemo}
                className="px-6 py-3.5 bg-white text-emerald-800 font-bold rounded-2xl shadow-lg hover:bg-emerald-50 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-emerald-600" />
                Launch Fresher Mode Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent AI Constitution Banner */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-slate-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ethical AI Standard</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Our Strict Truth & Anti-Hallucination Constitution
          </h3>
          <p className="max-w-2xl mx-auto text-slate-400 text-sm leading-relaxed">
            ATS Pro never invents companies, certifications, projects, or fake metrics. We only rephrase and elevate what you have genuinely achieved, providing transparent compatibility estimates rather than false guarantees.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all text-sm flex items-center gap-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
