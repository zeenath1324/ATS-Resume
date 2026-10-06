import React from 'react';
import {
  HeartPulse,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FileCheck2,
  TrendingUp
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { NavTab } from '../common/Navbar';

interface ResumeHealthViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const ResumeHealthView: React.FC<ResumeHealthViewProps> = ({ onNavigate }) => {
  const { activeResume, healthReport } = useResume();
  const { overallHealthScore, items } = healthReport;

  const criticalIssues = items.filter(i => i.severity === 'critical');
  const warningIssues = items.filter(i => i.severity === 'warning');
  const infoIssues = items.filter(i => i.severity === 'info');

  const healthColor =
    overallHealthScore >= 85 ? 'text-emerald-600' : overallHealthScore >= 70 ? 'text-blue-600' : 'text-amber-600';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with Health Score */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <HeartPulse className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Structural & Content Quality Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Resume Health: <span className={healthColor}>{overallHealthScore}/100</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Auditing <strong className="text-slate-800">{activeResume.title}</strong> for formatting hygiene, contact completeness, and impact metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('builder')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
          >
            <span>Fix in Resume Builder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Critical Blockers</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{criticalIssues.length}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Optimizations Needed</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{warningIssues.length}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Passed Checks</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{infoIssues.length}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Detailed Issues Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Health Audit Checklist</h3>
            <p className="text-xs text-slate-500">Address high-severity issues first to maximize recruiter callback rates.</p>
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item) => {
            const isCrit = item.severity === 'critical';
            const isWarn = item.severity === 'warning';
            const badgeBg = isCrit
              ? 'bg-rose-100 text-rose-800'
              : isWarn
              ? 'bg-amber-100 text-amber-800'
              : 'bg-emerald-100 text-emerald-800';
            const borderCol = isCrit
              ? 'border-rose-200 bg-rose-50/40'
              : isWarn
              ? 'border-amber-200 bg-amber-50/30'
              : 'border-emerald-200 bg-emerald-50/20';

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border ${borderCol} flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeBg}`}>
                      {item.severity}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{item.issue}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-1">
                    {item.recommendation}
                  </p>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onNavigate('builder')}
                    className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5"
                  >
                    <span>Fix in {item.sectionLink}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
