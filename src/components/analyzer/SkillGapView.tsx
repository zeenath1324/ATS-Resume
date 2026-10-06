import React from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Code,
  ShieldCheck,
  FolderGit2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { NavTab } from '../common/Navbar';

interface SkillGapViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({ onNavigate }) => {
  const { activeResume, activeJob, currentAnalysis } = useResume();

  const skillGap = currentAnalysis?.skillGap || {
    candidateSkills: activeResume.skills.flatMap(s => s.skills),
    missingSkills: ['FastAPI Backend Endpoints', 'Docker Containerization', 'Automated LLM Evaluation (Ragas)'],
    learningPath: [
      {
        step: 1,
        skill: 'FastAPI Backend Framework',
        action: 'Study async endpoints, dependency injection, and Pydantic request models.',
        projectIdea: 'Build an asynchronous REST microservice that wraps your Python inference logic.'
      },
      {
        step: 2,
        skill: 'Docker Containerization',
        action: 'Write a multi-stage Dockerfile and test local container port forwarding.',
        projectIdea: 'Create a docker-compose.yml orchestrating your frontend, backend, and Chroma vector database.'
      },
      {
        step: 3,
        skill: 'Ragas LLM Evaluation',
        action: 'Implement context precision and answer faithfulness metrics on a dataset of 30 test prompts.',
        projectIdea: 'Publish an automated evaluation benchmark report in your project repository.'
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Award className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Competency Alignment & Development
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Skill Gap Analyzer & Learning Roadmap
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comparing verified candidate competencies vs required qualifications for{' '}
            <strong className="text-slate-800">{activeJob.title}</strong> at {activeJob.company}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('interview')}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Practice Interview on Gaps</span>
          </button>
        </div>
      </div>

      {/* Strict Ethical Warning */}
      <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          <strong>Ethical Career Constitution:</strong> Real technical interviews test genuine depth. Never claim skills on your resume you have not practiced. Use our structured learning path below to build real code and add it legitimately!
        </span>
      </div>

      {/* Side by Side: You Have vs Missing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* You Have */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-base text-slate-900">
                You Have ({skillGap.candidateSkills.length})
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Verified on Resume
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Competencies recognized in your skills inventory, project details, and internships.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {skillGap.candidateSkills.map((sk, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Missing / Weak */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-slate-900">
                Missing / Weak ({skillGap.missingSkills.length})
              </h3>
            </div>
            <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              Job Requirements Gap
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Required or preferred in the job description, but not yet demonstrated in your profile.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {skillGap.missingSkills.map((sk, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                {sk}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Learning Path Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-lg text-slate-900">Recommended Learning Roadmap</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Actionable sequence to close qualification gaps through practical projects.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {skillGap.learningPath.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{step.skill}</h4>
                    <span className="text-[11px] text-blue-600 font-medium">Recommended Action Step</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 bg-white px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto font-mono">
                  ~1-2 Weeks Effort
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                <div className="p-3 bg-white rounded-xl border border-slate-200/70">
                  <span className="font-bold text-slate-700 block mb-1">Practical Learning Action:</span>
                  <p className="text-slate-600 leading-relaxed">{step.action}</p>
                </div>
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <span className="font-bold text-indigo-900 block mb-1 flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
                    Hands-On Resume Project Idea:
                  </span>
                  <p className="text-indigo-950 leading-relaxed">{step.projectIdea}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Once you build one of these project milestones, add it to your <strong>Projects</strong> tab in the builder to recalculate ATS score.
          </p>
          <button
            onClick={() => onNavigate('builder')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 shrink-0"
          >
            <span>Update Resume with New Skills</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
